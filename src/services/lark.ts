import axios from 'axios';

/**
 * Types for Lark API responses
 */
interface LarkResponse {
  code: number;
  msg: string;
  data?: unknown;
}

/**
 * Formats a message with environment context and timestamp.
 */
function formatLarkMessage(message: string): string {
  const env = process.env.NODE_ENV ?? 'development';
  const timestamp = new Date().toISOString();
  return `${message}\nEnv: [${env}]\nTime: [${timestamp}]`;
}

/**
 * Sends a message to a Lark webhook with retries and timeout.
 * @param message The message to send.
 * @param retryCount Number of retry attempts (default: 2)
 * @param delays
 * @returns Promise<boolean> indicating success or failure
 */
export async function sendLarkMessage(
  message: string,
  retryCount = 2,
  delays: number[] = [1000, 3000, 5000],
): Promise<boolean> {
  const webhookUrl = process.env.LARK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[Lark] Missing LARK_WEBHOOK_URL in environment.');
    return false;
  }

  if (!message?.trim()) {
    console.warn('[Lark] Empty message. Skipping send.');
    return false;
  }

  const formattedMessage = formatLarkMessage(message);
  const payload = {
    msg_type: 'text',
    content: { text: `yay-alert: ${formattedMessage}` },
  };

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const res = await axios.post<LarkResponse>(webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000, // 5s timeout
        validateStatus: () => true, // allow non-2xx responses to be handled manually
      });

      if (res.status !== 200 || res.data.code !== 0) {
        throw new Error(
          `Lark API error: ${res.status} ${res.data?.msg ?? 'Unknown error'}`,
        );
      }

      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.msg ||
        err?.message ||
        JSON.stringify(err, null, 2);
      console.error(`[Lark] Attempt ${attempt + 1} failed: ${msg}`);

      if (attempt >= retryCount) {
        console.error('[Lark] All retry attempts failed.');
        return false;
      }

      await new Promise((r) => setTimeout(r, delays[attempt] ?? 5000));
    }
  }

  return false;
}
