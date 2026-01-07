"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  useNetWorth,
  useFreedomScore,
  useFIRENumber,
  useYearsToFIRE,
  useFIRETargets,
  useAverageSavingsRate,
  useInvestedAssets,
  useAverageMonthlyExpenses,
  useAppStore,
} from "@/lib/store";
import {
  formatCurrency,
  formatPercentage,
  calculateMonthlyPassiveIncome,
} from "@/lib/finances";
import { TrendingUp, Target, Calendar, Flame, Sparkles, DollarSign } from "lucide-react";

const FreedomScoreCard = () => {
  const freedomScore = useFreedomScore();
  const investedAssets = useInvestedAssets();
  const avgExpenses = useAverageMonthlyExpenses();
  const settings = useAppStore((state) => state.settings);
  const passiveIncome = calculateMonthlyPassiveIncome(
    investedAssets,
    settings.withdrawalRate
  );

  const getScoreColor = (score: number) => {
    if (score >= 100) return "text-success";
    if (score >= 75) return "text-chart-2";
    if (score >= 50) return "text-chart-3";
    if (score >= 25) return "text-warning";
    return "text-muted-foreground";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 100) return "Financially Free! 🎉";
    if (score >= 75) return "Almost There!";
    if (score >= 50) return "Halfway Home";
    if (score >= 25) return "Building Momentum";
    return "Just Getting Started";
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Freedom Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-4">
          <div className={`text-6xl font-bold ${getScoreColor(freedomScore)}`}>
            {formatPercentage(freedomScore, 0)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {getScoreLabel(freedomScore)}
          </p>
        </div>
        <Progress value={Math.min(freedomScore, 100)} className="h-3 mb-4" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Passive Income</span>
            <span className="font-semibold text-success">
              {formatCurrency(passiveIncome)}/mo
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Monthly Expenses</span>
            <span className="font-semibold">
              {formatCurrency(avgExpenses)}/mo
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NetWorthCard = () => {
  const netWorth = useNetWorth();

  return (
    <Card className="press-effect">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-4 w-4 text-chart-1" />
          Net Worth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
      </CardContent>
    </Card>
  );
};

const YearsToFIRECard = () => {
  const yearsToFIRE = useYearsToFIRE();

  const displayYears = yearsToFIRE === Infinity ? "∞" : yearsToFIRE.toFixed(1);
  const subtitle =
    yearsToFIRE === Infinity
      ? "Add income & expense data"
      : yearsToFIRE === 0
      ? "You're there!"
      : "years to freedom";

  return (
    <Card className="press-effect">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-chart-2" />
          Time to FIRE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayYears}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

const SavingsRateCard = () => {
  const savingsRate = useAverageSavingsRate();

  const getColor = (rate: number) => {
    if (rate >= 50) return "text-success";
    if (rate >= 25) return "text-chart-3";
    if (rate >= 10) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="press-effect">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-chart-3" />
          Savings Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getColor(savingsRate)}`}>
          {formatPercentage(savingsRate, 0)}
        </div>
      </CardContent>
    </Card>
  );
};

const FIREMilestonesCard = () => {
  const netWorth = useNetWorth();
  const fireTargets = useFIRETargets();
  const fireNumber = useFIRENumber();

  const milestones = [
    {
      name: "Coast FIRE",
      target: fireTargets.coastFIRE,
      description: "Let compound interest do the rest",
    },
    {
      name: "Lean FIRE",
      target: fireTargets.leanFIRE,
      description: "Basic expenses covered",
    },
    {
      name: "FIRE",
      target: fireNumber,
      description: "Full financial independence",
    },
    {
      name: "Fat FIRE",
      target: fireTargets.fatFIRE,
      description: "Comfortable lifestyle",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-chart-4" />
          FIRE Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.map((milestone) => {
          const progress = Math.min(100, (netWorth / milestone.target) * 100);
          const isAchieved = netWorth >= milestone.target;

          return (
            <div key={milestone.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{milestone.name}</span>
                  {isAchieved && (
                    <Badge variant="secondary" className="text-xs bg-success/20 text-success">
                      ✓ Achieved
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(milestone.target)}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {milestone.description}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const QuickTipCard = () => {
  const savingsRate = useAverageSavingsRate();
  const yearsToFIRE = useYearsToFIRE();

  const getTip = () => {
    if (savingsRate === 0) {
      return "Start by logging your monthly income and expenses to see your savings rate.";
    }
    if (savingsRate < 20) {
      return "Try to increase your savings rate to at least 20% to accelerate your FIRE journey.";
    }
    if (savingsRate < 50) {
      return "Great progress! Pushing your savings rate above 50% could cut years off your timeline.";
    }
    if (yearsToFIRE <= 10) {
      return "You're in the home stretch! Stay consistent and keep your expenses in check.";
    }
    return "Excellent savings rate! Consider optimizing your investment allocation.";
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Flame className="h-4 w-4 text-primary" />
          Quick Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{getTip()}</p>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 space-y-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">FreedomPath</h1>
        <p className="text-muted-foreground text-sm">Your journey to financial independence</p>
      </header>

      <FreedomScoreCard />

      <div className="grid grid-cols-2 gap-3">
        <NetWorthCard />
        <YearsToFIRECard />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SavingsRateCard />
        <Card className="press-effect">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-chart-5" />
              FIRE Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(useFIRENumber())}
            </div>
            <p className="text-xs text-muted-foreground">25x expenses</p>
          </CardContent>
        </Card>
      </div>

      <FIREMilestonesCard />
      <QuickTipCard />
    </div>
  );
}
