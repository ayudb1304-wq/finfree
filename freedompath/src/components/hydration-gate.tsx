"use client";

import { useIsHydrated } from "@/lib/store";
import { Loader2 } from "lucide-react";

interface HydrationGateProps {
  children: React.ReactNode;
}

export const HydrationGate = ({ children }: HydrationGateProps) => {
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your data...</p>
      </div>
    );
  }

  return <>{children}</>;
};
