// Financial Data Types for FinFree PWA

export interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  type: 'income' | 'expense' | 'od_payment' | 'emi' | 'savings';
  category: string;
  description: string;
  month: string; // YYYY-MM format
}

export interface MonthlyRecord {
  month: string; // YYYY-MM format
  income: number;
  expenses: number;
  emiPaid: number;
  odPayment: number;
  savings: number;
  savingsRate: number;
  lifestyleSpent: number;
  transactions: Transaction[];
  notes: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date
  startDate: string;
  category: 'debt_payoff' | 'emergency_fund' | 'savings_goal';
  monthlyContribution: number;
  isCompleted: boolean;
}

export interface ODPayoffSchedule {
  month: string;
  startBalance: number;
  estimatedInterest: number;
  payment: number;
  endBalance: number;
  interestPaidYTD: number;
}

export interface FinancialPhase {
  id: number;
  name: string;
  startMonth: string;
  endMonth: string;
  goal: string;
  targetAmount: number;
  isActive: boolean;
  isCompleted: boolean;
}

export interface LifestyleCategory {
  name: string;
  budgeted: number;
  spent: number;
  icon: string;
}

export interface EMI {
  id: string;
  name: string;
  amount: number;
  totalInstallments: number;
  paidInstallments: number;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface FinancialState {
  // Current snapshot
  monthlyNetIncome: number;
  currentODBalance: number;
  emiRemaining: number;
  emiAmount: number;
  emiEndDate: string;
  emergencyFund: number;
  landFund: number;
  weddingFund: number;
  
  // Monthly records
  monthlyRecords: MonthlyRecord[];
  
  // Goals
  goals: Goal[];
  
  // Transactions
  transactions: Transaction[];
  
  // EMIs
  emis: EMI[];
  
  // Settings
  lifestyleCap: number;
  targetODPayment: number;
}

export interface NetWorthSnapshot {
  date: string;
  assets: {
    bankBalance: number;
    emergencyFund: number;
    investments: number;
    landFund: number;
    weddingFund: number;
  };
  liabilities: {
    odBalance: number;
    emiOutstanding: number;
  };
  netWorth: number;
}

export type ExpenseCategory = 
  | 'food_groceries'
  | 'rent'
  | 'transport'
  | 'utilities'
  | 'phone_internet'
  | 'miscellaneous'
  | 'emi'
  | 'od_payment'
  | 'savings'
  | 'other';

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; icon: string; budget?: number }> = {
  food_groceries: { label: 'Food & Groceries', icon: 'UtensilsCrossed', budget: 15000 },
  rent: { label: 'Rent/Accommodation', icon: 'Home', budget: 15000 },
  transport: { label: 'Transport/Fuel', icon: 'Car', budget: 5000 },
  utilities: { label: 'Utilities & Subscriptions', icon: 'Zap', budget: 3000 },
  phone_internet: { label: 'Phone/Internet', icon: 'Smartphone', budget: 1500 },
  miscellaneous: { label: 'Miscellaneous', icon: 'MoreHorizontal', budget: 5500 },
  emi: { label: 'EMI Payment', icon: 'CreditCard' },
  od_payment: { label: 'OD Payment', icon: 'TrendingDown' },
  savings: { label: 'Savings', icon: 'PiggyBank' },
  other: { label: 'Other', icon: 'Circle' },
};
