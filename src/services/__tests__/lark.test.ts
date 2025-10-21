import { sendLarkMessage } from '@/services/lark';

declare const global: {
  fetch: jest.Mock;
};

describe('lark service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    ) as jest.Mock;
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should send a message to the Lark webhook', async () => {
    process.env.LARK_WEBHOOK_URL = 'https://example.com/webhook';
    await sendLarkMessage('Test message');

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msg_type: 'text',
        content: {
          text: 'yay-alert: Test message',
        },
      }),
    });
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

  it('should log an error if the fetch request fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    process.env.LARK_WEBHOOK_URL = 'https://example.com/webhook';
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      }),
    );

    await sendLarkMessage('Test message');

    expect(global.fetch).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to send message to Lark: Internal Server Error',
    );

    consoleErrorSpy.mockRestore();
  });
});
