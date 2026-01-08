'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Settings,
  Wallet,
  TrendingDown,
  PiggyBank,
  MapPin,
  Heart,
  RefreshCw,
  AlertTriangle,
  Check,
  Download,
  Upload,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useFinFreeStore, useHydration, useTotalMonthlyEMI } from '@/lib/store';
import { formatCurrency, INITIAL_OD_BALANCE } from '@/lib/constants';

export default function SettingsPage() {
  const hydrated = useHydration();
  const totalMonthlyEMI = useTotalMonthlyEMI();
  const {
    currentODBalance,
    emergencyFund,
    landFund,
    weddingFund,
    lifestyleCap,
    targetODPayment,
    emis,
    transactions,
    updateODBalance,
    updateEmergencyFund,
    updateLandFund,
    updateWeddingFund,
    updateLifestyleCap,
    resetToDefaults,
  } = useFinFreeStore();

  const [editValues, setEditValues] = useState({
    odBalance: currentODBalance.toString(),
    emergencyFund: emergencyFund.toString(),
    landFund: landFund.toString(),
    weddingFund: weddingFund.toString(),
    lifestyleCap: lifestyleCap.toString(),
  });
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Show loading state while hydrating
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Settings" showScore={false} />
        <div className="px-4 py-4 max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const handleSave = (field: keyof typeof editValues) => {
    const value = parseFloat(editValues[field]);
    if (isNaN(value) || value < 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    switch (field) {
      case 'odBalance':
        updateODBalance(value);
        toast.success('OD Balance updated');
        break;
      case 'emergencyFund':
        updateEmergencyFund(value);
        toast.success('Emergency Fund updated');
        break;
      case 'landFund':
        updateLandFund(value);
        toast.success('Land Fund updated');
        break;
      case 'weddingFund':
        updateWeddingFund(value);
        toast.success('Wedding Fund updated');
        break;
      case 'lifestyleCap':
        updateLifestyleCap(value);
        toast.success('Lifestyle Cap updated');
        break;
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetDialog(false);
    setEditValues({
      odBalance: INITIAL_OD_BALANCE.toString(),
      emergencyFund: '0',
      landFund: '0',
      weddingFund: '0',
      lifestyleCap: '45000',
    });
    toast.success('All data reset to defaults');
  };

  const handleExport = () => {
    const data = {
      currentODBalance,
      emergencyFund,
      landFund,
      weddingFund,
      lifestyleCap,
      emis,
      transactions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finfree-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully', {
      description: `${transactions.length} transactions and ${emis.length} EMIs exported`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" showScore={false} />

      <div className="px-4 py-4 max-w-md mx-auto space-y-6">
        {/* Current Balances */}
        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              Current Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OD Balance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-orange-400" />
                  OD Balance (Liability)
                </Label>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={editValues.odBalance}
                    onChange={(e) =>
                      setEditValues({ ...editValues, odBalance: e.target.value })
                    }
                    className="pl-7 bg-background"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSave('odBalance')}
                  className="px-3"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {formatCurrency(currentODBalance)}
              </p>
            </div>

            <Separator />

            {/* Emergency Fund */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <PiggyBank className="w-4 h-4 text-blue-400" />
                Emergency Fund
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={editValues.emergencyFund}
                    onChange={(e) =>
                      setEditValues({ ...editValues, emergencyFund: e.target.value })
                    }
                    className="pl-7 bg-background"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSave('emergencyFund')}
                  className="px-3"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Land Fund */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-green-400" />
                Land Fund (Bangalore)
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={editValues.landFund}
                    onChange={(e) =>
                      setEditValues({ ...editValues, landFund: e.target.value })
                    }
                    className="pl-7 bg-background"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSave('landFund')}
                  className="px-3"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Wedding Fund */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-pink-400" />
                Wedding Fund
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={editValues.weddingFund}
                    onChange={(e) =>
                      setEditValues({ ...editValues, weddingFund: e.target.value })
                    }
                    className="pl-7 bg-background"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSave('weddingFund')}
                  className="px-3"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Settings */}
        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-400" />
              Budget Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Monthly Lifestyle Cap</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={editValues.lifestyleCap}
                    onChange={(e) =>
                      setEditValues({ ...editValues, lifestyleCap: e.target.value })
                    }
                    className="pl-7 bg-background"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSave('lifestyleCap')}
                  className="px-3"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: ₹45,000/month
              </p>
            </div>

            <Separator />

            {/* Read-only values */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Income</span>
                <span className="font-semibold">{formatCurrency(109000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Target OD Payment</span>
                <span className="font-semibold">{formatCurrency(targetODPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active EMIs</span>
                <span className="font-semibold">{emis.filter(e => e.paidInstallments < e.totalInstallments).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Monthly EMI</span>
                <span className="font-semibold">{formatCurrency(totalMonthlyEMI)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>

            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-red-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset All Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Reset All Data?
                  </DialogTitle>
                  <DialogDescription>
                    This will reset all your financial data to the initial values from your
                    recovery plan. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2 text-sm">
                  <p className="font-medium">The following will be reset:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>OD Balance → ₹2,48,989</li>
                    <li>Emergency Fund → ₹0</li>
                    <li>Land Fund → ₹0</li>
                    <li>Wedding Fund → ₹0</li>
                    <li>All {transactions.length} transactions will be deleted</li>
                    <li>All {emis.length} EMIs will be reset to defaults</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReset}>
                    Reset Everything
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-0 bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-lg font-bold text-primary">FinFree</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your Financial Freedom Journey
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Based on your Financial Recovery Plan 2026-2027
            </p>
            <p className="text-xs text-muted-foreground mt-1">Version 1.0.0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
