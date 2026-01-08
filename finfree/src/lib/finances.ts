// Financial Calculations for FinFree PWA
// All finance math goes here - no finance calculations in UI components

import {
  MONTHLY_NET_INCOME,
  EMI_AMOUNT,
  LIFESTYLE_CAP,
  OD_INTEREST_RATE_MONTHLY,
  EMERGENCY_FUND_TARGET,
  INITIAL_OD_BALANCE,
} from './constants';
import { Transaction, NetWorthSnapshot } from './types';

// ============================================
// SAVINGS RATE CALCULATIONS
// ============================================

/**
 * Calculate savings rate for a given month
 * Savings Rate = (Income - Expenses - EMI) / Income
 */
export const calculateSavingsRate = (
  income: number,
  expenses: number,
  emi: number = EMI_AMOUNT
): number => {
  const savings = income - expenses - emi;
  if (income <= 0) return 0;
  return Math.max(0, savings / income);
};

/**
 * Calculate actual savings amount
 */
export const calculateSavings = (
  income: number,
  expenses: number,
  emi: number = EMI_AMOUNT
): number => {
  return Math.max(0, income - expenses - emi);
};

// ============================================
// OD (OVERDRAFT) CALCULATIONS
// ============================================

/**
 * Calculate monthly interest on OD balance
 */
export const calculateODInterest = (balance: number): number => {
  return Math.round(balance * OD_INTEREST_RATE_MONTHLY);
};

/**
 * Calculate end balance after payment
 */
export const calculateODEndBalance = (
  startBalance: number,
  payment: number,
  interest?: number
): number => {
  const actualInterest = interest ?? calculateODInterest(startBalance);
  return Math.max(0, startBalance + actualInterest - payment);
};

/**
 * Calculate months to clear OD at given payment rate
 */
export const calculateMonthsToPayoff = (
  balance: number,
  monthlyPayment: number
): number => {
  if (monthlyPayment <= 0 || balance <= 0) return Infinity;
  
  let remaining = balance;
  let months = 0;
  const maxIterations = 120; // 10 years max
  
  while (remaining > 0 && months < maxIterations) {
    const interest = calculateODInterest(remaining);
    remaining = remaining + interest - monthlyPayment;
    months++;
  }
  
  return months >= maxIterations ? Infinity : months;
};

/**
 * Calculate total interest paid over payoff period
 */
export const calculateTotalInterest = (
  startBalance: number,
  monthlyPayment: number
): number => {
  let remaining = startBalance;
  let totalInterest = 0;
  let months = 0;
  const maxIterations = 120;
  
  while (remaining > 0 && months < maxIterations) {
    const interest = calculateODInterest(remaining);
    totalInterest += interest;
    remaining = remaining + interest - monthlyPayment;
    months++;
  }
  
  return totalInterest;
};

// ============================================
// FREEDOM SCORE CALCULATIONS
// ============================================

/**
 * Calculate Freedom Score (0-100%)
 * Based on progress through all financial phases
 */
export const calculateFreedomScore = (
  odBalance: number,
  emergencyFund: number,
  landFund: number,
  weddingFund: number
): number => {
  // Phase 1: OD Payoff (40% weight)
  const odProgress = Math.min(1, (INITIAL_OD_BALANCE - odBalance) / INITIAL_OD_BALANCE);
  const odScore = odProgress * 40;
  
  // Phase 2: Emergency Fund (20% weight)
  const efProgress = Math.min(1, emergencyFund / EMERGENCY_FUND_TARGET);
  const efScore = efProgress * 20;
  
  // Phase 3: Goals (40% weight)
  const landProgress = Math.min(1, landFund / 2500000);
  const weddingProgress = Math.min(1, weddingFund / 1500000);
  const goalsScore = ((landProgress + weddingProgress) / 2) * 40;
  
  return Math.round(odScore + efScore + goalsScore);
};

/**
 * Calculate FIRE progress
 * How much passive income you'd need to cover expenses
 */
export const calculateFIREProgress = (
  totalInvestments: number,
  monthlyExpenses: number,
  withdrawalRate: number = 0.04 // 4% rule
): number => {
  const requiredCorpus = (monthlyExpenses * 12) / withdrawalRate;
  return Math.min(100, (totalInvestments / requiredCorpus) * 100);
};

// ============================================
// NET WORTH CALCULATIONS
// ============================================

/**
 * Calculate current net worth
 */
