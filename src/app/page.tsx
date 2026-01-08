'use client';

import { Header } from '@/components/header';
import { FreedomScoreCard } from '@/components/dashboard/freedom-score-card';
import { NetWorthCard } from '@/components/dashboard/net-worth-card';
import { ODTrackerCard } from '@/components/dashboard/od-tracker-card';
import { EMITrackerCard } from '@/components/dashboard/emi-tracker-card';
import { MonthlyBudgetCard } from '@/components/dashboard/monthly-budget-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="px-4 py-4 max-w-md mx-auto space-y-4">
        {/* Freedom Score */}
        <FreedomScoreCard />

        {/* Net Worth & OD Side by Side on larger screens */}
        <div className="grid gap-4">
          <NetWorthCard />
          <ODTrackerCard />
          <EMITrackerCard />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Monthly Budget */}
        <MonthlyBudgetCard />

        {/* Recent Transactions */}
        <RecentTransactions />
      </div>
    </div>
  );
}
