/**
 * Financial calculations for FIRE (Financial Independence, Retire Early)
 * All finance math is centralized here - no calculations in UI components
 */

export interface Asset {
  id: string;
  name: string;
  type: "cash" | "stocks" | "real_estate" | "bonds" | "crypto" | "other";
  value: number;
  lastUpdated: string;
}

export interface Liability {
  id: string;
  name: string;
  type: "mortgage" | "car_loan" | "student_loan" | "credit_card" | "other";
  value: number;
  lastUpdated: string;
}

export interface MonthlyEntry {
  id: string;
  month: string; // YYYY-MM format
  income: number;
  expenses: number;
}

export interface FIRETargets {
  leanFIRE: number; // 25x lean annual expenses
  coastFIRE: number; // Amount needed now to coast (no more contributions)
  regularFIRE: number; // 25x annual expenses
  fatFIRE: number; // 25x fat annual expenses (2x regular)
}

/**
 * Calculate net worth from assets and liabilities
 */
export const calculateNetWorth = (
  assets: Asset[],
  liabilities: Liability[]
): number => {
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce(
    (sum, liability) => sum + liability.value,
    0
  );
  return totalAssets - totalLiabilities;
};

/**
 * Calculate total assets value
 */
export const calculateTotalAssets = (assets: Asset[]): number => {
  return assets.reduce((sum, asset) => sum + asset.value, 0);
};

/**
 * Calculate total liabilities value
 */
export const calculateTotalLiabilities = (liabilities: Liability[]): number => {
  return liabilities.reduce((sum, liability) => sum + liability.value, 0);
};

/**
 * Calculate savings rate as a percentage
 */
export const calculateSavingsRate = (
  income: number,
  expenses: number
): number => {
  if (income <= 0) return 0;
  const savings = income - expenses;
  return Math.max(0, Math.min(100, (savings / income) * 100));
};

/**
 * Calculate monthly passive income using 4% rule (Safe Withdrawal Rate)
 * Annual withdrawal = 4% of portfolio, divided by 12 for monthly
 */
export const calculateMonthlyPassiveIncome = (
  investedAssets: number,
  withdrawalRate: number = 0.04
): number => {
  return (investedAssets * withdrawalRate) / 12;
};

/**
 * Calculate Freedom Score (0-100%)
 * Percentage of monthly expenses covered by passive income
 */
export const calculateFreedomScore = (
  investedAssets: number,
  monthlyExpenses: number,
  withdrawalRate: number = 0.04
): number => {
  if (monthlyExpenses <= 0) return 100;
  const passiveIncome = calculateMonthlyPassiveIncome(
    investedAssets,
    withdrawalRate
  );
  return Math.min(100, (passiveIncome / monthlyExpenses) * 100);
};

/**
 * Calculate FIRE number - amount needed to achieve financial independence
 * Based on 4% rule: 25x annual expenses
 */
export const calculateFIRENumber = (
  monthlyExpenses: number,
  withdrawalRate: number = 0.04
): number => {
  const annualExpenses = monthlyExpenses * 12;
  return annualExpenses / withdrawalRate;
};

/**
 * Calculate years to FIRE using compound interest formula
 * @param currentNetWorth Current invested amount
 * @param monthlyContribution Monthly savings amount
 * @param fireNumber Target FIRE number
 * @param annualReturn Expected annual return (default 7%)
 */
export const calculateYearsToFIRE = (
  currentNetWorth: number,
  monthlyContribution: number,
  fireNumber: number,
  annualReturn: number = 0.07
): number => {
  if (currentNetWorth >= fireNumber) return 0;
  if (monthlyContribution <= 0 && currentNetWorth <= 0) return Infinity;

  const monthlyRate = annualReturn / 12;

  // If only relying on growth (no contributions)
  if (monthlyContribution <= 0) {
    return Math.log(fireNumber / currentNetWorth) / Math.log(1 + annualReturn);
  }

  // Future value formula with regular contributions
  // FV = P(1+r)^n + PMT * (((1+r)^n - 1) / r)
  // Solve for n using iterative approach
  let years = 0;
  let balance = currentNetWorth;

  while (balance < fireNumber && years < 100) {
    // Monthly compounding
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    years++;
  }

  return years >= 100 ? Infinity : years;
};

/**
 * Calculate FIRE milestone targets
 */
export const calculateFIRETargets = (
  monthlyExpenses: number,
  currentAge: number = 30,
  retirementAge: number = 65,
  annualReturn: number = 0.07
): FIRETargets => {
  const annualExpenses = monthlyExpenses * 12;
  const leanExpenses = annualExpenses * 0.6; // 60% of regular
  const fatExpenses = annualExpenses * 2; // 200% of regular

  // Coast FIRE: amount needed now that will grow to regular FIRE by retirement age
  const yearsToRetirement = retirementAge - currentAge;
  const regularFIRE = annualExpenses * 25;
  const coastFIRE = regularFIRE / Math.pow(1 + annualReturn, yearsToRetirement);

  return {
    leanFIRE: leanExpenses * 25,
    coastFIRE: coastFIRE,
    regularFIRE: regularFIRE,
    fatFIRE: fatExpenses * 25,
  };
};

/**
 * Project future net worth using compound interest
 * Returns array of projected values for each year
 */
export const projectFutureNetWorth = (
  currentNetWorth: number,
  monthlyContribution: number,
  years: number = 30,
  annualReturn: number = 0.07
): { year: number; value: number }[] => {
  const projections: { year: number; value: number }[] = [];
  let balance = currentNetWorth;
  const monthlyRate = annualReturn / 12;

  projections.push({ year: 0, value: balance });

  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    projections.push({ year, value: Math.round(balance) });
  }

  return projections;
};

/**
 * Calculate average monthly expenses from entries
 */
export const calculateAverageMonthlyExpenses = (
  entries: MonthlyEntry[]
): number => {
  if (entries.length === 0) return 0;
  const totalExpenses = entries.reduce((sum, entry) => sum + entry.expenses, 0);
  return totalExpenses / entries.length;
};

/**
 * Calculate average monthly income from entries
 */
export const calculateAverageMonthlyIncome = (
  entries: MonthlyEntry[]
): number => {
  if (entries.length === 0) return 0;
  const totalIncome = entries.reduce((sum, entry) => sum + entry.income, 0);
  return totalIncome / entries.length;
};

/**
 * Calculate average savings rate from entries
 */
export const calculateAverageSavingsRate = (
  entries: MonthlyEntry[]
): number => {
  if (entries.length === 0) return 0;
  const avgIncome = calculateAverageMonthlyIncome(entries);
  const avgExpenses = calculateAverageMonthlyExpenses(entries);
  return calculateSavingsRate(avgIncome, avgExpenses);
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format number as currency using Intl.NumberFormat
 */
export const formatCurrency = (
  value: number,
  locale: string = "en-US",
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};
