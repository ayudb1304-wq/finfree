'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  TrendingDown,
  TrendingUp,
  Receipt,
  CreditCard,
  PiggyBank,
  Check,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFinFreeStore } from '@/lib/store';
import { formatCurrency, LIFESTYLE_BUDGET, TARGET_OD_PAYMENT, EMI_AMOUNT } from '@/lib/constants';
import type { Transaction } from '@/lib/types';

const transactionTypes = [
  { value: 'expense', label: 'Expense', icon: Receipt, color: 'bg-red-500/20 text-red-400' },
  { value: 'income', label: 'Income', icon: TrendingUp, color: 'bg-green-500/20 text-green-400' },
  { value: 'od_payment', label: 'OD Payment', icon: TrendingDown, color: 'bg-orange-500/20 text-orange-400' },
  { value: 'emi', label: 'EMI', icon: CreditCard, color: 'bg-purple-500/20 text-purple-400' },
  { value: 'savings', label: 'Savings', icon: PiggyBank, color: 'bg-blue-500/20 text-blue-400' },
] as const;

const expenseCategories = [
  { value: 'food_groceries', label: 'Food & Groceries' },
  { value: 'rent', label: 'Rent/Accommodation' },
  { value: 'transport', label: 'Transport/Fuel' },
  { value: 'utilities', label: 'Utilities & Subscriptions' },
  { value: 'phone_internet', label: 'Phone/Internet' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
  { value: 'other', label: 'Other' },
];

const savingsCategories = [
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'land_fund', label: 'Land Fund (Bangalore)' },
  { value: 'wedding_fund', label: 'Wedding Fund' },
  { value: 'other', label: 'Other Savings' },
];

function AddTransactionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as Transaction['type'] || 'expense';

  const [type, setType] = useState<Transaction['type']>(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addTransaction, recordODPayment, currentODBalance } = useFinFreeStore();

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    const numAmount = parseFloat(amount);

    try {
      if (type === 'od_payment') {
        recordODPayment(numAmount, description || 'OD Payment');
        toast.success(`OD Payment of ${formatCurrency(numAmount)} recorded!`, {
          description: `New balance: ${formatCurrency(Math.max(0, currentODBalance - numAmount))}`,
        });
      } else {
        addTransaction({
          date: new Date().toISOString(),
          amount: numAmount,
          type,
          category: category || type,
          description: description || getDefaultDescription(type, category),
        });
        toast.success('Transaction added!', {
          description: `${type.replace('_', ' ')} of ${formatCurrency(numAmount)} recorded`,
        });
      }

      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => router.push('/'), 500);
    } catch {
      toast.error('Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultDescription = (type: Transaction['type'], category: string): string => {
    if (type === 'income') return 'Monthly salary';
    if (type === 'emi') return 'Debit Card EMI';
    if (type === 'od_payment') return 'Axis OD Payment';
    if (type === 'savings') {
      const savingsCat = savingsCategories.find(c => c.value === category);
      return savingsCat?.label || 'Savings';
    }
    const expenseCat = expenseCategories.find(c => c.value === category);
    return expenseCat?.label || 'Expense';
  };

  const getQuickAmounts = (): number[] => {
    switch (type) {
      case 'od_payment':
        return [TARGET_OD_PAYMENT, 50000, 30000, 20000];
      case 'emi':
        return [EMI_AMOUNT];
      case 'income':
        return [109000, 100000, 50000];
      case 'savings':
        return [46000, 25000, 10000, 5000];
      case 'expense':
        if (category && LIFESTYLE_BUDGET[category as keyof typeof LIFESTYLE_BUDGET]) {
          const budget = LIFESTYLE_BUDGET[category as keyof typeof LIFESTYLE_BUDGET];
          return [budget, Math.round(budget / 2), Math.round(budget / 4)];
        }
        return [5000, 2000, 1000, 500];
      default:
        return [5000, 2000, 1000, 500];
    }
  };

  const getCategoryOptions = () => {
    if (type === 'expense') return expenseCategories;
    if (type === 'savings') return savingsCategories;
    return [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Add Transaction" showScore={false} />

      <form onSubmit={handleSubmit} className="px-4 py-4 max-w-md mx-auto space-y-6">
        {/* Transaction Type Selector */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Transaction Type</Label>
          <div className="grid grid-cols-5 gap-2">
            {transactionTypes.map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setType(t.value);
                    setCategory('');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all haptic-press ${
                    isSelected
                      ? `${t.color} ring-2 ring-primary`
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm text-muted-foreground">
            Amount (₹)
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
              ₹
            </span>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="pl-8 text-2xl font-bold h-14 bg-card border-0"
              min="0"
              step="1"
              required
            />
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2 mt-2">
            {getQuickAmounts().map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(quickAmount)}
                className="text-xs"
              >
                {formatCurrency(quickAmount)}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Select (for expenses and savings) */}
        {getCategoryOptions().length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-card border-0">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions().map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm text-muted-foreground">
            Description (optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={getDefaultDescription(type, category)}
            className="bg-card border-0 min-h-[80px]"
          />
        </div>

        {/* OD Balance Info */}
        {type === 'od_payment' && (
          <Card className="border-0 bg-orange-500/10">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Current OD Balance</p>
              <p className="text-xl font-bold text-orange-400">
                {formatCurrency(currentODBalance)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Recommended monthly payment: {formatCurrency(TARGET_OD_PAYMENT)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !amount}
          className="w-full h-12 text-base font-semibold"
        >
          {isSubmitting ? (
            'Adding...'
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Add {type.replace('_', ' ')}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default function AddTransactionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header title="Add Transaction" showScore={false} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <AddTransactionContent />
    </Suspense>
  );
}
