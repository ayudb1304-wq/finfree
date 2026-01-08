'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  Transaction,
  MonthlyRecord,
  Goal,
  FinancialState,
} from './types';
import {
  MONTHLY_NET_INCOME,
  INITIAL_OD_BALANCE,
  EMI_AMOUNT,
  EMI_END_DATE,
  LIFESTYLE_CAP,
  TARGET_OD_PAYMENT,
  DEFAULT_GOALS,
} from './constants';
import {
  getCurrentMonth,
  calculateSavingsRate,
  calculateODEndBalance,
  calculateODInterest,
} from './finances';

interface FinFreeStore extends FinancialState {
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'month'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // OD Management
  updateODBalance: (amount: number) => void;
  recordODPayment: (amount: number, description?: string) => void;
  
  // Fund Management
  updateEmergencyFund: (amount: number) => void;
  updateLandFund: (amount: number) => void;
  updateWeddingFund: (amount: number) => void;
  
  // Goals
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  
  // Monthly Records
  getMonthlyRecord: (month: string) => MonthlyRecord | undefined;
  updateMonthlyRecord: (month: string, updates: Partial<MonthlyRecord>) => void;
  
  // Settings
  updateLifestyleCap: (amount: number) => void;
  
  // Reset
  resetToDefaults: () => void;
}

const getInitialState = (): FinancialState => ({
  monthlyNetIncome: MONTHLY_NET_INCOME,
  currentODBalance: INITIAL_OD_BALANCE,
  emiRemaining: 8,
  emiAmount: EMI_AMOUNT,
  emiEndDate: EMI_END_DATE,
  emergencyFund: 0,
  landFund: 0,
  weddingFund: 0,
  monthlyRecords: [],
  goals: DEFAULT_GOALS,
  transactions: [],
  lifestyleCap: LIFESTYLE_CAP,
  targetODPayment: TARGET_OD_PAYMENT,
});

