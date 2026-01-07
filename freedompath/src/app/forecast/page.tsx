"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  useNetWorth,
  useAppStore,
  useAverageMonthlyIncome,
  useAverageMonthlyExpenses,
  useFIRENumber,
} from "@/lib/store";
import {
  formatCurrency,
  formatPercentage,
  projectFutureNetWorth,
  calculateYearsToFIRE,
} from "@/lib/finances";
import {
  LineChart,
  TrendingUp,
  Target,
  Settings2,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

const ForecastChart = ({
  projections,
  fireNumber,
}: {
  projections: { year: number; value: number }[];
  fireNumber: number;
}) => {
  const fireYear = projections.find((p) => p.value >= fireNumber)?.year;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={projections}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="year"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickFormatter={(value) => `Yr ${value}`}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickFormatter={(value) =>
              value >= 1000000
                ? `$${(value / 1000000).toFixed(1)}M`
                : `$${(value / 1000).toFixed(0)}k`
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value) => [formatCurrency(value as number), "Net Worth"]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <ReferenceLine
            y={fireNumber}
            stroke="hsl(var(--success))"
            strokeDasharray="5 5"
            label={{
              value: "FIRE Goal",
              position: "right",
              fill: "hsl(var(--success))",
              fontSize: 12,
            }}
          />
          {fireYear && (
            <ReferenceLine
              x={fireYear}
              stroke="hsl(var(--success))"
              strokeDasharray="5 5"
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const ScenarioCard = ({
  title,
  description,
  yearsToFire,
  projectedValue,
  isActive,
  onClick,
}: {
  title: string;
  description: string;
  yearsToFire: number;
  projectedValue: number;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Card
      className={`press-effect cursor-pointer ${
        isActive ? "border-primary bg-primary/5" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {isActive && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </div>
        <Separator className="my-2" />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Years to FIRE</p>
            <p className="font-bold text-primary">
              {yearsToFire === Infinity ? "∞" : yearsToFire.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">30yr projection</p>
            <p className="font-bold text-success">
              {formatCurrency(projectedValue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ForecastPage() {
  const netWorth = useNetWorth();
  const avgIncome = useAverageMonthlyIncome();
  const avgExpenses = useAverageMonthlyExpenses();
  const fireNumber = useFIRENumber();
  const settings = useAppStore((state) => state.settings);

  const [customReturn, setCustomReturn] = useState(
    (settings.expectedReturn * 100).toString()
  );
  const [customContribution, setCustomContribution] = useState(
    (avgIncome - avgExpenses).toString()
  );
  const [showSettings, setShowSettings] = useState(false);

  const monthlyContribution = parseFloat(customContribution) || 0;
  const annualReturn = (parseFloat(customReturn) || 7) / 100;

  const projections = useMemo(() => {
    return projectFutureNetWorth(
      netWorth,
      monthlyContribution,
      30,
      annualReturn
    );
  }, [netWorth, monthlyContribution, annualReturn]);

  const yearsToFire = useMemo(() => {
    return calculateYearsToFIRE(
      netWorth,
      monthlyContribution,
      fireNumber,
      annualReturn
    );
  }, [netWorth, monthlyContribution, fireNumber, annualReturn]);

  // Scenario calculations
  const scenarios = useMemo(() => {
    const currentSavings = avgIncome - avgExpenses;

    // Conservative scenario: 5% return
    const conservativeYears = calculateYearsToFIRE(
      netWorth,
      currentSavings,
      fireNumber,
      0.05
    );
    const conservativeProjection = projectFutureNetWorth(
      netWorth,
      currentSavings,
      30,
      0.05
    );

    // Moderate scenario: 7% return (default)
    const moderateYears = calculateYearsToFIRE(
      netWorth,
      currentSavings,
      fireNumber,
      0.07
    );
    const moderateProjection = projectFutureNetWorth(
      netWorth,
      currentSavings,
      30,
      0.07
    );

    // Aggressive scenario: 10% return
    const aggressiveYears = calculateYearsToFIRE(
      netWorth,
      currentSavings,
      fireNumber,
      0.1
    );
    const aggressiveProjection = projectFutureNetWorth(
      netWorth,
      currentSavings,
      30,
      0.1
    );

    // Boost savings scenario: +$500/mo
    const boostYears = calculateYearsToFIRE(
      netWorth,
      currentSavings + 500,
      fireNumber,
      0.07
    );
    const boostProjection = projectFutureNetWorth(
      netWorth,
      currentSavings + 500,
      30,
      0.07
    );

    return {
      conservative: {
        years: conservativeYears,
        projection: conservativeProjection[30]?.value || 0,
      },
      moderate: {
        years: moderateYears,
        projection: moderateProjection[30]?.value || 0,
      },
      aggressive: {
        years: aggressiveYears,
        projection: aggressiveProjection[30]?.value || 0,
      },
      boost: {
        years: boostYears,
        projection: boostProjection[30]?.value || 0,
      },
    };
  }, [netWorth, avgIncome, avgExpenses, fireNumber]);

  const finalProjection = projections[projections.length - 1]?.value || 0;

  return (
    <div className="px-4 py-6 space-y-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Forecast</h1>
        <p className="text-muted-foreground text-sm">
          Project your path to financial freedom
        </p>
      </header>

      {/* Main Projection Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LineChart className="h-5 w-5 text-primary" />
              Compound Growth Projection
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="min-h-9"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSettings && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="custom-return" className="text-xs">
                  Annual Return (%)
                </Label>
                <Input
                  id="custom-return"
                  type="number"
                  value={customReturn}
                  onChange={(e) => setCustomReturn(e.target.value)}
                  className="min-h-10"
                  inputMode="decimal"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="custom-contribution" className="text-xs">
                  Monthly Contribution
                </Label>
                <Input
                  id="custom-contribution"
                  type="number"
                  value={customContribution}
                  onChange={(e) => setCustomContribution(e.target.value)}
                  className="min-h-10"
                  inputMode="decimal"
                />
              </div>
            </div>
          )}

          <ForecastChart projections={projections} fireNumber={fireNumber} />

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <Calendar className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold">
                {yearsToFire === Infinity ? "∞" : yearsToFire.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">years to FIRE</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <Sparkles className="h-5 w-5 mx-auto text-success mb-1" />
              <p className="text-2xl font-bold text-success">
                {formatCurrency(finalProjection)}
              </p>
              <p className="text-xs text-muted-foreground">in 30 years</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Parameters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-chart-2" />
            Current Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Starting Net Worth</p>
              <p className="font-semibold">{formatCurrency(netWorth)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">FIRE Target</p>
              <p className="font-semibold">{formatCurrency(fireNumber)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly Contribution</p>
              <p className="font-semibold">
                {formatCurrency(monthlyContribution)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Expected Return</p>
              <p className="font-semibold">{formatPercentage(annualReturn * 100)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Comparisons */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-chart-4" />
          What-If Scenarios
        </h2>

        <ScenarioCard
          title="Conservative"
          description="5% annual return"
          yearsToFire={scenarios.conservative.years}
          projectedValue={scenarios.conservative.projection}
        />

        <ScenarioCard
          title="Moderate"
          description="7% annual return"
          yearsToFire={scenarios.moderate.years}
          projectedValue={scenarios.moderate.projection}
          isActive
        />

        <ScenarioCard
          title="Aggressive"
          description="10% annual return"
          yearsToFire={scenarios.aggressive.years}
          projectedValue={scenarios.aggressive.projection}
        />

        <ScenarioCard
          title="Boost Savings"
          description="+$500/mo contribution"
          yearsToFire={scenarios.boost.years}
          projectedValue={scenarios.boost.projection}
        />
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Projected Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[100000, 250000, 500000, 1000000].map((milestone) => {
            const yearReached = projections.find((p) => p.value >= milestone);
            const reached = netWorth >= milestone;

            return (
              <div
                key={milestone}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  {reached ? (
                    <Badge className="bg-success/20 text-success">✓</Badge>
                  ) : (
                    <Badge variant="outline">
                      {yearReached ? `Yr ${yearReached.year}` : "30+"}
                    </Badge>
                  )}
                  <span className="font-medium">{formatCurrency(milestone)}</span>
                </div>
                {reached && (
                  <span className="text-sm text-success">Achieved!</span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
