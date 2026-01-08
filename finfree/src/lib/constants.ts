// Financial Constants - Your Personal Numbers
// Based on Financial Recovery Plan 2026-2027
// Created: January 7, 2026

import { ODPayoffSchedule, FinancialPhase, Goal } from './types';

// ============================================
// INCOME & BUDGET CONSTANTS
// ============================================
export const MONTHLY_NET_INCOME = 109000;
export const EMI_AMOUNT = 18000;
export const EMI_MONTHS_REMAINING = 8; // As of Jan 2026
export const EMI_END_DATE = '2026-08-31';
export const LIFESTYLE_CAP = 45000;
export const TARGET_OD_PAYMENT = 46000;

// ============================================
// DEBT CONSTANTS
// ============================================
export const INITIAL_OD_BALANCE = 248989;
export const OVERDUE_LIABILITY = 3484;
export const OD_INTEREST_RATE_ANNUAL = 0.155; // ~15-16%
export const OD_INTEREST_RATE_MONTHLY = 0.0124; // ~1.24%

// ============================================
// LIFESTYLE BUDGET BREAKDOWN
// ============================================
export const LIFESTYLE_BUDGET = {
  food_groceries: 15000,
  rent: 15000,
  transport: 5000,
  utilities: 3000,
  phone_internet: 1500,
  miscellaneous: 5500,
} as const;

// ============================================
// GOAL TARGETS
// ============================================
export const EMERGENCY_FUND_TARGET = 135000; // 3 months essential expenses
export const LAND_FUND_TARGET = 2500000; // ₹25L minimum for Bangalore land
export const WEDDING_FUND_TARGET = 1500000; // ₹15L minimum
export const SITE_DEVELOPMENT_TARGET = 500000; // ₹5L

// ============================================
// PHASE DEFINITIONS
// ============================================
export const FINANCIAL_PHASES: FinancialPhase[] = [
  {
    id: 1,
    name: 'Phase 1: Debt Elimination',
    startMonth: '2026-02',
    endMonth: '2026-07',
    goal: 'Close ₹2.48L Axis Ready Credit OD',
    targetAmount: INITIAL_OD_BALANCE,
    isActive: true,
    isCompleted: false,
  },
  {
    id: 2,
    name: 'Phase 2: Emergency Fund',
    startMonth: '2026-08',
    endMonth: '2026-10',
    goal: 'Build 3-month emergency reserve',
    targetAmount: EMERGENCY_FUND_TARGET,
    isActive: false,
    isCompleted: false,
  },
  {
    id: 3,
    name: 'Phase 3: Goal Saving',
    startMonth: '2026-11',
    endMonth: '2027-12',
    goal: 'Save for Bangalore land & wedding',
    targetAmount: LAND_FUND_TARGET + WEDDING_FUND_TARGET,
    isActive: false,
    isCompleted: false,
  },
];

// ============================================
// OD PAYOFF SCHEDULE
// ============================================
export const OD_PAYOFF_SCHEDULE: ODPayoffSchedule[] = [
  { month: '2026-02', startBalance: 248989, estimatedInterest: 3083, payment: 46000, endBalance: 206072, interestPaidYTD: 3083 },
  { month: '2026-03', startBalance: 206072, estimatedInterest: 2552, payment: 46000, endBalance: 162624, interestPaidYTD: 5635 },
  { month: '2026-04', startBalance: 162624, estimatedInterest: 2014, payment: 46000, endBalance: 118638, interestPaidYTD: 7649 },
  { month: '2026-05', startBalance: 118638, estimatedInterest: 1469, payment: 46000, endBalance: 74108, interestPaidYTD: 9118 },
  { month: '2026-06', startBalance: 74108, estimatedInterest: 918, payment: 46000, endBalance: 29025, interestPaidYTD: 10036 },
  { month: '2026-07', startBalance: 29025, estimatedInterest: 359, payment: 46000, endBalance: 0, interestPaidYTD: 10395 },
];

// ============================================
// POST-OD ALLOCATION (Aug 2026 onwards)
// ============================================
export const POST_OD_ALLOCATION = {
  emergencyFundTopUp: 5000,
  landFund: 25000,
  weddingFund: 10000,
  lifestyleBuffer: 6000,
} as const;

// ============================================
// MILESTONES
// ============================================
export const MILESTONES = [
  { id: 'od_150k', name: 'OD below ₹1.5L', target: 150000, type: 'debt_milestone' },
  { id: 'od_75k', name: 'OD below ₹75K', target: 75000, type: 'debt_milestone' },
  { id: 'od_zero', name: 'OD Cleared! 🎉', target: 0, type: 'debt_milestone' },
  { id: 'ef_50k', name: 'Emergency Fund ₹50K', target: 50000, type: 'savings_milestone' },
  { id: 'ef_100k', name: 'Emergency Fund ₹1L', target: 100000, type: 'savings_milestone' },
  { id: 'ef_complete', name: 'Emergency Fund Complete! 🎉', target: 135000, type: 'savings_milestone' },
  { id: 'land_1l', name: 'Land Fund ₹1L', target: 100000, type: 'savings_milestone' },
  { id: 'land_5l', name: 'Land Fund ₹5L', target: 500000, type: 'savings_milestone' },
];

// ============================================
// DEFAULT GOALS
// ============================================
export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'od-payoff',
    name: 'Clear Axis OD',
    targetAmount: INITIAL_OD_BALANCE,
    currentAmount: 0, // Amount paid so far
    targetDate: '2026-07-31',
    startDate: '2026-02-01',
    category: 'debt_payoff',
    monthlyContribution: TARGET_OD_PAYMENT,
    isCompleted: false,
  },
  {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    targetAmount: EMERGENCY_FUND_TARGET,
    currentAmount: 0,
    targetDate: '2026-10-31',
    startDate: '2026-08-01',
    category: 'emergency_fund',
    monthlyContribution: 46000,
    isCompleted: false,
  },
  {
    id: 'land-fund',
    name: 'Bangalore Land',
    targetAmount: LAND_FUND_TARGET,
    currentAmount: 0,
    targetDate: '2027-06-30',
    startDate: '2026-11-01',
    category: 'savings_goal',
    monthlyContribution: 25000,
    isCompleted: false,
  },
  {
    id: 'wedding-fund',
    name: 'Wedding Fund',
    targetAmount: WEDDING_FUND_TARGET,
    currentAmount: 0,
    targetDate: '2027-12-31',
    startDate: '2026-11-01',
    category: 'savings_goal',
    monthlyContribution: 10000,
    isCompleted: false,
  },
];

// ============================================
// FORMATTING HELPERS
// ============================================
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount}`;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};
