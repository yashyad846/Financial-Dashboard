import { Transaction } from './types';
import {
  ErrorCode,
  createAutomationError,
  logAutomationEvent,
  isRetryableError,
} from './automationErrors';

// Configuration
const WEBHOOK_TIMEOUT_MS = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second (exponential backoff applied)

interface AutomationResult {
  success: boolean;
  transactionId: number;
  webhookTriggered: boolean;
  error?: any;
  retryCount: number;
  timestamp: string;
}

/**
 * Implements exponential backoff retry strategy
 */
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Enhanced triggerAutomation with retry logic and better error handling
 */
export async function triggerAutomation(
  transaction: Transaction
): Promise<AutomationResult> {
  const result: AutomationResult = {
    success: false,
    transactionId: transaction.id,
    webhookTriggered: false,
    retryCount: 0,
    timestamp: new Date().toISOString(),
  };

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  // Validate webhook URL
  if (!webhookUrl) {
    const error = createAutomationError(
      ErrorCode.WEBHOOK_NOT_CONFIGURED,
      'N8N_WEBHOOK_URL environment variable is not configured'
    );
    logAutomationEvent('warn', 'Webhook not configured, skipping automation', {
      transactionId: transaction.id,
    });
    result.error = error;
    return result;
  }

  // Validate webhook URL format
  try {
    new URL(webhookUrl);
  } catch (e) {
    const error = createAutomationError(
      ErrorCode.INVALID_INPUT,
      'Invalid N8N_WEBHOOK_URL format',
      { webhookUrl }
    );
    logAutomationEvent('error', 'Invalid webhook URL format', { webhookUrl });
    result.error = error;
    return result;
  }

  // Prepare payload
  const payload = {
    amount: transaction.amount,
    merchant: transaction.merchant,
    category: transaction.category,
    date: transaction.date,
    id: transaction.id,
    timestamp: new Date().toISOString(),
  };

  // Retry logic with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    result.retryCount = attempt - 1;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        WEBHOOK_TIMEOUT_MS
      );

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FinanceFlow/1.0',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check for successful response
      if (response.ok) {
        logAutomationEvent('info', 'Webhook triggered successfully', {
          transactionId: transaction.id,
          attempt,
          webhookUrl,
        });
        result.success = true;
        result.webhookTriggered = true;
        return result;
      }

      // Handle error responses
      if (response.status === 429) {
        // Rate limited
        const error = createAutomationError(
          ErrorCode.RATE_LIMIT_EXCEEDED,
          `Rate limited by webhook (attempt ${attempt}/${MAX_RETRIES})`,
          { status: response.status }
        );
        logAutomationEvent('warn', 'Rate limited', {
          transactionId: transaction.id,
          attempt,
          status: response.status,
        });
        result.error = error;

        if (attempt < MAX_RETRIES && error.retryable) {
          const waitTime = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          logAutomationEvent('info', `Retrying after ${waitTime}ms`, {
            transactionId: transaction.id,
          });
          await delay(waitTime);
          continue;
        }
        return result;
      }

      if (response.status >= 500) {
        // Server error - retryable
        const error = createAutomationError(
          ErrorCode.WEBHOOK_ERROR_RESPONSE,
          `Webhook server error ${response.status} (attempt ${attempt}/${MAX_RETRIES})`,
          { status: response.status }
        );
        logAutomationEvent('warn', 'Webhook server error', {
          transactionId: transaction.id,
          attempt,
          status: response.status,
        });
        result.error = error;

        if (attempt < MAX_RETRIES) {
          const waitTime = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          logAutomationEvent('info', `Retrying after ${waitTime}ms`, {
            transactionId: transaction.id,
          });
          await delay(waitTime);
          continue;
        }
        return result;
      }

      // Client error - not retryable
      const error = createAutomationError(
        ErrorCode.WEBHOOK_ERROR_RESPONSE,
        `Webhook responded with status ${response.status}`,
        { status: response.status }
      );
      logAutomationEvent('error', 'Webhook client error (not retryable)', {
        transactionId: transaction.id,
        status: response.status,
      });
      result.error = error;
      return result;
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'AbortError') {
        const timeoutError = createAutomationError(
          ErrorCode.WEBHOOK_TIMEOUT,
          `Webhook timeout (attempt ${attempt}/${MAX_RETRIES})`,
          { timeout: WEBHOOK_TIMEOUT_MS }
        );
        logAutomationEvent('warn', 'Webhook timeout', {
          transactionId: transaction.id,
          attempt,
          timeout: WEBHOOK_TIMEOUT_MS,
        });
        result.error = timeoutError;

        if (attempt < MAX_RETRIES) {
          const waitTime = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          logAutomationEvent('info', `Retrying after ${waitTime}ms`, {
            transactionId: transaction.id,
          });
          await delay(waitTime);
          continue;
        }
        return result;
      }

      // Other network errors
      const isRetryable = isRetryableError(error);
      const networkError = createAutomationError(
        ErrorCode.WEBHOOK_CONNECTION_ERROR,
        `Network error: ${error.message}`,
        { errorCode: error.code }
      );

      logAutomationEvent(
        isRetryable ? 'warn' : 'error',
        `Webhook connection error (${isRetryable ? 'retryable' : 'not retryable'})`,
        {
          transactionId: transaction.id,
          attempt,
          errorCode: error.code,
          message: error.message,
        }
      );
      result.error = networkError;

      if (attempt < MAX_RETRIES && isRetryable) {
        const waitTime = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logAutomationEvent('info', `Retrying after ${waitTime}ms`, {
          transactionId: transaction.id,
        });
        await delay(waitTime);
        continue;
      }
      return result;
    }
  }

  logAutomationEvent('error', 'Max retries exceeded', {
    transactionId: transaction.id,
    maxRetries: MAX_RETRIES,
  });
  return result;
}

/**
 * Async trigger (non-blocking) - for production use
 * This should be used with a job queue like Bull or BullMQ
 */
export async function triggerAutomationAsync(
  transaction: Transaction
): Promise<void> {
  // In production, this would enqueue the job
  // For now, this is a placeholder
  // const job = await automationQueue.add('trigger', transaction);
  logAutomationEvent('info', 'Automation queued for background processing', {
    transactionId: transaction.id,
  });
}
