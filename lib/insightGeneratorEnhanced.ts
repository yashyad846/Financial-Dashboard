import { GoogleGenAI } from '@google/genai';
import {
  ErrorCode,
  createAutomationError,
  logAutomationEvent,
} from './automationErrors';

// Configuration
const INSIGHTS_TIMEOUT_MS = 30000; // 30 seconds
const INSIGHTS_CACHE_TTL_MS = 3600000; // 1 hour

// Simple in-memory cache (use Redis in production)
interface CacheEntry {
  data: string;
  expiresAt: number;
}

const insightsCache = new Map<string, CacheEntry>();

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface SpendingInsightRequest {
  totalSpent: number;
  monthlyBudget: number;
  categoryBreakdown: Array<{
    category: string;
    spent: number;
    percentage: number;
  }>;
  month: number;
  year: number;
}

/**
 * Generate cache key from spending data
 */
function getCacheKey(data: SpendingInsightRequest): string {
  return `insight_${data.month}_${data.year}_${Math.round(
    data.totalSpent
  )}_${data.monthlyBudget}`;
}

/**
 * Get from cache if exists and not expired
 */
function getFromCache(key: string): string | null {
  const entry = insightsCache.get(key);
  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    insightsCache.delete(key);
    return null;
  }

  logAutomationEvent('info', 'Insights retrieved from cache', { cacheKey: key });
  return entry.data;
}

/**
 * Store in cache
 */
function setInCache(key: string, data: string): void {
  insightsCache.set(key, {
    data,
    expiresAt: Date.now() + INSIGHTS_CACHE_TTL_MS,
  });
}

/**
 * Enhanced insight generation with caching and timeout
 */
export async function generateSpendingInsights(
  spendingData: SpendingInsightRequest
): Promise<string> {
  // Validate input
  if (!spendingData.totalSpent || !spendingData.monthlyBudget) {
    const error = createAutomationError(
      ErrorCode.INVALID_INPUT,
      'Invalid spending data: totalSpent and monthlyBudget are required',
      { spendingData }
    );
    logAutomationEvent('error', 'Invalid spending data', { error });
    throw error;
  }

  if (!process.env.GEMINI_API_KEY) {
    const error = createAutomationError(
      ErrorCode.API_KEY_NOT_CONFIGURED,
      'GEMINI_API_KEY environment variable is not configured'
    );
    logAutomationEvent('error', 'Gemini API key not configured');
    throw error;
  }

  // Check cache
  const cacheKey = getCacheKey(spendingData);
  const cachedInsight = getFromCache(cacheKey);
  if (cachedInsight) {
    return cachedInsight;
  }

  try {
    // Create prompt
    const categoryList = spendingData.categoryBreakdown
      .map(
        (cat) =>
          `${cat.category}: $${cat.spent.toFixed(2)} (${cat.percentage}%)`
      )
      .join('\n');

    const percentOfBudget = (
      (spendingData.totalSpent / spendingData.monthlyBudget) *
      100
    ).toFixed(1);

    const systemPrompt = `You are a friendly financial advisor. Analyze spending data and provide ONE concise, actionable financial insight (2-3 sentences max). Be encouraging but honest. Focus on actionable advice.`;

    const userPrompt = `Analyze the following spending data for ${spendingData.month}/${spendingData.year}:

Total Spent: $${spendingData.totalSpent.toFixed(2)}
Monthly Budget: $${spendingData.monthlyBudget.toFixed(2)}
Percent of Budget Used: ${percentOfBudget}%

Category Breakdown:
${categoryList}

Provide a brief insight about their spending habits and ONE specific recommendation.`;

    // Call Gemini API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      INSIGHTS_TIMEOUT_MS
    );

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
        ],
      });

      clearTimeout(timeoutId);

      if (!response.text) {
        throw new Error('Empty response from Gemini API');
      }

      const text = response.text.trim();

      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      // Store in cache
      setInCache(cacheKey, text);

      logAutomationEvent('info', 'Insight generated successfully', {
        cacheKey,
        month: spendingData.month,
        year: spendingData.year,
      });

      return text;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        const timeoutError = createAutomationError(
          ErrorCode.API_CALL_TIMEOUT,
          `Gemini API timeout after ${INSIGHTS_TIMEOUT_MS}ms`,
          { timeout: INSIGHTS_TIMEOUT_MS }
        );
        logAutomationEvent('error', 'Gemini API timeout', {
          timeout: INSIGHTS_TIMEOUT_MS,
        });
        throw timeoutError;
      }

      throw error;
    }
  } catch (error: any) {
    const apiError = createAutomationError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Failed to generate insights: ${error.message}`,
      { originalError: error.message }
    );
    logAutomationEvent('error', 'Insight generation failed', {
      error: error.message,
      ...apiError.context,
    });
    throw apiError;
  }
}

/**
 * Clear cache (useful for testing or cache invalidation)
 */
export function clearInsightsCache(): void {
  insightsCache.clear();
  logAutomationEvent('info', 'Insights cache cleared');
}

/**
 * Get cache statistics
 */
export function getInsightsCacheStats(): {
  size: number;
  entries: string[];
} {
  return {
    size: insightsCache.size,
    entries: Array.from(insightsCache.keys()),
  };
}
