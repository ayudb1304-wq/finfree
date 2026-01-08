'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFreedomScore } from '@/lib/store';
import { formatMonth, getCurrentMonth } from '@/lib/finances';

interface HeaderProps {
  title?: string;
  showScore?: boolean;
}

export const Header = ({ title, showScore = true }: HeaderProps) => {
  const freedomScore = useFreedomScore();
  const currentMonth = formatMonth(getCurrentMonth());

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-foreground">
            {title || 'FinFree'}
          </h1>
          {!title && (
            <span className="text-xs text-muted-foreground">{currentMonth}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showScore && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
              <span className="text-xs font-medium">Freedom</span>
              <span className="text-sm font-bold">{freedomScore}%</span>
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
