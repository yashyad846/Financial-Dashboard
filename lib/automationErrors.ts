/**
 * Enhanced error handling and logging for automation system
 */

export interface AutomationError {
  code: string;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  retryable: boolean;
}

export enum ErrorCode {
  // Configuration errors
  WEBHOOK_NOT_CONFIGURED = 'WEBHOOK_NOT_CONFIGURED',
  API_KEY_NOT_CONFIGURED = 'API_KEY_NOT_CONFIGURED',

  // Network errors
  WEBHOOK_TIMEOUT = 'WEBHOOK_TIMEOUT',
  WEBHOOK_CONNECTION_ERROR = 'WEBHOOK_CONNECTION_ERROR',
  API_CALL_TIMEOUT = 'API_CALL_TIMEOUT',

  // Response errors
  WEBHOOK_ERROR_RESPONSE = 'WEBHOOK_ERROR_RESPONSE',
  INVALID_RESPONSE = 'INVALID_RESPONSE',

  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // External service errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  const retryableErrors = [
    'ECONNRESET',
    'ENOTFOUND',
    'ETIMEDOUT',
    'EHOSTUNREACH',
  ];

  // Check HTTP status codes
  if (error.status && retryableStatusCodes.includes(error.status)) {
    return true;
  }

  // Check network errors
  if (error.code && retryableErrors.includes(error.code)) {
    return true;
  }

  // Check for timeout
  if (error.message?.includes('timeout')) {
    return true;
  }

  return false;
}

/**
 * Creates structured error message
 */
export function createAutomationError(
  code: ErrorCode,
  message: string,
  context?: Record<string, any>
): AutomationError {
  return {
    code,
    message,
    timestamp: new Date().toISOString(),
    context,
    retryable: isRetryableError({ code, message, ...context }),
  };
}

/**
 * Logs automation events
 */
export function logAutomationEvent(
  level: 'info' | 'warn' | 'error',
  message: string,
  context?: Record<string, any>
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    context,
  };

  if (level === 'error') {
    console.error(`[${timestamp}] [AUTOMATION] ${message}`, context);
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] [AUTOMATION] ${message}`, context);
  } else {
    console.log(`[${timestamp}] [AUTOMATION] ${message}`, context);
  }

  // In production, send to monitoring service (Sentry, DataDog, etc.)
  // await sendToMonitoringService(logEntry);
}
