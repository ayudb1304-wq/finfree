'use client';

import { format, differenceInMonths, differenceInDays } from 'date-fns';
import {
  Target,
  TrendingDown,
  Shield,
  MapPin,
  Heart,
  Calendar,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinFreeStore, useCurrentPhase } from '@/lib/store';
import { formatCurrency, FINANCIAL_PHASES, OD_PAYOFF_SCHEDULE, INITIAL_OD_BALANCE } from '@/lib/constants';
import { calculateTimeToGoal } from '@/lib/finances';

const goalIcons: Record<string, React.ElementType> = {
  'od-payoff': TrendingDown,
  'emergency-fund': Shield,
  'land-fund': MapPin,
  'wedding-fund': Heart,
};

const goalColors: Record<string, { bg: string; text: string; progress: string }> = {
  'od-payoff': {
    bg: 'from-orange-600/20 via-red-600/10 to-pink-600/20',
    text: 'text-orange-400',
    progress: 'bg-gradient-to-r from-orange-500 to-red-500',
  },
  'emergency-fund': {
    bg: 'from-blue-600/20 via-cyan-600/10 to-teal-600/20',
    text: 'text-blue-400',
    progress: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },
  'land-fund': {
    bg: 'from-green-600/20 via-emerald-600/10 to-teal-600/20',
    text: 'text-green-400',
    progress: 'bg-gradient-to-r from-green-500 to-emerald-500',
  },
  'wedding-fund': {
    bg: 'from-pink-600/20 via-rose-600/10 to-red-600/20',
    text: 'text-pink-400',
    progress: 'bg-gradient-to-r from-pink-500 to-rose-500',
  },
};

export default function GoalsPage() {
  const { goals, currentODBalance, emergencyFund, landFund, weddingFund } = useFinFreeStore();
  const currentPhase = useCurrentPhase();
  const phase = FINANCIAL_PHASES[currentPhase - 1];

  // Get actual current amounts for each goal
  const getGoalCurrentAmount = (goalId: string): number => {
    switch (goalId) {
      case 'od-payoff':
        return INITIAL_OD_BALANCE - currentODBalance;
      case 'emergency-fund':
        return emergencyFund;
      case 'land-fund':
        return landFund;
      case 'wedding-fund':
        return weddingFund;
      default:
        return 0;
    }
  };

  const getTimeRemaining = (targetDate: string): string => {
    const target = new Date(targetDate);
    const now = new Date();
    const months = differenceInMonths(target, now);
    const days = differenceInDays(target, now) % 30;

    if (months <= 0 && days <= 0) return 'Overdue';
    if (months === 0) return `${days} days`;
    return `${months}mo ${days}d`;
  };

  const isGoalActive = (goalId: string): boolean => {
    if (goalId === 'od-payoff') return currentPhase === 1;
    if (goalId === 'emergency-fund') return currentPhase === 2;
    return currentPhase === 3;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Goals" />

      <div className="px-4 py-4 max-w-md mx-auto space-y-6">
        {/* Current Phase Banner */}
        <Card className="border-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Current Focus</p>
                <p className="font-semibold text-violet-400">{phase?.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{phase?.goal}</p>
              </div>
              <Badge variant="secondary" className="bg-violet-500/20 text-violet-400">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Goals List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Your Financial Goals</h2>

          {goals.map((goal) => {
            const Icon = goalIcons[goal.id] || Target;
            const colors = goalColors[goal.id] || goalColors['od-payoff'];
            const currentAmount = getGoalCurrentAmount(goal.id);
            const progress = Math.min(100, (currentAmount / goal.targetAmount) * 100);
            const isActive = isGoalActive(goal.id);
            const isComplete = currentAmount >= goal.targetAmount;
            const timeRemaining = getTimeRemaining(goal.targetDate);
            const monthsToGoal = calculateTimeToGoal(
              currentAmount,
              goal.targetAmount,
              goal.monthlyContribution,
              0
            );

            return (
              <Card
                key={goal.id}
                className={`border-0 bg-gradient-to-br ${colors.bg} ${
                  !isActive && !isComplete ? 'opacity-60' : ''
                }`}
              >
                <CardHeader className="pb-2 px-4 pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-background/50 flex items-center justify-center ${colors.text}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">{goal.name}</CardTitle>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(goal.targetDate), 'MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    {isComplete ? (
                      <Badge className="bg-green-500/20 text-green-400">Complete</Badge>
                    ) : isActive ? (
                      <Badge variant="secondary" className={`${colors.text} bg-background/50`}>
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className={colors.text + ' font-semibold'}>
                        {formatCurrency(currentAmount)}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="relative h-2.5 bg-background/50 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${colors.progress} ${
                          isComplete ? '' : 'progress-shine'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progress.toFixed(1)}% complete</span>
                      <span>{formatCurrency(goal.targetAmount - currentAmount)} to go</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-background/50 text-center">
                      <p className="text-xs text-muted-foreground">Monthly</p>
                      <p className="text-sm font-semibold">
                        {formatCurrency(goal.monthlyContribution)}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 text-center">
                      <p className="text-xs text-muted-foreground">Time Left</p>
                      <p className="text-sm font-semibold">{timeRemaining}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 text-center">
                      <p className="text-xs text-muted-foreground">ETA</p>
                      <p className="text-sm font-semibold">
                        {monthsToGoal === Infinity ? '∞' : `${monthsToGoal}mo`}
                      </p>
                    </div>
                  </div>

                  {/* OD Specific: Show schedule */}
                  {goal.id === 'od-payoff' && isActive && !isComplete && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">Payoff Schedule</p>
                      <div className="flex gap-1 overflow-x-auto pb-1 hide-scrollbar">
                        {OD_PAYOFF_SCHEDULE.map((schedule) => {
                          const isPast = schedule.endBalance === 0 
                            ? currentODBalance <= 0
                            : currentODBalance <= schedule.endBalance;
                          
                          return (
                            <div
                              key={schedule.month}
                              className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-center ${
                                isPast
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-background/50 text-muted-foreground'
                              }`}
                            >
                              <p className="text-[10px]">
                                {format(new Date(schedule.month + '-01'), 'MMM')}
                              </p>
                              <p className="text-xs font-semibold">
                                {schedule.endBalance === 0 ? '₹0' : `₹${(schedule.endBalance / 1000).toFixed(0)}K`}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Phases Timeline */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Your Journey</h2>
          <Card className="border-0 bg-card">
            <CardContent className="p-4 space-y-4">
              {FINANCIAL_PHASES.map((phaseItem, index) => {
                const isCurrentPhase = currentPhase === phaseItem.id;
                const isPastPhase = currentPhase > phaseItem.id;

                return (
                  <div key={phaseItem.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isPastPhase
                            ? 'bg-green-500/20 text-green-400'
                            : isCurrentPhase
                            ? 'bg-violet-500/20 text-violet-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isPastPhase ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{phaseItem.id}</span>
                        )}
                      </div>
                      {index < FINANCIAL_PHASES.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-1 ${
                            isPastPhase ? 'bg-green-500/50' : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-medium ${
                            isCurrentPhase ? 'text-violet-400' : isPastPhase ? 'text-green-400' : ''
                          }`}
                        >
                          {phaseItem.name}
                        </p>
                        {isCurrentPhase && (
                          <ChevronRight className="w-4 h-4 text-violet-400" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{phaseItem.goal}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(phaseItem.startMonth + '-01'), 'MMM yyyy')} -{' '}
                        {format(new Date(phaseItem.endMonth + '-01'), 'MMM yyyy')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
