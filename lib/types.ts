// Type definitions for the financial dashboard

export interface Transaction {
  id: number;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  verified?: boolean;
}

export interface ParsedTransaction {
  amount: number;
  merchant: string;
  category: string;
  date?: string;
}

export interface SpendingDataPoint {
  month: string;
  amount: number;
}

export interface SpendingDataResponse {
  year: number;
  data: SpendingDataPoint[];
}

export interface Insight {
  id: string;
  text: string;
  timestamp: string;
  spendingPercentage: number;
  month: number;
  year: number;
  totalSpent: number;
  monthlyBudget: number;
}
