import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <WifiOff className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">You&apos;re Offline</h1>
      <p className="text-muted-foreground mb-6">
        Please check your internet connection and try again.
      </p>
      <p className="text-sm text-muted-foreground">
        Your data is safely stored locally and will sync when you&apos;re back online.
      </p>
    </div>
  );
}
