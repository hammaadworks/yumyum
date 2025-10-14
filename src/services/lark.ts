/**
 * Sends a message to a Lark webhook.
 * @param message The message to send.
 * @returns A promise that resolves when the message has been sent.
 */
export async function sendLarkMessage(message: string): Promise<void> {
  const webhookUrl = process.env.LARK_WEBHOOK_URL;

  if (!webhookUrl) {
    // eslint-disable-next-line no-console
    console.error('LARK_WEBHOOK_URL is not set. Cannot send message to Lark.');
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      msg_type: 'text',
      content: {
        text: `yay-alert: ${message}`,
      },
    }),
  });

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(`Failed to send message to Lark: ${response.statusText}`);
  }
}
