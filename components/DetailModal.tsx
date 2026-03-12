"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { getCategoryConfig } from '@/lib/categoryConfig';

interface DetailModalProps {
  type: 'transaction' | 'summary' | 'category';
  data: any;
  onClose: () => void;
  isOpen: boolean;
}

export default function DetailModal({ type, data, onClose, isOpen }: DetailModalProps) {
  if (!isOpen || !data) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-2xl border-border bg-card shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>
              {type === 'transaction' && 'Transaction Details'}
              {type === 'summary' && 'Financial Summary'}
              {type === 'category' && 'Category Breakdown'}
            </CardTitle>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          {type === 'transaction' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Merchant</p>
                  <p className="text-lg font-semibold text-foreground">{data.merchant}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-lg font-semibold text-foreground">{data.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <div className="mt-1">
                    {(() => {
                      const config = getCategoryConfig(data.category);
                      return (
                        <span className={`inline-flex items-center rounded-full ${config.bgColor} px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                          {data.category}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className={`text-lg font-semibold ${data.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.amount >= 0 ? '+' : ''}{data.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="font-mono text-sm text-foreground">{data.id}</p>
              </div>
            </div>
          )}

          {type === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-foreground">${data.totalBalance}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">${data.monthlyIncome}</p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">${data.monthlyExpenses}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Summary for {data.month}</p>
              </div>
            </div>
          )}

          {type === 'category' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-lg font-semibold text-foreground">{data.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold text-foreground">
                    {data.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Number of Transactions</p>
                  <p className="text-lg font-semibold text-foreground">{data.count}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Transaction</p>
                  <p className="text-lg font-semibold text-foreground">
                    {(data.amount / data.count).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <div className="border-t border-border p-4">
          <Button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
