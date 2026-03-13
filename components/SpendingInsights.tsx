"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  merchant: string;
  category: string;
  amount: number;
}

interface BenchmarkGoal {
  id: string;
  category: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  period: 'daily' | 'monthly';
}

interface SpendingInsightsProps {
  transactions: Transaction[];
}

export default function SpendingInsights({ transactions }: SpendingInsightsProps) {
  const [categorySpending, setCategorySpending] = useState<Record<string, number>>({});
  const [benchmarkGoals, setBenchmarkGoals] = useState<BenchmarkGoal[]>([]);
  const [alerts, setAlerts] = useState<Array<{ category: string; spent: number; limit: number; percentage: number }>>([]);

  // Calculate spending by category and check for overspending
  useEffect(() => {
    // Calculate spending by category
    const spending: Record<string, number> = {};
    transactions.forEach((transaction) => {
      if (transaction.amount < 0) { // Only count expenses
        spending[transaction.category] = (spending[transaction.category] || 0) + Math.abs(transaction.amount);
      }
    });
    setCategorySpending(spending);

    // Load benchmark goals
    const savedGoals = localStorage.getItem('benchmarkGoals');
    if (savedGoals) {
      try {
        const goals: BenchmarkGoal[] = JSON.parse(savedGoals);
        setBenchmarkGoals(goals);

        // Check for overspending
        const newAlerts: Array<{ category: string; spent: number; limit: number; percentage: number }> = [];
        goals.forEach((goal) => {
          const spent = spending[goal.category] || 0;
          const limit = goal.period === 'daily' ? goal.dailyLimit : goal.monthlyLimit;
          if (limit && spent > limit) {
            const percentage = Math.round((spent / limit) * 100);
            newAlerts.push({
              category: goal.category,
              spent,
              limit,
              percentage,
            });
          }
        });
        setAlerts(newAlerts);
      } catch (e) {
        console.error('Failed to parse goals:', e);
      }
    }
  }, [transactions]);

  // Get top spending categories
  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }));

  const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg font-semibold text-red-900">
                Budget Alerts ({alerts.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={`${alert.category}-${index}`}
                  className="p-3 rounded-lg bg-white border border-red-200 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">{alert.category}</p>
                    <p className="text-sm text-red-700">
                      Spent ${alert.spent.toFixed(2)} of ${alert.limit.toFixed(2)} ({alert.percentage}%)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-2 bg-red-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600"
                        style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Spending Categories */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Top Spending Categories
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Your spending breakdown by category
          </p>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm">No expenses yet</p>
          ) : (
            <div className="space-y-4">
              {topCategories.map(({ category, amount }) => {
                const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
                const goal = benchmarkGoals.find((g) => g.category === category);
                const goalLimit = goal
                  ? goal.period === 'daily'
                    ? goal.dailyLimit || 0
                    : goal.monthlyLimit || 0
                  : 0;
                const isOverBudget = goalLimit > 0 && amount > goalLimit;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{category}</p>
                        <p className="text-sm text-muted-foreground">
                          ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                        </p>
                      </div>
                      {isOverBudget && (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs font-semibold">Over</span>
                        </div>
                      )}
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverBudget ? 'bg-red-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    {goalLimit > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Budget: ${goalLimit.toFixed(2)}
                      </p>
                    )}
                  </div>
                );
              })}
              <div className="pt-4 border-t border-border mt-4">
                <div className="flex justify-between">
                  <p className="font-semibold text-foreground">Total Spending</p>
                  <p className="font-semibold text-foreground">
                    ${totalSpending.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
