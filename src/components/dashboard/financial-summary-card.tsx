import type { FinancialMetric } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinancialSummaryCardProps {
  metric: FinancialMetric;
  className?: string;
}

export function FinancialSummaryCard({ metric, className }: FinancialSummaryCardProps) {
  const { label, value, icon: Icon } = metric;
  const isProfit = label.toLowerCase() === 'profit';
  const valueColor = value >= 0 ? (isProfit ? 'text-green-600' : 'text-foreground') : 'text-red-600';

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", valueColor)}>
          {value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </div>
        {label === "Profit" && (
             <CardDescription className="text-xs text-muted-foreground mt-1">
                Calculated as Revenue - Expenses
            </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
