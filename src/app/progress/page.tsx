'use client';

import { useState } from 'react';
import { format, subMonths, startOfMonth } from 'date-fns';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  PiggyBank,
  CreditCard,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFinFreeStore, useHydration } from '@/lib/store';
import { formatCurrency, formatCompactCurrency, INITIAL_OD_BALANCE, OD_PAYOFF_SCHEDULE } from '@/lib/constants';
import type { Transaction } from '@/lib/types';

// Generate mock historical data for charts
const generateODProgressData = (currentODBalance: number) => {
  const data = OD_PAYOFF_SCHEDULE.map((schedule) => ({
    month: format(new Date(schedule.month + '-01'), 'MMM'),
    planned: schedule.endBalance,
    actual: null as number | null,
  }));

  // For demo, set some actual values based on current balance
  const currentIdx = data.findIndex(
    (d) => d.planned !== null && d.planned <= currentODBalance
  );
  
  if (currentIdx >= 0) {
    data[0].actual = INITIAL_OD_BALANCE;
    if (currentIdx > 0) {
      data.slice(0, currentIdx).forEach((d, i) => {
        d.actual = OD_PAYOFF_SCHEDULE[i].startBalance;
      });
    }
    data[currentIdx].actual = currentODBalance;
  }

  return data;
};

const generateNetWorthData = () => {
  // Generate 6 months of hypothetical net worth progression
  return Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      month: format(date, 'MMM'),
      netWorth: -248989 + i * 46000, // Starting from initial debt
    };
  });
};

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

export default function ProgressPage() {
  const hydrated = useHydration();
  const { transactions, currentODBalance, deleteTransaction } = useFinFreeStore();
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const odProgressData = generateODProgressData(currentODBalance);
  const netWorthData = generateNetWorthData();

  // Filter transactions by selected month
  const monthStr = format(selectedMonth, 'yyyy-MM');
  const monthlyTransactions = transactions
    .filter((t) => t.month === monthStr)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate monthly totals
  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyODPayment = monthlyTransactions
    .filter((t) => t.type === 'od_payment')
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsRate =
    monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  const handlePrevMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth <= new Date()) {
      setSelectedMonth(nextMonth);
    }
  };

  const handleDeleteTransaction = () => {
    if (!transactionToDelete) return;
    
    deleteTransaction(transactionToDelete.id);
    toast.success('Transaction deleted', {
      description: `${transactionToDelete.description} - ${formatCurrency(transactionToDelete.amount)}`,
    });
    setTransactionToDelete(null);
  };

  // Show loading while hydrating
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Progress" />
        <div className="px-4 py-4 max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Progress" />

      <div className="px-4 py-4 max-w-md mx-auto space-y-6">
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card">
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Calendar className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-4 mt-4">
            {/* OD Payoff Progress Chart */}
            <Card className="border-0 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-400" />
                  OD Payoff Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={odProgressData}>
                      <defs>
                        <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: '#888', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                      />
                      <YAxis
                        tick={{ fill: '#888', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [formatCurrency(value as number), '']}
                        labelStyle={{ color: '#888' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="planned"
                        stroke="#f97316"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="url(#colorPlanned)"
                        name="Target"
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fill="url(#colorActual)"
                        name="Actual"
                        connectNulls
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-orange-500" style={{ borderStyle: 'dashed' }} />
                    <span className="text-muted-foreground">Target</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-green-500" />
                    <span className="text-muted-foreground">Actual</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Net Worth Trend */}
            <Card className="border-0 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Net Worth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={netWorthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: '#888', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                      />
                      <YAxis
                        tick={{ fill: '#888', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                        tickFormatter={(value) => formatCompactCurrency(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [formatCurrency(value as number), 'Net Worth']}
                        labelStyle={{ color: '#888' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="netWorth"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: '#22c55e', strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Comparison */}
            <Card className="border-0 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  Income vs Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Income', value: monthlyIncome || 109000, fill: '#22c55e' },
                        { name: 'Expenses', value: monthlyExpenses || 45000, fill: '#ef4444' },
                        { name: 'OD Pay', value: monthlyODPayment || 46000, fill: '#f97316' },
                        { name: 'EMI', value: 18000, fill: '#a855f7' },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: '#888', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                        tickFormatter={(value) => formatCompactCurrency(value)}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#888', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                        width={60}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [formatCurrency(value as number), '']}
                        labelStyle={{ color: '#888' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            {/* Month Selector */}
            <Card className="border-0 bg-card">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold">
                    {format(selectedMonth, 'MMMM yyyy')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="h-8 w-8"
                    disabled={selectedMonth >= startOfMonth(new Date())}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-0 bg-green-500/10">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">Income</p>
                  <p className="text-lg font-bold text-green-400">
                    {formatCurrency(monthlyIncome)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-red-500/10">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">Expenses</p>
                  <p className="text-lg font-bold text-red-400">
                    {formatCurrency(monthlyExpenses)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-orange-500/10">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">OD Payment</p>
                  <p className="text-lg font-bold text-orange-400">
                    {formatCurrency(monthlyODPayment)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-blue-500/10">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">Savings Rate</p>
                  <p className="text-lg font-bold text-blue-400">{savingsRate.toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>

            {/* Transaction List */}
            <Card className="border-0 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {monthlyTransactions.length === 0 ? (
                  <div className="p-6 text-center">
                    <Receipt className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No transactions for {format(selectedMonth, 'MMMM yyyy')}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {monthlyTransactions.map((transaction) => {
                      const Icon = transactionIcons[transaction.type];
                      const colorClass = transactionColors[transaction.type];
                      const isIncome = transaction.type === 'income';

                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center gap-3 p-3 group"
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center ${colorClass}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(transaction.date), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              isIncome ? 'text-green-400' : 'text-foreground'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

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
            <Button variant="destructive" onClick={handleDeleteTransaction}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
