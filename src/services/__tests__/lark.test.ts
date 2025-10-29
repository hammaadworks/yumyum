/**
 * @jest-environment node
 */

import { sendLarkMessage } from '@/services/lark';
import axios from 'axios';
import dotenv from 'dotenv';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// --- Load environment variables safely ---
dotenv.config({ path: '.env.test', quiet: true });

// --- Remove dotenv internal noise ---
delete process.env.DEBUG;
delete process.env.NODE_DEBUG;

// ------------------- UNIT TESTS -------------------
describe('Lark service (unit)', () => {
  const ORIGINAL_ENV = process.env;
  const MOCK_WEBHOOK_URL = process.env.LARK_WEBHOOK_URL;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');
    jest.resetModules();

    process.env = { ...ORIGINAL_ENV, LARK_WEBHOOK_URL: MOCK_WEBHOOK_URL };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
    process.env = ORIGINAL_ENV;
  });

  it('✅ sends a message successfully to Lark webhook', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { code: 0, msg: 'success' },
    });

    const result = await sendLarkMessage('Test message');

    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      MOCK_WEBHOOK_URL,
      expect.objectContaining({
        msg_type: 'text',
        content: expect.objectContaining({
          text: expect.stringContaining('yay-alert: Test message'),
        }),
      }),
      expect.any(Object),
    );
  });

  it('⚠️ warns and skips if webhook URL is missing', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    delete process.env.LARK_WEBHOOK_URL;

    const result = await sendLarkMessage('Test message');
    expect(result).toBe(false);
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      '[Lark] Missing LARK_WEBHOOK_URL in environment.',
    );
  });

  it('⚠️ warns and skips if message is empty', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await sendLarkMessage('   ');

    expect(result).toBe(false);
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      '[Lark] Empty message. Skipping send.',
    );
  });

  it('🔁 retries and logs errors when axios fails (instant)', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.post
      .mockRejectedValueOnce(new Error('500 Internal Server Error'))
      .mockRejectedValueOnce(new Error('500 Internal Server Error'));

    // 🧩 Mock setTimeout to run instantly (type-safe)
    const sleepSpy = jest.spyOn(global, 'setTimeout').mockImplementation(((
      fn: (...args: any[]) => void,
    ) => {
      if (typeof fn === 'function') fn();
      // Return a fake Timeout handle compatible with Node
      return {} as unknown as NodeJS.Timeout;
    }) as typeof setTimeout);

    // 🔥 Run the function (instant)
    const result = await sendLarkMessage('Failure test', 1, [100, 200]);

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    expect(result).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Lark] Attempt 1 failed:'),
    );
    expect(errorSpy).toHaveBeenCalledWith('[Lark] All retry attempts failed.');

    // cleanup
    sleepSpy.mockRestore();
    errorSpy.mockRestore();
  }, 2000);

  it('🧱 handles invalid API response structure gracefully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { msg: 'Missing code field' },
    } as any);

    const result = await sendLarkMessage('Broken JSON', 0);
    expect(result).toBe(false);
  });
});

// ------------------- REAL INTEGRATION TEST -------------------
/**
 * 🧪 Run manually to actually send a message.
 * ⚠️ Skipped in CI. Requires valid LARK_WEBHOOK_URL in .env.test or .env.local.
 */
describe.skip('Lark service (real integration test)', () => {
  jest.unmock('axios');
  const realAxios = jest.requireActual('axios');

  beforeAll(() => {
    // swap back to real axios
    (axios as any).post = realAxios.post;
  });

  it('📨 actually sends a real message to Lark', async () => {
    jest.setTimeout(15000);
    const result = await sendLarkMessage(
      'Alhamdulillah, Real integration test message',
    );
    expect(result).toBe(true);
  });
});
