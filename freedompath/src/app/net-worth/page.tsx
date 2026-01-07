"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  useAppStore,
  useNetWorth,
  useTotalAssets,
  useTotalLiabilities,
} from "@/lib/store";
import { formatCurrency, Asset, Liability } from "@/lib/finances";
import {
  Plus,
  Wallet,
  TrendingUp,
  Home,
  CreditCard,
  Car,
  GraduationCap,
  Bitcoin,
  PiggyBank,
  Building,
  Trash2,
  Pencil,
} from "lucide-react";

type AssetType = Asset["type"];
type LiabilityType = Liability["type"];

const assetTypeConfig: Record<AssetType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  cash: { label: "Cash", icon: Wallet },
  stocks: { label: "Stocks/Funds", icon: TrendingUp },
  real_estate: { label: "Real Estate", icon: Home },
  bonds: { label: "Bonds", icon: Building },
  crypto: { label: "Crypto", icon: Bitcoin },
  other: { label: "Other", icon: PiggyBank },
};

const liabilityTypeConfig: Record<LiabilityType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  mortgage: { label: "Mortgage", icon: Home },
  car_loan: { label: "Car Loan", icon: Car },
  student_loan: { label: "Student Loan", icon: GraduationCap },
  credit_card: { label: "Credit Card", icon: CreditCard },
  other: { label: "Other", icon: Wallet },
};

