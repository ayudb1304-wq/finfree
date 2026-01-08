'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Receipt,
  CreditCard,
  PiggyBank,
  Trash2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFinFreeStore, useHydration } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';
import type { Transaction } from '@/lib/types';

const transactionIcons: Record<Transaction['type'], React.ElementType> = {
  income: TrendingUp,
  expense: Receipt,
  od_payment: TrendingDown,
  emi: CreditCard,
  savings: PiggyBank,
};

const transactionColors: Record<Transaction['type'], string> = {
  income: 'text-green-400 bg-green-500/20',
  expense: 'text-red-400 bg-red-500/20',
  od_payment: 'text-orange-400 bg-orange-500/20',
  emi: 'text-purple-400 bg-purple-500/20',
  savings: 'text-blue-400 bg-blue-500/20',
};

export const RecentTransactions = () => {
  const hydrated = useHydration();
  const { transactions, deleteTransaction } = useFinFreeStore();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  // Get last 5 transactions sorted by date
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleDelete = () => {
    if (!transactionToDelete) return;
    
    deleteTransaction(transactionToDelete.id);
    toast.success('Transaction deleted', {
      description: `${transactionToDelete.description} - ${formatCurrency(transactionToDelete.amount)}`,
    });
    setTransactionToDelete(null);
  };

  // Show loading state while hydrating
  if (!hydrated) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h2>
        </div>
        <Card className="border-0 bg-card">
          <CardContent className="p-6 text-center">
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-muted rounded" />
              <div className="h-12 bg-muted rounded" />
              <div className="h-12 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h2>
        </div>
        <Card className="border-0 bg-card">
          <CardContent className="p-6 text-center">
            <Receipt className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <Link
              href="/add"
              className="text-xs text-primary mt-2 inline-block hover:underline"
            >
              Add your first transaction →
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h2>
        <Link href="/progress" className="text-xs text-primary flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <Card className="border-0 bg-card">
        <CardContent className="p-0 divide-y divide-border">
          {recentTransactions.map((transaction) => {
            const Icon = transactionIcons[transaction.type];
            const colorClass = transactionColors[transaction.type];
            const isIncome = transaction.type === 'income';

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), 'MMM d, h:mm a')}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${isIncome ? 'text-green-400' : 'text-foreground'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                <button
                  onClick={() => setTransactionToDelete(transaction)}
                  className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {transactionToDelete && (
            <div className="py-4 space-y-2">
              <p className="font-medium">{transactionToDelete.description}</p>
              <p className="text-sm text-muted-foreground">
                Amount: {formatCurrency(transactionToDelete.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {format(new Date(transactionToDelete.date), 'PPP')}
              </p>
              {(transactionToDelete.type === 'od_payment' || transactionToDelete.type === 'savings') && (
                <p className="text-xs text-orange-400 mt-2">
                  ⚠️ Deleting this will reverse the effect on your balances.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransactionToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
