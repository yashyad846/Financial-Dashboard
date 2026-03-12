"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertTriangle } from 'lucide-react';

interface BenchmarkGoal {
  id: string;
  category: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  period: 'daily' | 'monthly';
}

interface BenchmarkProps {
  onOverspend?: (data: { category: string; limit: number; spent: number; period: string }) => void;
}

export default function Benchmark({ onOverspend }: BenchmarkProps) {
  const [goals, setGoals] = useState<BenchmarkGoal[]>([]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState<'daily' | 'monthly'>('monthly');

  const CATEGORIES = [
    'Food', 'Groceries', 'Transport', 'Entertainment', 
    'Shopping', 'Electronics', 'Bills', 'Health', 'Other'
  ];

  const handleAddGoal = () => {
    if (!category || !limit) {
      alert('Please fill in all fields');
      return;
    }

    const newGoal: BenchmarkGoal = {
      id: Date.now().toString(),
      category,
      [period + 'Limit']: parseFloat(limit),
      period,
    };

    setGoals([...goals, newGoal]);
    setCategory('');
    setLimit('');
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleSaveGoals = () => {
    localStorage.setItem('benchmarkGoals', JSON.stringify(goals));
    alert('Goals saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Add New Goal */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Create Spending Goal
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Set daily or monthly spending limits for each category
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Category Select */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      category === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Period & Limit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Period</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPeriod('daily')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      period === 'daily'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setPeriod('monthly')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      period === 'monthly'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit" className="text-sm text-foreground">
                  Limit ($)
                </Label>
                <Input
                  id="limit"
                  type="number"
                  placeholder="0.00"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                  step="0.01"
                />
              </div>
            </div>

            <Button
              onClick={handleAddGoal}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      {goals.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Your Spending Goals ({goals.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage your spending limits
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{goal.category}</p>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {goal.period === 'daily' ? 'Daily' : 'Monthly'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Limit: ${goal[goal.period === 'daily' ? 'dailyLimit' : 'monthlyLimit']?.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveGoal(goal.id)}
                    className="p-2 text-muted-foreground hover:text-red-600 transition-colors hover:bg-red-50/20 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveGoals}
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save All Goals
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="border-border bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">How It Works</p>
              <p className="text-sm text-blue-800 mt-1">
                Set spending goals for each category. When you exceed a limit, you'll see an alert. 
                This helps you stay on track with your financial goals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
