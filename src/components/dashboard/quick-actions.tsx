'use client';

import Link from 'next/link';
import { 
  TrendingDown, 
  PiggyBank, 
  Receipt, 
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const quickActions = [
  {
    href: '/add?type=od_payment',
    icon: TrendingDown,
    label: 'OD Payment',
    color: 'bg-orange-500/20 text-orange-400',
  },
  {
    href: '/add?type=expense',
    icon: Receipt,
    label: 'Log Expense',
    color: 'bg-red-500/20 text-red-400',
  },
  {
    href: '/emis',
    icon: CreditCard,
    label: 'EMI',
    color: 'bg-purple-500/20 text-purple-400',
  },
  {
    href: '/add?type=savings',
    icon: PiggyBank,
    label: 'Add Savings',
    color: 'bg-blue-500/20 text-blue-400',
  },
];

export const QuickActions = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Quick Actions</h2>
        <Link href="/add" className="text-xs text-primary flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Card className="border-0 bg-card hover:bg-accent transition-colors haptic-press">
                <CardContent className="p-3 flex flex-col items-center justify-center gap-2">
                  <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-center text-muted-foreground">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
