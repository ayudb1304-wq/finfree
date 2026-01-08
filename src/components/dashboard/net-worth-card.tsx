'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNetWorth, useFinFreeStore, useHydration } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';

export const NetWorthCard = () => {
  const hydrated = useHydration();
  const netWorth = useNetWorth();
  const { emergencyFund, landFund, weddingFund, currentODBalance, emis } = useFinFreeStore();

  const totalAssets = emergencyFund + landFund + weddingFund;
  
  // Calculate total EMI liability from emis array
  const totalEMILiability = emis.reduce((sum, emi) => {
    const remainingInstallments = emi.totalInstallments - emi.paidInstallments;
    return sum + (remainingInstallments * emi.amount);
  }, 0);
  
  const totalLiabilities = currentODBalance + totalEMILiability;
  const isPositive = netWorth >= 0;

  if (!hydrated) {
    return (
      <Card className="border-0 bg-gradient-to-br from-emerald-600/20 via-green-600/10 to-teal-600/20">
        <CardContent className="p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-24 bg-muted rounded" />
            <div className="h-10 w-36 bg-muted rounded" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="h-16 bg-muted rounded" />
              <div className="h-16 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-600/20 via-green-600/10 to-teal-600/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Net Worth</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-3xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(Math.abs(netWorth))}
              </span>
              {!isPositive && <span className="text-sm text-red-400">debt</span>}
            </div>
          </div>
          <div className={`p-2.5 rounded-full ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-muted-foreground">Assets</span>
            </div>
            <p className="text-sm font-semibold text-green-400">{formatCurrency(totalAssets)}</p>
          </div>
          <div className="p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-muted-foreground">Liabilities</span>
            </div>
            <p className="text-sm font-semibold text-red-400">{formatCurrency(totalLiabilities)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
