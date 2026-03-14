import { Insight } from './types';

/**
 * Utility function to fetch financial insights from the API
 */
export async function fetchFinancialInsights(params: {
  totalSpent: number;
  monthlyBudget: number;
  categoryBreakdown: Array<{
    category: string;
    spent: number;
    percentage: number;
  }>;
  month: number;
  year: number;
}): Promise<string> {
  try {
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.statusText}`);
    }

    const data = await response.json();
    return data.insight;
  } catch (error) {
    console.error('Error fetching financial insights:', error);
    throw error;
  }
}

/**
 * Utility function to save generated insights
 */
export async function saveInsight(params: {
  text: string;
  spendingPercentage: number;
  month: number;
  year: number;
  totalSpent: number;
  monthlyBudget: number;
}): Promise<Insight> {
  try {
    const response = await fetch('/api/save-insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to save insight: ${response.statusText}`);
    }

    const data = await response.json();
    return data.insight;
  } catch (error) {
    console.error('Error saving insight:', error);
    throw error;
  }
}

/**
 * Utility function to fetch saved insights
 */
export async function fetchSavedInsights(params?: {
  month?: number;
  year?: number;
  limit?: number;
}): Promise<Insight[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.month) queryParams.set('month', String(params.month));
    if (params?.year) queryParams.set('year', String(params.year));
    if (params?.limit) queryParams.set('limit', String(params.limit));

    const response = await fetch(`/api/save-insight?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch saved insights: ${response.statusText}`);
    }

    const data = await response.json();
    return data.insights;
  } catch (error) {
    console.error('Error fetching saved insights:', error);
    throw error;
  }
}
