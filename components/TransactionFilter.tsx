"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface TransactionFilterProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    amountMin: string;
    amountMax: string;
  }) => void;
}

const CATEGORIES = [
  'All',
  'Income',
  'Salary',
  'Food',
  'Groceries',
  'Transport',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Electronics',
  'Bills',
  'Health',
  'Other'
];

export default function TransactionFilter({ onFilterChange }: TransactionFilterProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({
      search,
      category: category === 'All' ? '' : category,
      amountMin,
      amountMax,
    });
  };

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setAmountMin('');
    setAmountMax('');
    onFilterChange({
      search: '',
      category: '',
      amountMin: '',
      amountMax: '',
    });
  };

  const hasActiveFilters = search || category !== 'All' || amountMin || amountMax;

  return (
    <Card className="border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {hasActiveFilters && (
            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 border-t border-border pt-4">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Merchant, category, or date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
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

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Min Amount</Label>
              <Input
                type="number"
                placeholder="0"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Max Amount</Label>
              <Input
                type="number"
                placeholder="10000"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleFilterChange}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-border"
                size="sm"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
