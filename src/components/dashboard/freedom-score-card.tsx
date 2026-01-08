'use client';

import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFreedomScore, useCurrentPhase, useHydration } from '@/lib/store';
import { FINANCIAL_PHASES } from '@/lib/constants';

export const FreedomScoreCard = () => {
  const hydrated = useHydration();
  const freedomScore = useFreedomScore();
  const currentPhase = useCurrentPhase();
  const phase = FINANCIAL_PHASES[currentPhase - 1];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!hydrated) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20">
        <CardContent className="p-5">
          <div className="animate-pulse space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-20 bg-muted rounded" />
              </div>
              <div className="h-10 w-10 bg-muted rounded-full" />
            </div>
            <div className="h-2 bg-muted rounded-full" />
            <div className="h-4 w-48 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Freedom Score</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-4xl font-bold ${getScoreColor(freedomScore)}`}>
                {freedomScore}
              </span>
              <span className="text-xl text-muted-foreground">%</span>
            </div>
          </div>
          <div className="p-2.5 rounded-full bg-violet-500/20">
            <Trophy className="w-5 h-5 text-violet-400" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{freedomScore}/100</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 progress-shine ${getProgressColor(freedomScore)}`}
              style={{ width: `${freedomScore}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{phase?.name}</span>
              {' • '}
              {phase?.goal}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
