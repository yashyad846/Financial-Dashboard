import { NextResponse } from 'next/server';
import { Insight } from '@/lib/types';

// In-memory storage for insights (in production, use a database like PostgreSQL, MongoDB, etc.)
// This will reset on server restart, but works for demo purposes
let insightsStore: Insight[] = [];

interface SaveInsightRequest {
  text: string;
  spendingPercentage: number;
  month: number;
  year: number;
  totalSpent: number;
  monthlyBudget: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as SaveInsightRequest;

    // Validate required fields
    if (
      !body.text ||
      body.spendingPercentage === undefined ||
      !body.month ||
      !body.year ||
      body.totalSpent === undefined ||
      body.monthlyBudget === undefined
    ) {
      return NextResponse.json(
        {
          error: 'Missing required fields: text, spendingPercentage, month, year, totalSpent, monthlyBudget',
        },
        { status: 400 }
      );
    }

    // Validate spending percentage is between 0 and 100
    if (body.spendingPercentage < 0 || body.spendingPercentage > 100) {
      return NextResponse.json(
        { error: 'Spending percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Create insight object
    const insight: Insight = {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: body.text,
      timestamp: new Date().toISOString(),
      spendingPercentage: parseFloat(body.spendingPercentage.toFixed(2)),
      month: body.month,
      year: body.year,
      totalSpent: parseFloat(body.totalSpent.toFixed(2)),
      monthlyBudget: parseFloat(body.monthlyBudget.toFixed(2)),
    };

    // Store the insight
    insightsStore.push(insight);

    // Keep only the last 100 insights in memory to prevent memory bloat
    if (insightsStore.length > 100) {
      insightsStore = insightsStore.slice(-100);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Insight stored successfully',
        insight,
        totalStored: insightsStore.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in save-insight route:', error);
    return NextResponse.json(
      { error: 'Failed to save insight' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Get query parameters for filtering
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    let filteredInsights = [...insightsStore];

    // Filter by month and year if provided
    if (month && year) {
      filteredInsights = filteredInsights.filter(
        (insight) => insight.month === month && insight.year === year
      );
    }

    // Sort by timestamp (newest first)
    filteredInsights.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    const paginatedInsights = filteredInsights.slice(0, limit);

    return NextResponse.json(
      {
        insights: paginatedInsights,
        total: filteredInsights.length,
        returned: paginatedInsights.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in save-insight GET route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