export const useFinFreeStore = create<FinFreeStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // Transaction Management
      addTransaction: (transaction) => {
        const month = getCurrentMonth();
        const newTransaction: Transaction = {
          ...transaction,
          id: uuidv4(),
          month,
        };

        set((state) => {
          const newTransactions = [...state.transactions, newTransaction];
          
          // Update current OD balance if it's an OD payment
          let newODBalance = state.currentODBalance;
          if (transaction.type === 'od_payment') {
            const interest = calculateODInterest(state.currentODBalance);
            newODBalance = calculateODEndBalance(
              state.currentODBalance,
              transaction.amount,
              interest
            );
          }

          // Update funds based on transaction type
          let newEmergencyFund = state.emergencyFund;
          let newLandFund = state.landFund;
          let newWeddingFund = state.weddingFund;

          if (transaction.type === 'savings') {
            if (transaction.category === 'emergency_fund') {
              newEmergencyFund += transaction.amount;
            } else if (transaction.category === 'land_fund') {
              newLandFund += transaction.amount;
            } else if (transaction.category === 'wedding_fund') {
              newWeddingFund += transaction.amount;
            }
          }

          return {
            transactions: newTransactions,
            currentODBalance: newODBalance,
            emergencyFund: newEmergencyFund,
            landFund: newLandFund,
            weddingFund: newWeddingFund,
          };
        });
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      // OD Management
      updateODBalance: (amount) => {
        set({ currentODBalance: Math.max(0, amount) });
      },

      recordODPayment: (amount, description = 'OD Payment') => {
        const { addTransaction } = get();
        
        addTransaction({
          date: new Date().toISOString(),
          amount,
          type: 'od_payment',
          category: 'od_payment',
          description,
        });

        // Update goal progress
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === 'od-payoff'
              ? {
                  ...g,
                  currentAmount: g.currentAmount + amount,
                  isCompleted: state.currentODBalance <= 0,
                }
              : g
          ),
        }));
      },

      // Fund Management
      updateEmergencyFund: (amount) => {
        set((state) => {
          const newAmount = Math.max(0, amount);
          return {
            emergencyFund: newAmount,
            goals: state.goals.map((g) =>
              g.id === 'emergency-fund'
                ? { ...g, currentAmount: newAmount, isCompleted: newAmount >= g.targetAmount }
                : g
            ),
          };
        });
      },

      updateLandFund: (amount) => {
        set((state) => {
          const newAmount = Math.max(0, amount);
          return {
            landFund: newAmount,
            goals: state.goals.map((g) =>
              g.id === 'land-fund'
                ? { ...g, currentAmount: newAmount, isCompleted: newAmount >= g.targetAmount }
                : g
            ),
          };
        });
      },

      updateWeddingFund: (amount) => {
        set((state) => {
          const newAmount = Math.max(0, amount);
          return {
            weddingFund: newAmount,
            goals: state.goals.map((g) =>
              g.id === 'wedding-fund'
                ? { ...g, currentAmount: newAmount, isCompleted: newAmount >= g.targetAmount }
                : g
            ),
          };
        });
      },

      // Goals
      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }));
      },

      // Monthly Records
      getMonthlyRecord: (month) => {
        return get().monthlyRecords.find((r) => r.month === month);
      },

      updateMonthlyRecord: (month, updates) => {
        set((state) => {
          const existingIndex = state.monthlyRecords.findIndex((r) => r.month === month);
          
          if (existingIndex >= 0) {
            const newRecords = [...state.monthlyRecords];
            newRecords[existingIndex] = { ...newRecords[existingIndex], ...updates };
            return { monthlyRecords: newRecords };
          }

          // Create new record
          const monthTransactions = state.transactions.filter((t) => t.month === month);
          const income = monthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          const expenses = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          const emiPaid = monthTransactions
            .filter((t) => t.type === 'emi')
            .reduce((sum, t) => sum + t.amount, 0);
          const odPayment = monthTransactions
            .filter((t) => t.type === 'od_payment')
            .reduce((sum, t) => sum + t.amount, 0);

          const newRecord: MonthlyRecord = {
            month,
            income,
            expenses,
            emiPaid,
            odPayment,
            savings: income - expenses - emiPaid,
            savingsRate: calculateSavingsRate(income, expenses, emiPaid),
            lifestyleSpent: expenses,
            transactions: monthTransactions,
            notes: '',
            ...updates,
          };

          return { monthlyRecords: [...state.monthlyRecords, newRecord] };
        });
      },

      // Settings
      updateLifestyleCap: (amount) => {
        set({ lifestyleCap: amount });
      },

      // Reset
      resetToDefaults: () => {
        set(getInitialState());
      },
    }),
    {
      name: 'finfree-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selector hooks for common computed values
export const useCurrentPhase = () => {
  const odBalance = useFinFreeStore((state) => state.currentODBalance);
  const emergencyFund = useFinFreeStore((state) => state.emergencyFund);

  if (odBalance > 0) return 1;
  if (emergencyFund < 135000) return 2;
  return 3;
};

export const useFreedomScore = () => {
  const odBalance = useFinFreeStore((state) => state.currentODBalance);
  const emergencyFund = useFinFreeStore((state) => state.emergencyFund);
  const landFund = useFinFreeStore((state) => state.landFund);
  const weddingFund = useFinFreeStore((state) => state.weddingFund);

  // Phase 1: OD Payoff (40% weight)
  const odProgress = Math.min(1, (INITIAL_OD_BALANCE - odBalance) / INITIAL_OD_BALANCE);
  const odScore = odProgress * 40;

  // Phase 2: Emergency Fund (20% weight)
  const efProgress = Math.min(1, emergencyFund / 135000);
  const efScore = efProgress * 20;

  // Phase 3: Goals (40% weight)
  const landProgress = Math.min(1, landFund / 2500000);
  const weddingProgress = Math.min(1, weddingFund / 1500000);
  const goalsScore = ((landProgress + weddingProgress) / 2) * 40;

  return Math.round(odScore + efScore + goalsScore);
};

export const useNetWorth = () => {
  const emergencyFund = useFinFreeStore((state) => state.emergencyFund);
  const landFund = useFinFreeStore((state) => state.landFund);
  const weddingFund = useFinFreeStore((state) => state.weddingFund);
  const odBalance = useFinFreeStore((state) => state.currentODBalance);
  const emiRemaining = useFinFreeStore((state) => state.emiRemaining);
  const emiAmount = useFinFreeStore((state) => state.emiAmount);

  const totalAssets = emergencyFund + landFund + weddingFund;
  const totalLiabilities = odBalance + (emiRemaining * emiAmount);

  return totalAssets - totalLiabilities;
};
