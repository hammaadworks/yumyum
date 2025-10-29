import { sendLarkMessage } from '@/services/lark';
import dotenv from 'dotenv';


// Silence dotenv internal logs
delete process.env.DEBUG;
delete process.env.NODE_DEBUG;

dotenv.config({ path: '.env.test' }); // ✅ Load environment variables safely

describe('Lark service', () => {
  const originalEnv = process.env;
  const mockWebhookUrl = process.env.LARK_WEBHOOK_URL;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.LARK_WEBHOOK_URL = mockWebhookUrl;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ code: 0, msg: 'success' }),
      }),
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  it('should send a message to the Lark webhook', async () => {
    await sendLarkMessage('Test message');

    expect(global.fetch).toHaveBeenCalledWith(
      mockWebhookUrl,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"yay-alert: Test message'),
      }),
    );
  });

  it('should log an error if the webhook URL is not set', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    delete process.env.LARK_WEBHOOK_URL;

    await sendLarkMessage('Test message');

    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'LARK_WEBHOOK_URL is not set. Cannot send message to Lark.',
    );

    consoleErrorSpy.mockRestore();
  });

  it('should retry and log errors if fetch fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    await sendLarkMessage('Test message', 0); // No retries to simplify test

    expect(global.fetch).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Lark message failed'),
      expect.stringContaining('HTTP error 500: Internal Server Error'),
    );

    consoleErrorSpy.mockRestore();
  });
});
