"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Alert {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
}

interface OverspendingAlertModalProps {
  alerts: Alert[];
}

export default function OverspendingAlertModal({ alerts }: OverspendingAlertModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedCategories, setDismissedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Open modal when there are new alerts that haven't been dismissed
    if (alerts.length > 0) {
      const hasNewAlerts = alerts.some(alert => !dismissedCategories.has(alert.category));
      setIsOpen(hasNewAlerts);
    }
  }, [alerts, dismissedCategories]);

  const openAlerts = alerts.filter(alert => !dismissedCategories.has(alert.category));
  const totalOverspent = openAlerts.reduce((sum, alert) => sum + (alert.spent - alert.limit), 0);
  const avgPercentage = openAlerts.length > 0 
    ? Math.round(openAlerts.reduce((sum, alert) => sum + alert.percentage, 0) / openAlerts.length)
    : 0;

  const handleDismiss = (category: string) => {
    setDismissedCategories(new Set([...dismissedCategories, category]));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || openAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-xl">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-chart-5" />
              <div>
                <CardTitle className="text-lg font-bold text-chart-5">
                  Budget Alert
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {openAlerts.length} category/categories over budget
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-secondary rounded-lg border border-border">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Total Overspent</p>
                <p className="text-lg font-bold text-chart-5">
                  ${totalOverspent.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Avg. Over Budget</p>
                <p className="text-lg font-bold text-chart-5">
                  {avgPercentage}%
                </p>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {openAlerts.map((alert) => (
                <div
                  key={`${alert.category}-alert`}
                  className="p-3 rounded-lg bg-secondary border border-border flex items-start justify-between gap-3 hover:border-chart-5/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{alert.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Spent: <span className="font-bold text-chart-5">${alert.spent.toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Limit: <span className="font-bold text-foreground">${alert.limit.toFixed(2)}</span>
                    </p>
                    <div className="mt-2 w-full h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-chart-5"
                        style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-chart-5 font-semibold mt-1">
                      {alert.percentage}% of budget
                    </p>
                  </div>
                  <button
                    onClick={() => handleDismiss(alert.category)}
                    className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0 mt-1"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-2 border-t border-border flex gap-2">
              <Button
                onClick={() => setDismissedCategories(new Set(openAlerts.map(a => a.category)))}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary"
              >
                Dismiss All
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-chart-5 text-white hover:bg-chart-5/90"
              >
                Got It
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
