"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  month: string;
  amount: number;
}

interface VisualizationTabsProps {
  data: ChartData[];
}

export default function VisualizationTabs({ data }: VisualizationTabsProps) {
  const [activeTab, setActiveTab] = useState<'bar' | 'line' | 'pie'>('bar');

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Advanced Analytics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Multiple visualization formats for better insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('bar')}
              className={activeTab === 'bar' ? '' : 'border-border'}
            >
              Bar Chart
            </Button>
            <Button
              variant={activeTab === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('line')}
              className={activeTab === 'line' ? '' : 'border-border'}
            >
              Line Chart
            </Button>
            <Button
              variant={activeTab === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('pie')}
              className={activeTab === 'pie' ? '' : 'border-border'}
            >
              Pie Chart
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {activeTab === 'bar' && (
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

          {activeTab === 'line' && (
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

          {activeTab === 'pie' && (
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
