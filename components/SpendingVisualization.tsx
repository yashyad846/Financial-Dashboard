"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChartData {
  month: string;
  amount: number;
}

interface SpendingVisualizationProps {
  data: ChartData[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function SpendingVisualization({ data, selectedYear, onYearChange }: SpendingVisualizationProps) {
  const [activeVisualization, setActiveVisualization] = useState<'bar' | 'line' | 'pie'>('bar');

  const COLORS = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626'];

  // Transform data for pie chart
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const pieData = data.map(item => ({
    name: item.month,
    value: item.amount,
    percentage: ((item.amount / totalAmount) * 100).toFixed(1)
  }));

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Spending Analytics
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive view of your yearly spending patterns ({selectedYear})
              </p>
            </div>
            
            {/* Year Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onYearChange(selectedYear - 1)}
                className="h-9 w-9 border-border"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center min-w-[60px]">
                <p className="font-semibold text-foreground">{selectedYear}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onYearChange(selectedYear + 1)}
                className="h-9 w-9 border-border"
                disabled={selectedYear === new Date().getFullYear()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Visualization Options */}
          <div className="flex gap-2">
            <Button
              variant={activeVisualization === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveVisualization('bar')}
              className={activeVisualization === 'bar' ? '' : 'border-border'}
            >
              Bar Chart
            </Button>
            <Button
              variant={activeVisualization === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveVisualization('line')}
              className={activeVisualization === 'line' ? '' : 'border-border'}
            >
              Line Chart
            </Button>
            <Button
              variant={activeVisualization === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveVisualization('pie')}
              className={activeVisualization === 'pie' ? '' : 'border-border'}
            >
              Pie Chart
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-96">
          {activeVisualization === 'bar' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                  }}
                  formatter={(value: number) => [`$${value}`, 'Amount']}
                />
                <Legend />
                <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]} name="Spending" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeVisualization === 'line' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                  }}
                  formatter={(value: number) => [`$${value}`, 'Amount']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--primary)', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Spending"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeVisualization === 'pie' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                  }}
                  formatter={(value: number) => `$${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
