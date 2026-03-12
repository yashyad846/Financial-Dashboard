// Type definitions for the financial dashboard

export interface Transaction {
  id: number;
  date: string;
  merchant: string;
  category: string;
  amount: number;
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
