import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Medicine, MedicineStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Check, Minus, PackagePlus, Plus } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  MedicineStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  low: "outline",
  unavailable: "destructive",
};

export function StockUpdatesCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.getMedicines,
  });
  const [stock, setStock] = useState<Record<string, number>>({});
  const [updated, setUpdated] = useState<Set<string>>(new Set());

  const medicines = data ?? [];

  const currentStock = (id: string, fallback: number) => stock[id] ?? fallback;

  const adjust = (id: string, fallback: number, delta: number) => {
    setStock((prev) => ({
      ...prev,
      [id]: Math.max(0, currentStock(id, fallback) + delta),
    }));
    setUpdated((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleSave = (id: string) => {
    setUpdated((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="pharmacist.stock_updates_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <PackagePlus className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("pharmacist.stockUpdates")}
            </CardTitle>
            <CardDescription>
              {t("pharmacist.stockUpdatesDesc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="pharmacist.stock_updates.loading_state"
          >
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="pharmacist.stock_updates.error_state"
          >
            <p className="text-sm text-muted-foreground">
              {t("pharmacist.error")}
            </p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("pharmacist.retry")}
            </Button>
          </div>
        ) : medicines.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="pharmacist.stock_updates.empty_state"
          >
            <PackagePlus
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("pharmacist.noMedicines")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {medicines.map((medicine, index) => {
              const value = currentStock(medicine.id, medicine.stock);
              const isSaved = updated.has(medicine.id);
              return (
                <li
                  key={medicine.id}
                  className="rounded-lg border bg-background p-3"
                  data-ocid={`pharmacist.stock_updates.item.${index + 1}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {medicine.name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{medicine.category}</span>
                        <Badge variant={statusVariant[medicine.status]}>
                          {t(`status.${medicine.status}`)}
                        </Badge>
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {t("pharmacist.currentStock")}: {medicine.stock}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => adjust(medicine.id, medicine.stock, -1)}
                      aria-label={`${t("pharmacist.updateStock")} -`}
                      data-ocid={`pharmacist.stock_updates.decrement_button.${index + 1}`}
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </Button>
                    <Input
                      type="number"
                      min={0}
                      value={value}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setStock((prev) => ({
                          ...prev,
                          [medicine.id]: Number.isNaN(next)
                            ? 0
                            : Math.max(0, next),
                        }));
                        setUpdated((prev) => {
                          const s = new Set(prev);
                          s.delete(medicine.id);
                          return s;
                        });
                      }}
                      aria-label={`${t("pharmacist.newStock")} - ${medicine.name}`}
                      className="h-8 w-20 text-center tabular-nums"
                      data-ocid={`pharmacist.stock_updates.input.${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => adjust(medicine.id, medicine.stock, 1)}
                      aria-label={`${t("pharmacist.updateStock")} +`}
                      data-ocid={`pharmacist.stock_updates.increment_button.${index + 1}`}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </Button>
                    <span className="flex-1 text-xs text-muted-foreground">
                      {t("pharmacist.units")}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleSave(medicine.id)}
                      data-ocid={`pharmacist.stock_updates.save_button.${index + 1}`}
                    >
                      {t("pharmacist.save")}
                    </Button>
                  </div>

                  {isSaved && (
                    <output
                      className="mt-2 flex items-center gap-1.5 text-xs font-medium text-success"
                      data-ocid={`pharmacist.stock_updates.success_state.${index + 1}`}
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      {t("pharmacist.stockUpdated")}
                    </output>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
