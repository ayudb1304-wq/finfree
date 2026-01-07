"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { openDB, IDBPDatabase } from "idb";
import {
  Asset,
  Liability,
  MonthlyEntry,
  generateId,
  calculateNetWorth,
  calculateTotalAssets,
  calculateTotalLiabilities,
  calculateFreedomScore,
  calculateFIRENumber,
  calculateYearsToFIRE,
  calculateAverageMonthlyExpenses,
  calculateAverageMonthlyIncome,
  calculateAverageSavingsRate,
  calculateFIRETargets,
} from "./finances";

const DB_NAME = "freedompath-db";
const STORE_NAME = "app-state";
const DB_VERSION = 1;

// IndexedDB storage adapter for Zustand
let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
};

const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const db = await getDB();
    if (!db) return null;
    const value = await db.get(STORE_NAME, name);
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const db = await getDB();
    if (!db) return;
    await db.put(STORE_NAME, value, name);
  },
  removeItem: async (name: string): Promise<void> => {
    const db = await getDB();
    if (!db) return;
    await db.delete(STORE_NAME, name);
  },
};

export interface UserSettings {
  currency: string;
  locale: string;
  withdrawalRate: number;
  expectedReturn: number;
  currentAge: number;
  targetRetirementAge: number;
}

export interface AppState {
  // Data
  assets: Asset[];
  liabilities: Liability[];
  monthlyEntries: MonthlyEntry[];
  settings: UserSettings;
  
  // Computed (cached for performance)
  _hydrated: boolean;
  
  // Asset actions
  addAsset: (asset: Omit<Asset, "id" | "lastUpdated">) => void;
  updateAsset: (id: string, updates: Partial<Omit<Asset, "id">>) => void;
  deleteAsset: (id: string) => void;
  
  // Liability actions
  addLiability: (liability: Omit<Liability, "id" | "lastUpdated">) => void;
  updateLiability: (id: string, updates: Partial<Omit<Liability, "id">>) => void;
  deleteLiability: (id: string) => void;
  
  // Monthly entry actions
  addMonthlyEntry: (entry: Omit<MonthlyEntry, "id">) => void;
  updateMonthlyEntry: (id: string, updates: Partial<Omit<MonthlyEntry, "id">>) => void;
  deleteMonthlyEntry: (id: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Hydration
  setHydrated: () => void;
}

const defaultSettings: UserSettings = {
  currency: "USD",
  locale: "en-US",
  withdrawalRate: 0.04,
  expectedReturn: 0.07,
  currentAge: 30,
  targetRetirementAge: 65,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      assets: [],
      liabilities: [],
      monthlyEntries: [],
      settings: defaultSettings,
      _hydrated: false,

      // Asset actions
      addAsset: (asset) =>
        set((state) => ({
          assets: [
            ...state.assets,
            {
              ...asset,
              id: generateId(),
              lastUpdated: new Date().toISOString(),
            },
          ],
        })),

      updateAsset: (id, updates) =>
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === id
              ? { ...asset, ...updates, lastUpdated: new Date().toISOString() }
              : asset
          ),
        })),

      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        })),

      // Liability actions
      addLiability: (liability) =>
        set((state) => ({
          liabilities: [
            ...state.liabilities,
            {
              ...liability,
              id: generateId(),
              lastUpdated: new Date().toISOString(),
            },
          ],
        })),

      updateLiability: (id, updates) =>
        set((state) => ({
          liabilities: state.liabilities.map((liability) =>
            liability.id === id
              ? { ...liability, ...updates, lastUpdated: new Date().toISOString() }
              : liability
          ),
        })),

      deleteLiability: (id) =>
        set((state) => ({
          liabilities: state.liabilities.filter((liability) => liability.id !== id),
        })),

      // Monthly entry actions
      addMonthlyEntry: (entry) =>
        set((state) => ({
          monthlyEntries: [
            ...state.monthlyEntries,
            {
              ...entry,
              id: generateId(),
            },
          ],
        })),

      updateMonthlyEntry: (id, updates) =>
        set((state) => ({
          monthlyEntries: state.monthlyEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        })),

      deleteMonthlyEntry: (id) =>
        set((state) => ({
          monthlyEntries: state.monthlyEntries.filter((entry) => entry.id !== id),
        })),

      // Settings actions
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Hydration
      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "freedompath-storage",
      storage: createJSONStorage(() => 
        typeof window !== "undefined" ? indexedDBStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// Selectors for computed values
export const useNetWorth = () => {
  const assets = useAppStore((state) => state.assets);
  const liabilities = useAppStore((state) => state.liabilities);
  return calculateNetWorth(assets, liabilities);
};

export const useTotalAssets = () => {
  const assets = useAppStore((state) => state.assets);
  return calculateTotalAssets(assets);
};

export const useTotalLiabilities = () => {
  const liabilities = useAppStore((state) => state.liabilities);
  return calculateTotalLiabilities(liabilities);
};

export const useInvestedAssets = () => {
  const assets = useAppStore((state) => state.assets);
  // Consider stocks, bonds, crypto as invested assets
  return assets
    .filter((a) => ["stocks", "bonds", "crypto"].includes(a.type))
    .reduce((sum, a) => sum + a.value, 0);
};

export const useAverageMonthlyExpenses = () => {
  const entries = useAppStore((state) => state.monthlyEntries);
  return calculateAverageMonthlyExpenses(entries);
};

export const useAverageMonthlyIncome = () => {
  const entries = useAppStore((state) => state.monthlyEntries);
  return calculateAverageMonthlyIncome(entries);
};

export const useAverageSavingsRate = () => {
  const entries = useAppStore((state) => state.monthlyEntries);
  return calculateAverageSavingsRate(entries);
};

export const useFreedomScore = () => {
  const investedAssets = useInvestedAssets();
  const avgExpenses = useAverageMonthlyExpenses();
  const settings = useAppStore((state) => state.settings);
  return calculateFreedomScore(investedAssets, avgExpenses, settings.withdrawalRate);
};

export const useFIRENumber = () => {
  const avgExpenses = useAverageMonthlyExpenses();
  const settings = useAppStore((state) => state.settings);
  return calculateFIRENumber(avgExpenses, settings.withdrawalRate);
};

export const useYearsToFIRE = () => {
  const netWorth = useNetWorth();
  const avgIncome = useAverageMonthlyIncome();
  const avgExpenses = useAverageMonthlyExpenses();
  const fireNumber = useFIRENumber();
  const settings = useAppStore((state) => state.settings);
  
  const monthlySavings = avgIncome - avgExpenses;
  return calculateYearsToFIRE(netWorth, monthlySavings, fireNumber, settings.expectedReturn);
};

export const useFIRETargets = () => {
  const avgExpenses = useAverageMonthlyExpenses();
  const settings = useAppStore((state) => state.settings);
  return calculateFIRETargets(
    avgExpenses,
    settings.currentAge,
    settings.targetRetirementAge,
    settings.expectedReturn
  );
};

export const useIsHydrated = () => useAppStore((state) => state._hydrated);
