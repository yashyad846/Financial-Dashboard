import { GoogleGenAI } from '@google/genai';

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
 * Generates financial insights based on spending data using Gemini AI
 * @param spendingData - The spending summary data
 * @returns A short financial advice string
 */
export async function generateSpendingInsights(
  spendingData: SpendingInsightRequest
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }

  try {
    // Create a detailed prompt for Gemini
    const categoryList = spendingData.categoryBreakdown
      .map((cat) => `${cat.category}: $${cat.spent.toFixed(2)} (${cat.percentage}%)`)
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

    // Call Gemini API using the correct method
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
      ],
    });

    if (!response.text) {
      throw new Error('No response from Gemini API');
    }

    // Extract text from the response
    const text = response.text.trim();

    return text;
  } catch (error) {
    console.error('Error generating spending insights:', error);
    throw error;
  }
}