const AddAssetSheet = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>("cash");
  const [value, setValue] = useState("");
  const addAsset = useAppStore((state) => state.addAsset);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;

    addAsset({
      name,
      type,
      value: parseFloat(value),
    });

    setName("");
    setType("cash");
    setValue("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="min-h-11">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[90vh]">
        <SheetHeader>
          <SheetTitle>Add New Asset</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-8">
          <div className="space-y-2">
            <Label htmlFor="asset-name">Name</Label>
            <Input
              id="asset-name"
              placeholder="e.g., Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(assetTypeConfig) as AssetType[]).map((t) => {
                const config = assetTypeConfig[t];
                const Icon = config.icon;
                return (
                  <Button
                    key={t}
                    type="button"
                    variant={type === t ? "default" : "outline"}
                    className="min-h-11 flex-col h-auto py-3"
                    onClick={() => setType(t)}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{config.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-value">Value</Label>
            <Input
              id="asset-value"
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-11 text-lg"
              inputMode="decimal"
            />
          </div>

          <Button type="submit" className="w-full min-h-11" disabled={!name || !value}>
            Add Asset
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const AddLiabilitySheet = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<LiabilityType>("mortgage");
  const [value, setValue] = useState("");
  const addLiability = useAppStore((state) => state.addLiability);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;

    addLiability({
      name,
      type,
      value: parseFloat(value),
    });

    setName("");
    setType("mortgage");
    setValue("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="min-h-11">
          <Plus className="h-4 w-4 mr-2" />
          Add Liability
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[90vh]">
        <SheetHeader>
          <SheetTitle>Add New Liability</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-8">
          <div className="space-y-2">
            <Label htmlFor="liability-name">Name</Label>
            <Input
              id="liability-name"
              placeholder="e.g., Home Mortgage"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(liabilityTypeConfig) as LiabilityType[]).map((t) => {
                const config = liabilityTypeConfig[t];
                const Icon = config.icon;
                return (
                  <Button
                    key={t}
                    type="button"
                    variant={type === t ? "default" : "outline"}
                    className="min-h-11 flex-col h-auto py-3"
                    onClick={() => setType(t)}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{config.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="liability-value">Balance Owed</Label>
            <Input
              id="liability-value"
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-11 text-lg"
              inputMode="decimal"
            />
          </div>

          <Button type="submit" className="w-full min-h-11" disabled={!name || !value}>
            Add Liability
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const EditAssetSheet = ({
  asset,
  onClose,
}: {
  asset: Asset;
  onClose: () => void;
}) => {
  const [name, setName] = useState(asset.name);
  const [type, setType] = useState<AssetType>(asset.type);
  const [value, setValue] = useState(asset.value.toString());
  const updateAsset = useAppStore((state) => state.updateAsset);
  const deleteAsset = useAppStore((state) => state.deleteAsset);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;

    updateAsset(asset.id, {
      name,
      type,
      value: parseFloat(value),
    });
    onClose();
  };

  const handleDelete = () => {
    deleteAsset(asset.id);
    onClose();
  };

  return (
    <SheetContent side="bottom" className="h-auto max-h-[90vh]">
      <SheetHeader>
        <SheetTitle>Edit Asset</SheetTitle>
      </SheetHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-8">
        <div className="space-y-2">
          <Label htmlFor="edit-asset-name">Name</Label>
          <Input
            id="edit-asset-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(assetTypeConfig) as AssetType[]).map((t) => {
              const config = assetTypeConfig[t];
              const Icon = config.icon;
              return (
                <Button
                  key={t}
                  type="button"
                  variant={type === t ? "default" : "outline"}
                  className="min-h-11 flex-col h-auto py-3"
                  onClick={() => setType(t)}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-xs">{config.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-asset-value">Value</Label>
          <Input
            id="edit-asset-value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
          <Button type="submit" className="flex-1 min-h-11" disabled={!name || !value}>
            Save Changes
          </Button>
        </div>
      </form>
    </SheetContent>
  );
};

const EditLiabilitySheet = ({
  liability,
  onClose,
}: {
  liability: Liability;
  onClose: () => void;
}) => {
  const [name, setName] = useState(liability.name);
  const [type, setType] = useState<LiabilityType>(liability.type);
  const [value, setValue] = useState(liability.value.toString());
  const updateLiability = useAppStore((state) => state.updateLiability);
  const deleteLiability = useAppStore((state) => state.deleteLiability);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;

    updateLiability(liability.id, {
      name,
      type,
      value: parseFloat(value),
    });
    onClose();
  };

  const handleDelete = () => {
    deleteLiability(liability.id);
    onClose();
  };

  return (
    <SheetContent side="bottom" className="h-auto max-h-[90vh]">
      <SheetHeader>
        <SheetTitle>Edit Liability</SheetTitle>
      </SheetHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-8">
        <div className="space-y-2">
          <Label htmlFor="edit-liability-name">Name</Label>
          <Input
            id="edit-liability-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(liabilityTypeConfig) as LiabilityType[]).map((t) => {
              const config = liabilityTypeConfig[t];
              const Icon = config.icon;
              return (
                <Button
                  key={t}
                  type="button"
                  variant={type === t ? "default" : "outline"}
                  className="min-h-11 flex-col h-auto py-3"
                  onClick={() => setType(t)}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-xs">{config.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-liability-value">Balance Owed</Label>
          <Input
            id="edit-liability-value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
          <Button type="submit" className="flex-1 min-h-11" disabled={!name || !value}>
            Save Changes
          </Button>
        </div>
      </form>
    </SheetContent>
  );
};

const AssetItem = ({ asset }: { asset: Asset }) => {
  const [editing, setEditing] = useState(false);
  const config = assetTypeConfig[asset.type];
  const Icon = config.icon;

  return (
    <>
      <div
        className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 press-effect cursor-pointer"
        onClick={() => setEditing(true)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{asset.name}</p>
            <p className="text-xs text-muted-foreground">{config.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-success">
            {formatCurrency(asset.value)}
          </span>
          <Pencil className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
      <Sheet open={editing} onOpenChange={setEditing}>
        {editing && <EditAssetSheet asset={asset} onClose={() => setEditing(false)} />}
      </Sheet>
    </>
  );
};

const LiabilityItem = ({ liability }: { liability: Liability }) => {
  const [editing, setEditing] = useState(false);
  const config = liabilityTypeConfig[liability.type];
  const Icon = config.icon;

  return (
    <>
      <div
        className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/30 press-effect cursor-pointer"
        onClick={() => setEditing(true)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-destructive/10">
            <Icon className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="font-medium text-sm">{liability.name}</p>
            <p className="text-xs text-muted-foreground">{config.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-destructive">
            -{formatCurrency(liability.value)}
          </span>
          <Pencil className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
      <Sheet open={editing} onOpenChange={setEditing}>
        {editing && (
          <EditLiabilitySheet liability={liability} onClose={() => setEditing(false)} />
        )}
      </Sheet>
    </>
  );
};

export default function NetWorthPage() {
  const assets = useAppStore((state) => state.assets);
  const liabilities = useAppStore((state) => state.liabilities);
  const netWorth = useNetWorth();
  const totalAssets = useTotalAssets();
  const totalLiabilities = useTotalLiabilities();

  return (
    <div className="px-4 py-6 space-y-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Net Worth</h1>
        <p className="text-muted-foreground text-sm">Track your assets and liabilities</p>
      </header>

      {/* Net Worth Summary Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Total Net Worth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-4xl font-bold ${netWorth >= 0 ? "text-success" : "text-destructive"}`}>
            {formatCurrency(netWorth)}
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-lg font-semibold text-success">
                {formatCurrency(totalAssets)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Liabilities</p>
              <p className="text-lg font-semibold text-destructive">
                -{formatCurrency(totalLiabilities)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="assets" className="flex-1 min-h-11">
            Assets ({assets.length})
          </TabsTrigger>
          <TabsTrigger value="liabilities" className="flex-1 min-h-11">
            Liabilities ({liabilities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-3 mt-4">
          <div className="flex justify-end">
            <AddAssetSheet />
          </div>

          {assets.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No assets yet</p>
                <p className="text-sm text-muted-foreground">
                  Add your first asset to start tracking
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {assets.map((asset) => (
                <AssetItem key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="liabilities" className="space-y-3 mt-4">
          <div className="flex justify-end">
            <AddLiabilitySheet />
          </div>

          {liabilities.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No liabilities</p>
                <p className="text-sm text-muted-foreground">
                  Great! You have no debts tracked
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {liabilities.map((liability) => (
                <LiabilityItem key={liability.id} liability={liability} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
