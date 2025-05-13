"use client"; // Required for useState, useEffect, and client components

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { FinancialSummaryCard } from "@/components/dashboard/financial-summary-card";
import { RevenueExpenseChart } from "@/components/dashboard/revenue-expense-chart";
import type { FinancialMetric, MonthlyData, IncomeEntry, ExpenseEntry } from "@/types";
import { TrendingUp, TrendingDown, DollarSign, LineChart } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data - in a real app, this would come from a backend or state management
const MOCK_INCOME: IncomeEntry[] = [
  { id: '1', date: new Date('2024-06-15'), description: 'Project Alpha', amount: 2500, category: 'Consulting' },
  { id: '2', date: new Date('2024-07-05'), description: 'Product Sale', amount: 1200, category: 'Sales' },
  { id: '3', date: new Date('2024-07-20'), description: 'Workshop Hosting', amount: 800, category: 'Services' },
  { id: '4', date: new Date('2024-08-10'), description: 'Project Beta', amount: 3200, category: 'Consulting' },
];

const MOCK_EXPENSES: ExpenseEntry[] = [
  { id: '1', date: new Date('2024-06-01'), description: 'Software Subscription', amount: 150, category: 'Software' },
  { id: '2', date: new Date('2024-07-10'), description: 'Office Supplies', amount: 75, category: 'Supplies' },
  { id: '3', date: new Date('2024-07-25'), description: 'Marketing Campaign', amount: 500, category: 'Marketing' },
  { id: '4', date: new Date('2024-08-05'), description: 'Cloud Hosting', amount: 200, category: 'Utilities' },
];

const MOCK_MONTHLY_DATA: MonthlyData[] = [
  { month: "Mar", revenue: 1800, expenses: 800 },
  { month: "Apr", revenue: 2200, expenses: 1000 },
  { month: "May", revenue: 2000, expenses: 1200 },
  { month: "Jun", revenue: 2780, expenses: 900 },
  { month: "Jul", revenue: 1890, expenses: 1100 },
  { month: "Aug", revenue: 2390, expenses: 1300 },
];

export default function DashboardPage() {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [profit, setProfit] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    // Simulate fetching and calculating data
    const totalRevenue = MOCK_INCOME.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = MOCK_EXPENSES.reduce((sum, entry) => sum + entry.amount, 0);
    
    setRevenue(totalRevenue);
    setExpenses(totalExpenses);
    setProfit(totalRevenue - totalExpenses);
    setMonthlyData(MOCK_MONTHLY_DATA);
  }, []);

  const financialMetrics: FinancialMetric[] = [
    { label: "Total Revenue", value: revenue, icon: TrendingUp },
    { label: "Total Expenses", value: expenses, icon: TrendingDown },
    { label: "Net Profit", value: profit, icon: LineChart },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your business performance.">
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/income/new">Record Income</Link>
          </Button>
          <Button asChild>
            <Link href="/expenses/new">Record Expense</Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {financialMetrics.map((metric) => (
          <FinancialSummaryCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6">
        <RevenueExpenseChart data={monthlyData} />
      </div>
    </>
  );
}
