import { Transaction } from './types';

/**
 * Triggers an automation workflow in n8n when a new transaction is created
 * @param transaction - The transaction object containing amount, merchant, category, and date
 * @throws Error if webhook URL is not configured or request fails
 */
export async function triggerAutomation(transaction: Transaction): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  // Validate that the webhook URL is configured
  if (!webhookUrl) {
    console.error(
      'N8N_WEBHOOK_URL environment variable is not configured. Automation trigger skipped.'
    );
    return;
  }

  try {
    const payload = {
      amount: transaction.amount,
      merchant: transaction.merchant,
      category: transaction.category,
      date: transaction.date,
      id: transaction.id,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status ${response.status}`);
    }

    console.log('Automation workflow triggered successfully for transaction:', transaction.id);
  } catch (error) {
    console.error('Failed to trigger automation workflow:', error);
    // Don't rethrow - gracefully handle the error so it doesn't break the main transaction flow
  }
}
