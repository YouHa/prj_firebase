"use client";

import type { MonthlyData } from "@/types";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart";

interface RevenueExpenseChartProps {
  data: MonthlyData[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
};


export function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Revenue vs. Expenses</CardTitle>
        <CardDescription>Monthly comparison for the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} 
                tickFormatter={(value) => `$${value / 1000}k`}
              />
               <ChartTooltipContent 
                cursor={false} 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 'var(--radius)', borderColor: 'hsl(var(--border))' }}
                formatter={(value, name) => [
                    value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                    name === 'revenue' ? 'Revenue' : 'Expenses'
                ]}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
