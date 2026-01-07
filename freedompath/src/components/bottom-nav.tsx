"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, TrendingUp, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/net-worth", label: "Net Worth", icon: Wallet },
  { href: "/cash-flow", label: "Cash Flow", icon: TrendingUp },
  { href: "/forecast", label: "Forecast", icon: LineChart },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center min-h-11 min-w-16 px-3 py-2 rounded-lg transition-colors",
                "active:scale-95 active:bg-accent",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              <span className={cn("text-xs mt-1", isActive && "font-medium")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
