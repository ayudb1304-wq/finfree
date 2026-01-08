'use client';

import { CreditCard, TrendingDown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinFreeStore, useHydration } from '@/lib/store';
import { formatCurrency, INITIAL_OD_BALANCE, OD_PAYOFF_SCHEDULE } from '@/lib/constants';
import { calculateMonthsToPayoff, getCurrentMonth } from '@/lib/finances';

export const ODTrackerCard = () => {
  const hydrated = useHydration();
  const { currentODBalance, targetODPayment } = useFinFreeStore();
  
  const paidOff = INITIAL_OD_BALANCE - currentODBalance;
  const progress = (paidOff / INITIAL_OD_BALANCE) * 100;
  const monthsRemaining = calculateMonthsToPayoff(currentODBalance, targetODPayment);
  
  const currentMonth = getCurrentMonth();
  const scheduleEntry = OD_PAYOFF_SCHEDULE.find(s => s.month === currentMonth);
  const expectedBalance = scheduleEntry?.endBalance ?? 0;
  const variance = currentODBalance - expectedBalance;
  
  const isOnTrack = variance <= 5000; // Within 5k is considered on track
  const isCleared = currentODBalance <= 0;

  if (!hydrated) {
    return (
      <Card className="border-0 bg-gradient-to-br from-orange-600/20 via-red-600/10 to-pink-600/20">
        <CardContent className="p-5">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded-full" />
            </div>
            <div className="h-10 w-40 bg-muted rounded" />
            <div className="h-3 bg-muted rounded-full" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-muted rounded" />
              <div className="h-16 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCleared) {
    return (
      <Card className="border-0 bg-gradient-to-br from-green-600/30 via-emerald-600/20 to-teal-600/30">
        <CardContent className="p-5 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-xl font-bold text-green-400 mb-1">OD Cleared!</h3>
          <p className="text-sm text-muted-foreground">
            Congratulations! You&apos;ve cleared your Axis overdraft.
          </p>
          <p className="text-xs text-green-400 mt-2">
            Total saved in interest: ~₹10,395
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-600/20 via-red-600/10 to-pink-600/20">
      <CardHeader className="pb-2 px-5 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-orange-400" />
            Axis OD Balance
          </CardTitle>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isOnTrack ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isOnTrack ? 'On Track' : 'Behind'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="mb-4">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-orange-400">
              {formatCurrency(currentODBalance)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {formatCurrency(INITIAL_OD_BALANCE)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            remaining to clear
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Paid off</span>
            <span className="text-green-400 font-medium">{formatCurrency(paidOff)}</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 progress-shine"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{progress.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-muted-foreground">Months Left</span>
            </div>
            <p className="text-lg font-semibold">{monthsRemaining}</p>
          </div>
          <div className="p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-muted-foreground">Monthly Pay</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(targetODPayment)}</p>
          </div>
        </div>

        {!isOnTrack && variance > 0 && (
          <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400">
              ⚠️ You&apos;re {formatCurrency(variance)} behind schedule. Consider increasing this month&apos;s payment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
