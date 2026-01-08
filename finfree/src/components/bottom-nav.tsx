'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, PlusCircle, Target, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/add', icon: PlusCircle, label: 'Add', isMain: true },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center -mt-6"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-h-11 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
