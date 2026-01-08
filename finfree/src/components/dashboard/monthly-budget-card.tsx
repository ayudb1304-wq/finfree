'use client';

import { Wallet, UtensilsCrossed, Home, Car, Zap, Smartphone, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinFreeStore } from '@/lib/store';
import { formatCurrency, LIFESTYLE_BUDGET } from '@/lib/constants';
import { getCurrentMonth, getDaysRemaining, calculateDailyLimit } from '@/lib/finances';

const categoryIcons: Record<string, React.ElementType> = {
  food_groceries: UtensilsCrossed,
  rent: Home,
  transport: Car,
  utilities: Zap,
  phone_internet: Smartphone,
  miscellaneous: MoreHorizontal,
};

const categoryLabels: Record<string, string> = {
  food_groceries: 'Food & Groceries',
  rent: 'Rent',
  transport: 'Transport',
  utilities: 'Utilities',
  phone_internet: 'Phone/Internet',
  miscellaneous: 'Misc',
};

export const MonthlyBudgetCard = () => {
  const { transactions, lifestyleCap } = useFinFreeStore();
  const currentMonth = getCurrentMonth();
  const daysRemaining = getDaysRemaining();

  // Calculate spent per category
  const categorySpending = Object.keys(LIFESTYLE_BUDGET).reduce((acc, category) => {
    const spent = transactions
      .filter((t) => t.month === currentMonth && t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    acc[category] = spent;
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  const remaining = lifestyleCap - totalSpent;
  const dailyLimit = calculateDailyLimit(remaining, daysRemaining);
  const overallProgress = (totalSpent / lifestyleCap) * 100;

  return (
    <Card className="border-0 bg-card">
      <CardHeader className="pb-2 px-5 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-400" />
            Monthly Budget
          </CardTitle>
          <span className="text-xs text-muted-foreground">{daysRemaining} days left</span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {formatCurrency(lifestyleCap)}
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                overallProgress > 90 ? 'bg-red-500' : overallProgress > 70 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Daily Limit */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Daily Spending Limit</span>
            <span className="text-lg font-bold text-blue-400">{formatCurrency(dailyLimit)}</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          {Object.entries(LIFESTYLE_BUDGET).map(([category, budget]) => {
            const spent = categorySpending[category] || 0;
            const progress = (spent / budget) * 100;
            const Icon = categoryIcons[category] || MoreHorizontal;

            return (
              <div key={category} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground truncate">
                      {categoryLabels[category]}
                    </span>
                    <span className={progress > 100 ? 'text-red-400' : 'text-foreground'}>
                      {formatCurrency(spent)} / {formatCurrency(budget)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-blue-400'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
