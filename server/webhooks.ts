type WebhookEvent = 'template.created' | 'template.updated' | 'template.deleted' | 'template.rendered';

interface WebhookData {
  templateId: string;
  name?: string;
  workspaceId?: string;
  timestamp: string;
}

export function emitWebhook(event: WebhookEvent, data: WebhookData): void {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = { event, data };

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error(`Webhook delivery failed for ${event}:`, err.message);
  });
}
