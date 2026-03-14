import { NextResponse } from 'next/server';

// Mock transactions data - in production, this would come from a database
const mockTransactions = [
  {
    id: 1,
    date: "Mar 8, 2026",
    merchant: "Apple Store",
    category: "Electronics",
    amount: -1299.0,
  },
  {
    id: 2,
    date: "Mar 7, 2026",
    merchant: "Whole Foods Market",
    category: "Groceries",
    amount: -156.42,
  },
  {
    id: 3,
    date: "Mar 6, 2026",
    merchant: "Netflix",
    category: "Entertainment",
    amount: -15.99,
  },
  {
    id: 4,
    date: "Mar 5, 2026",
    merchant: "Salary Deposit",
    category: "Income",
    amount: 8500.0,
  },
  {
    id: 5,
    date: "Mar 4, 2026",
    merchant: "Uber",
    category: "Transportation",
    amount: -32.5,
  },
  {
    id: 6,
    date: "Mar 3, 2026",
    merchant: "Amazon",
    category: "Shopping",
    amount: -89.99,
  },
  {
    id: 7,
    date: "Mar 2, 2026",
    merchant: "Starbucks",
    category: "Food & Dining",
    amount: -45.63,
  },
  {
    id: 8,
    date: "Mar 1, 2026",
    merchant: "Gym Membership",
    category: "Health & Fitness",
    amount: -49.99,
  },
  {
    id: 9,
    date: "Feb 28, 2026",
    merchant: "Target",
    category: "Shopping",
    amount: -234.56,
  },
];

// Default monthly budget
const DEFAULT_MONTHLY_BUDGET = 3000;

interface CategorySpending {
  category: string;
  spent: number;
  percentage: number;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get month and year from query params, default to current date
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth() + 1;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();
    
    // Get custom budget if provided, otherwise use default
    const customBudget = searchParams.get('budget') ? parseFloat(searchParams.get('budget')!) : null;
    const monthlyBudget = customBudget || DEFAULT_MONTHLY_BUDGET;
    
    // Validate month and year
    if (month < 1 || month > 12 || year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: 'Invalid month or year' },
        { status: 400 }
      );
    }

    // Filter transactions for the specified month and year
    const monthTransactions = mockTransactions.filter((transaction) => {
      const transDate = new Date(transaction.date);
      return (
        transDate.getMonth() + 1 === month &&
        transDate.getFullYear() === year
      );
    });

    // Calculate total spent (only expenses, not income)
    const totalSpent = Math.abs(
      monthTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    // Calculate category breakdown
    const categoryMap: Record<string, number> = {};
    monthTransactions.forEach((transaction) => {
      if (transaction.amount < 0 && transaction.category !== 'Income') {
        categoryMap[transaction.category] =
          (categoryMap[transaction.category] || 0) + Math.abs(transaction.amount);
      }
    });

    // Convert to array and calculate percentages
    const categoryBreakdown: CategorySpending[] = Object.entries(categoryMap)
      .map(([category, spent]) => ({
        category,
        spent: parseFloat(spent.toFixed(2)),
        percentage: parseFloat(((spent / totalSpent) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.spent - a.spent);

    return NextResponse.json(
      {
        month,
        year,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        monthlyBudget,
        budgetRemaining: parseFloat((monthlyBudget - totalSpent).toFixed(2)),
        percentOfBudget: parseFloat(((totalSpent / monthlyBudget) * 100).toFixed(2)),
        categoryBreakdown,
        transactionCount: monthTransactions.filter((t) => t.amount < 0).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in monthly-spending route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly spending data' },
      { status: 500 }
    );
  }
}
