'use client';

import { useState } from 'react';
import { format, addMonths } from 'date-fns';
import { toast } from 'sonner';
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  Calendar,
  IndianRupee,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useFinFreeStore, useHydration, useTotalMonthlyEMI } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';
import type { EMI } from '@/lib/types';

export default function EMIsPage() {
  const hydrated = useHydration();
  const { emis, addEMI, updateEMI, deleteEMI, recordEMIPayment } = useFinFreeStore();
  const totalMonthlyEMI = useTotalMonthlyEMI();
  
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [emiToDelete, setEmiToDelete] = useState<EMI | null>(null);
  const [newEMI, setNewEMI] = useState({
    name: '',
    amount: '',
    totalInstallments: '',
    paidInstallments: '0',
    description: '',
  });

  const handleAddEMI = () => {
    if (!newEMI.name || !newEMI.amount || !newEMI.totalInstallments) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(newEMI.amount);
    const totalInstallments = parseInt(newEMI.totalInstallments);
    const paidInstallments = parseInt(newEMI.paidInstallments) || 0;

    if (amount <= 0 || totalInstallments <= 0) {
      toast.error('Please enter valid positive numbers');
      return;
    }

    if (paidInstallments > totalInstallments) {
      toast.error('Paid installments cannot exceed total installments');
      return;
    }

    const startDate = new Date().toISOString().split('T')[0];
    const remainingMonths = totalInstallments - paidInstallments;
    const endDate = addMonths(new Date(), remainingMonths).toISOString().split('T')[0];

    addEMI({
      name: newEMI.name,
      amount,
      totalInstallments,
      paidInstallments,
      startDate,
      endDate,
      description: newEMI.description || undefined,
    });

    toast.success('EMI added successfully');
    setNewEMI({
      name: '',
      amount: '',
      totalInstallments: '',
      paidInstallments: '0',
      description: '',
    });
    setShowAddSheet(false);
  };

  const handleRecordPayment = (emi: EMI) => {
    if (emi.paidInstallments >= emi.totalInstallments) {
      toast.error('All installments already paid');
      return;
    }

    recordEMIPayment(emi.id);
    toast.success(`${emi.name} payment recorded`, {
      description: `${emi.paidInstallments + 1}/${emi.totalInstallments} installments paid`,
    });
  };

  const handleDeleteEMI = () => {
    if (!emiToDelete) return;
    
    deleteEMI(emiToDelete.id);
    toast.success('EMI deleted');
    setEmiToDelete(null);
  };

  // Calculate total EMI liability
  const totalLiability = emis.reduce((sum, emi) => {
    const remaining = emi.totalInstallments - emi.paidInstallments;
    return sum + (remaining * emi.amount);
  }, 0);

  // Active EMIs (not fully paid)
  const activeEMIs = emis.filter((emi) => emi.paidInstallments < emi.totalInstallments);
  const completedEMIs = emis.filter((emi) => emi.paidInstallments >= emi.totalInstallments);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="EMIs" showScore={false} />
        <div className="px-4 py-4 max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="EMI Tracker" showScore={false} />

      <div className="px-4 py-4 max-w-md mx-auto space-y-4">
        {/* Summary Card */}
        <Card className="border-0 bg-gradient-to-br from-purple-500/20 to-purple-600/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-muted-foreground">EMI Summary</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Monthly EMI</p>
                <p className="text-xl font-bold text-purple-400">
                  {formatCurrency(totalMonthlyEMI)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Liability</p>
                <p className="text-xl font-bold">
                  {formatCurrency(totalLiability)}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{activeEMIs.length} active EMI{activeEMIs.length !== 1 ? 's' : ''}</span>
                <span>{completedEMIs.length} completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add EMI Button */}
        <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
          <SheetTrigger asChild>
            <Button className="w-full min-h-11 gap-2">
              <Plus className="w-4 h-4" />
              Add New EMI
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Add New EMI</SheetTitle>
              <SheetDescription>
                Track a new EMI by entering the details below.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="emi-name">EMI Name *</Label>
                <Input
                  id="emi-name"
                  placeholder="e.g., Car Loan, Credit Card EMI"
                  value={newEMI.name}
                  onChange={(e) => setNewEMI({ ...newEMI, name: e.target.value })}
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emi-amount">Monthly Amount (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="emi-amount"
                    type="number"
                    placeholder="0"
                    value={newEMI.amount}
                    onChange={(e) => setNewEMI({ ...newEMI, amount: e.target.value })}
                    className="pl-9 bg-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total-installments">Total Installments *</Label>
                  <Input
                    id="total-installments"
                    type="number"
                    placeholder="12"
                    value={newEMI.totalInstallments}
                    onChange={(e) => setNewEMI({ ...newEMI, totalInstallments: e.target.value })}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paid-installments">Already Paid</Label>
                  <Input
                    id="paid-installments"
                    type="number"
                    placeholder="0"
                    value={newEMI.paidInstallments}
                    onChange={(e) => setNewEMI({ ...newEMI, paidInstallments: e.target.value })}
                    className="bg-card"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emi-description">Description (optional)</Label>
                <Input
                  id="emi-description"
                  placeholder="Additional notes..."
                  value={newEMI.description}
                  onChange={(e) => setNewEMI({ ...newEMI, description: e.target.value })}
                  className="bg-card"
                />
              </div>

              <Button onClick={handleAddEMI} className="w-full min-h-11 mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add EMI
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Active EMIs */}
        {activeEMIs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">Active EMIs</h2>
            {activeEMIs.map((emi) => {
              const progress = (emi.paidInstallments / emi.totalInstallments) * 100;
              const remainingInstallments = emi.totalInstallments - emi.paidInstallments;
              const remainingAmount = remainingInstallments * emi.amount;

              return (
                <Card key={emi.id} className="border-0 bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{emi.name}</h3>
                        {emi.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {emi.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                          onClick={() => handleRecordPayment(emi)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          onClick={() => setEmiToDelete(emi)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly</span>
                        <span className="font-semibold text-purple-400">
                          {formatCurrency(emi.amount)}
                        </span>
                      </div>

                      <Progress value={progress} className="h-2" />

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {emi.paidInstallments}/{emi.totalInstallments} paid
                        </span>
                        <span>{remainingInstallments} remaining</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Ends {format(new Date(emi.endDate), 'MMM yyyy')}
                          </span>
                        </div>
                        <span className="text-xs">
                          Remaining: {formatCurrency(remainingAmount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Completed EMIs */}
        {completedEMIs.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">Completed EMIs</h2>
            {completedEMIs.map((emi) => (
              <Card key={emi.id} className="border-0 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-muted-foreground">{emi.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {emi.totalInstallments} × {formatCurrency(emi.amount)} = {formatCurrency(emi.totalInstallments * emi.amount)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      onClick={() => setEmiToDelete(emi)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {emis.length === 0 && (
          <Card className="border-0 bg-card">
            <CardContent className="p-8 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold mb-2">No EMIs tracked</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start tracking your EMIs to better manage your monthly obligations.
              </p>
              <Button onClick={() => setShowAddSheet(true)} className="min-h-11">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First EMI
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!emiToDelete} onOpenChange={() => setEmiToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete EMI?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this EMI? This will remove it from your tracking.
            </DialogDescription>
          </DialogHeader>
          {emiToDelete && (
            <div className="py-4 space-y-2">
              <p className="font-medium">{emiToDelete.name}</p>
              <p className="text-sm text-muted-foreground">
                Amount: {formatCurrency(emiToDelete.amount)}/month
              </p>
              <p className="text-sm text-muted-foreground">
                Progress: {emiToDelete.paidInstallments}/{emiToDelete.totalInstallments} paid
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmiToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEMI}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
