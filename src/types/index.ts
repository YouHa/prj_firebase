
export interface FinancialEntry {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
}

export type IncomeEntry = FinancialEntry;
export type ExpenseEntry = FinancialEntry;

export interface Appointment {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
}

export type FinancialMetric = {
  label: string;
  value: number;
  icon: React.ElementType;
};

export type MonthlyData = {
  month: string;
  revenue: number;
  expenses: number;
};
