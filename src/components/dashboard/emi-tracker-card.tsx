'use client';

import Link from 'next/link';
import { CreditCard, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFinFreeStore, useHydration, useTotalMonthlyEMI } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';

export const EMITrackerCard = () => {
  const hydrated = useHydration();
  const emis = useFinFreeStore((state) => state.emis);
  const totalMonthlyEMI = useTotalMonthlyEMI();

  // Active EMIs (not fully paid)
  const activeEMIs = emis.filter((emi) => emi.paidInstallments < emi.totalInstallments);

  // Calculate total remaining liability
  const totalLiability = emis.reduce((sum, emi) => {
    const remaining = emi.totalInstallments - emi.paidInstallments;
    return sum + (remaining * emi.amount);
  }, 0);

  if (!hydrated) {
    return (
      <Card className="border-0 bg-card">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-24 bg-muted rounded" />
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-2 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeEMIs.length === 0 && emis.length === 0) {
    return (
      <Link href="/emis">
        <Card className="border-0 bg-card hover:bg-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">EMI Tracker</p>
                  <p className="text-xs text-muted-foreground">No EMIs tracked</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Get the EMI with the most progress for display
  const primaryEMI = activeEMIs.length > 0 
    ? activeEMIs.reduce((a, b) => 
        (a.paidInstallments / a.totalInstallments) > (b.paidInstallments / b.totalInstallments) ? a : b
      )
    : null;

  const primaryProgress = primaryEMI 
    ? (primaryEMI.paidInstallments / primaryEMI.totalInstallments) * 100 
    : 100;

  return (
    <Link href="/emis">
      <Card className="border-0 bg-card hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-muted-foreground">EMI Tracker</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>

          {activeEMIs.length > 0 ? (
            <>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold text-purple-400">
                  {formatCurrency(totalMonthlyEMI)}
                </span>
                <span className="text-xs text-muted-foreground">/month</span>
              </div>

              {primaryEMI && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{primaryEMI.name}</span>
                    <span>
                      {primaryEMI.paidInstallments}/{primaryEMI.totalInstallments}
                    </span>
                  </div>
                  <Progress value={primaryProgress} className="h-1.5" />
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  {activeEMIs.length} active EMI{activeEMIs.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs">
                  Total: {formatCurrency(totalLiability)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-400">All EMIs Cleared!</p>
                <p className="text-xs text-muted-foreground">
                  {emis.length} EMI{emis.length !== 1 ? 's' : ''} completed
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
