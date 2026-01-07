"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  useAppStore,
  useAverageMonthlyIncome,
  useAverageMonthlyExpenses,
  useAverageSavingsRate,
} from "@/lib/store";
import {
  formatCurrency,
  formatPercentage,
  calculateSavingsRate,
  MonthlyEntry,
} from "@/lib/finances";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Trash2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

const AddEntrySheet = () => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(getCurrentMonth());
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const addMonthlyEntry = useAppStore((state) => state.addMonthlyEntry);
  const monthlyEntries = useAppStore((state) => state.monthlyEntries);

  const existingEntry = monthlyEntries.find((e) => e.month === month);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!income || !expenses) return;

    addMonthlyEntry({
      month,
      income: parseFloat(income),
      expenses: parseFloat(expenses),
    });

    setMonth(getCurrentMonth());
    setIncome("");
    setExpenses("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="min-h-11 w-full">
          <Plus className="h-4 w-4 mr-2" />
          Log Month
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[90vh]">
        <SheetHeader>
          <SheetTitle>Log Monthly Cash Flow</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-8">
          <div className="space-y-2">
            <Label htmlFor="entry-month">Month</Label>
            <Input
              id="entry-month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="min-h-11"
            />
            {existingEntry && (
              <p className="text-xs text-warning">
                Entry exists for this month. Adding will create a duplicate.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-income">
              <span className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-success" />
                Total Income
              </span>
            </Label>
            <Input
              id="entry-income"
              type="number"
              placeholder="0"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="min-h-11 text-lg"
              inputMode="decimal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-expenses">
              <span className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-destructive" />
                Total Expenses
              </span>
            </Label>
            <Input
              id="entry-expenses"
              type="number"
              placeholder="0"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="min-h-11 text-lg"
              inputMode="decimal"
            />
          </div>

          {income && expenses && (
            <Card className="bg-secondary/30">
              <CardContent className="py-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Savings Rate
                  </span>
                  <span className="font-semibold">
                    {formatPercentage(
                      calculateSavingsRate(
                        parseFloat(income) || 0,
                        parseFloat(expenses) || 0
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    Monthly Savings
                  </span>
                  <span className="font-semibold text-success">
                    {formatCurrency(
                      (parseFloat(income) || 0) - (parseFloat(expenses) || 0)
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            type="submit"
            className="w-full min-h-11"
            disabled={!income || !expenses}
          >
            Save Entry
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const EditEntrySheet = ({
  entry,
  onClose,
}: {
  entry: MonthlyEntry;
  onClose: () => void;
}) => {
  const [income, setIncome] = useState(entry.income.toString());
  const [expenses, setExpenses] = useState(entry.expenses.toString());
  const updateMonthlyEntry = useAppStore((state) => state.updateMonthlyEntry);
  const deleteMonthlyEntry = useAppStore((state) => state.deleteMonthlyEntry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!income || !expenses) return;

    updateMonthlyEntry(entry.id, {
      income: parseFloat(income),
      expenses: parseFloat(expenses),
    });
    onClose();
  };

  const handleDelete = () => {
    deleteMonthlyEntry(entry.id);
    onClose();
  };

  return (
    <SheetContent side="bottom" className="h-auto max-h-[90vh]">
      <SheetHeader>
        <SheetTitle>Edit {formatMonth(entry.month)}</SheetTitle>
      </SheetHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-8">
        <div className="space-y-2">
          <Label htmlFor="edit-income">Total Income</Label>
          <Input
            id="edit-income"
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="min-h-11 text-lg"
            inputMode="decimal"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-expenses">Total Expenses</Label>
          <Input
            id="edit-expenses"
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            className="min-h-11 text-lg"
            inputMode="decimal"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            className="min-h-11"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            className="flex-1 min-h-11"
            disabled={!income || !expenses}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </SheetContent>
  );
};

const EntryItem = ({ entry }: { entry: MonthlyEntry }) => {
  const [editing, setEditing] = useState(false);
  const savingsRate = calculateSavingsRate(entry.income, entry.expenses);
  const savings = entry.income - entry.expenses;

  const getSavingsColor = (rate: number) => {
    if (rate >= 50) return "bg-success/20 text-success";
    if (rate >= 25) return "bg-chart-3/20 text-chart-3";
    if (rate >= 10) return "bg-warning/20 text-warning";
    return "bg-destructive/20 text-destructive";
  };

  return (
    <>
      <div
        className="py-3 px-4 rounded-lg bg-secondary/30 press-effect cursor-pointer"
        onClick={() => setEditing(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatMonth(entry.month)}</span>
          </div>
          <Badge className={getSavingsColor(savingsRate)}>
            {formatPercentage(savingsRate, 0)} saved
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Income</p>
            <p className="font-medium text-success">
              {formatCurrency(entry.income)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Expenses</p>
            <p className="font-medium text-destructive">
              {formatCurrency(entry.expenses)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Saved</p>
            <p className={`font-medium ${savings >= 0 ? "text-success" : "text-destructive"}`}>
              {formatCurrency(savings)}
            </p>
          </div>
        </div>
      </div>
      <Sheet open={editing} onOpenChange={setEditing}>
        {editing && (
          <EditEntrySheet entry={entry} onClose={() => setEditing(false)} />
        )}
      </Sheet>
    </>
  );
};

const SavingsChart = ({ entries }: { entries: MonthlyEntry[] }) => {
  const chartData = useMemo(() => {
    return [...entries]
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((entry) => ({
        month: formatMonth(entry.month),
        income: entry.income,
        expenses: entry.expenses,
        savings: entry.income - entry.expenses,
      }));
  }, [entries]);

  if (chartData.length < 2) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Cash Flow Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="hsl(var(--success))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CashFlowPage() {
  const monthlyEntries = useAppStore((state) => state.monthlyEntries);
  const avgIncome = useAverageMonthlyIncome();
  const avgExpenses = useAverageMonthlyExpenses();
  const avgSavingsRate = useAverageSavingsRate();

  const sortedEntries = useMemo(() => {
    return [...monthlyEntries].sort((a, b) => b.month.localeCompare(a.month));
  }, [monthlyEntries]);

  return (
    <div className="px-4 py-6 space-y-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Cash Flow</h1>
        <p className="text-muted-foreground text-sm">
          Track your income and expenses
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="press-effect">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center">
              <TrendingUp className="h-5 w-5 text-success mb-1" />
              <p className="text-xs text-muted-foreground">Avg Income</p>
              <p className="font-semibold text-sm">{formatCurrency(avgIncome)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="press-effect">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center">
              <TrendingDown className="h-5 w-5 text-destructive mb-1" />
              <p className="text-xs text-muted-foreground">Avg Expenses</p>
              <p className="font-semibold text-sm">
                {formatCurrency(avgExpenses)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="press-effect">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center">
              <PiggyBank className="h-5 w-5 text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Savings Rate</p>
              <p className="font-semibold text-sm">
                {formatPercentage(avgSavingsRate, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddEntrySheet />

      <SavingsChart entries={monthlyEntries} />

      {/* Monthly Entries List */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Monthly History</h2>
        {sortedEntries.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No entries yet</p>
              <p className="text-sm text-muted-foreground">
                Log your first month to start tracking
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedEntries.map((entry) => (
            <EntryItem key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
