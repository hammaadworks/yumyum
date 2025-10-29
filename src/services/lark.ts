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
 * @returns Promise<boolean> indicating success or failure
 */
export async function sendLarkMessage(
  message: string,
  retryCount = 2,
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

  const delays = [1000, 3000, 5000]; // 1s, 3s, 5s backoff

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = (await res.json().catch(() => null)) as LarkResponse | null;

      if (!res.ok || !data || data.code !== 0) {
        throw new Error(
          `Lark API error: ${res.status} ${data?.msg ?? 'Unknown error'}`,
        );
      }

      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : JSON.stringify(err, null, 2);
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
