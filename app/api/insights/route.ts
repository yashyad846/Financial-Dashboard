import { NextResponse } from 'next/server';
import { generateSpendingInsights } from '@/lib/insightGenerator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalSpent, monthlyBudget, categoryBreakdown, month, year } = body;

    // Validate required fields
    if (
      totalSpent === undefined ||
      !monthlyBudget ||
      !categoryBreakdown ||
      !month ||
      !year
    ) {
      return NextResponse.json(
        {
          error: 'Missing required fields: totalSpent, monthlyBudget, categoryBreakdown, month, year',
        },
        { status: 400 }
      );
    }

    // Generate insights using Gemini
    const insight = await generateSpendingInsights({
      totalSpent,
      monthlyBudget,
      categoryBreakdown,
      month,
      year,
    });

    return NextResponse.json(
      {
        success: true,
        insight,
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in insights route:', error);
    return NextResponse.json(
      { error: 'Failed to generate financial insights' },
      { status: 500 }
    );
  }
}
