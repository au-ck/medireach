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
import { Package, Search } from "lucide-react";
import { useMemo, useState } from "react";

const statusVariant: Record<
  MedicineStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  low: "outline",
  unavailable: "destructive",
};

export function InventoryCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.getMedicines,
  });
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const medicines = data ?? [];
    const term = query.trim().toLowerCase();
    if (!term) return medicines;
    return medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.category.toLowerCase().includes(term),
    );
  }, [data, query]);

  return (
    <Card className="h-full" data-ocid="pharmacist.inventory_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Package className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("pharmacist.inventory")}
            </CardTitle>
            <CardDescription>{t("pharmacist.inventoryDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("pharmacist.searchPlaceholder")}
            className="pl-9"
            aria-label={t("pharmacist.searchPlaceholder")}
            data-ocid="pharmacist.inventory.search_input"
          />
        </div>

        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="pharmacist.inventory.loading_state"
          >
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="pharmacist.inventory.error_state"
          >
            <p className="text-sm text-muted-foreground">
              {t("pharmacist.error")}
            </p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("pharmacist.retry")}
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="pharmacist.inventory.empty_state"
          >
            <Package
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-foreground">
              {t("pharmacist.noMedicines")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("pharmacist.noMedicinesDesc")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    {t("pharmacist.medicine")}
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    {t("pharmacist.category")}
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    {t("pharmacist.stock")}
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    {t("pharmacist.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((medicine, index) => (
                  <tr
                    key={medicine.id}
                    data-ocid={`pharmacist.inventory.item.${index + 1}`}
                  >
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {medicine.name}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {medicine.category}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-foreground">
                      {medicine.stock} {t("pharmacist.units")}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant={statusVariant[medicine.status]}>
                        {t(`status.${medicine.status}`)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