export const calculateNetWorth = (
  assets: {
    bankBalance: number;
    emergencyFund: number;
    investments: number;
    landFund: number;
    weddingFund: number;
  },
  liabilities: {
    odBalance: number;
    emiOutstanding: number;
  }
): number => {
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0);
  return totalAssets - totalLiabilities;
};

/**
 * Create a net worth snapshot
 */
export const createNetWorthSnapshot = (
  assets: {
    bankBalance: number;
    emergencyFund: number;
    investments: number;
    landFund: number;
    weddingFund: number;
  },
  liabilities: {
    odBalance: number;
    emiOutstanding: number;
  }
): NetWorthSnapshot => {
  return {
    date: new Date().toISOString(),
    assets,
    liabilities,
    netWorth: calculateNetWorth(assets, liabilities),
  };
};

// ============================================
// MONTHLY CALCULATIONS
// ============================================

/**
 * Calculate available surplus for current month
 */
export const calculateMonthlySurplus = (
  income: number = MONTHLY_NET_INCOME,
  emi: number = EMI_AMOUNT,
  lifestyleCap: number = LIFESTYLE_CAP
): number => {
  return income - emi - lifestyleCap;
};

/**
 * Calculate remaining lifestyle budget
 */
export const calculateRemainingBudget = (
  spent: number,
  cap: number = LIFESTYLE_CAP
): number => {
  return Math.max(0, cap - spent);
};

/**
 * Calculate daily spending limit to stay within budget
 */
export const calculateDailyLimit = (
  remainingBudget: number,
  daysRemaining: number
): number => {
  if (daysRemaining <= 0) return 0;
  return Math.round(remainingBudget / daysRemaining);
};

// ============================================
// PROJECTION CALCULATIONS
// ============================================

/**
 * Project future value with compound growth
 */
export const projectFutureValue = (
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  months: number
): number => {
  const monthlyRate = annualRate / 12;
  let balance = principal;
  
  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
  }
  
  return Math.round(balance);
};

/**
 * Calculate time to reach goal
 */
export const calculateTimeToGoal = (
  currentAmount: number,
  targetAmount: number,
  monthlyContribution: number,
  annualGrowthRate: number = 0.08 // 8% assumed return
): number => {
  if (monthlyContribution <= 0) return Infinity;
  if (currentAmount >= targetAmount) return 0;
  
  const monthlyRate = annualGrowthRate / 12;
  let balance = currentAmount;
  let months = 0;
  const maxIterations = 600; // 50 years
  
  while (balance < targetAmount && months < maxIterations) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    months++;
  }
  
  return months >= maxIterations ? Infinity : months;
};

// ============================================
// TRANSACTION HELPERS
// ============================================

/**
 * Sum transactions by type for a given month
 */
export const sumTransactionsByType = (
  transactions: Transaction[],
  type: Transaction['type'],
  month: string
): number => {
  return transactions
    .filter((t) => t.type === type && t.month === month)
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Sum expenses by category for a given month
 */
export const sumExpensesByCategory = (
  transactions: Transaction[],
  category: string,
  month: string
): number => {
  return transactions
    .filter((t) => t.type === 'expense' && t.category === category && t.month === month)
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculate total for month
 */
export const calculateMonthlyTotals = (
  transactions: Transaction[],
  month: string
): {
  income: number;
  expenses: number;
  emiPaid: number;
  odPayment: number;
  savings: number;
} => {
  return {
    income: sumTransactionsByType(transactions, 'income', month),
    expenses: sumTransactionsByType(transactions, 'expense', month),
    emiPaid: sumTransactionsByType(transactions, 'emi', month),
    odPayment: sumTransactionsByType(transactions, 'od_payment', month),
    savings: sumTransactionsByType(transactions, 'savings', month),
  };
};

// ============================================
// BUDGET ANALYSIS
// ============================================

/**
 * Analyze spending against budget
 */
export const analyzeBudget = (
  transactions: Transaction[],
  month: string,
  budget: Record<string, number>
): Array<{
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
}> => {
  return Object.entries(budget).map(([category, budgeted]) => {
    const spent = sumExpensesByCategory(transactions, category, month);
    return {
      category,
      budgeted,
      spent,
      remaining: budgeted - spent,
      percentage: budgeted > 0 ? (spent / budgeted) * 100 : 0,
    };
  });
};

// ============================================
// DATE HELPERS
// ============================================

/**
 * Get current month in YYYY-MM format
 */
export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Get days remaining in current month
 */
export const getDaysRemaining = (): number => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.getDate() - now.getDate();
};

/**
 * Format month for display
 */
export const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};
