import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Medicine } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PackageSearch, Pill } from "lucide-react";

const statusVariant: Record<
  Medicine["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  low: "outline",
  unavailable: "destructive",
};

export function MedicineAvailabilityCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.getMedicines,
  });

  const medicines = (data ?? []).slice(0, 4);

  return (
    <Card className="h-full" data-ocid="patient.medicine_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <PackageSearch className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("patient.medicine")}
            </CardTitle>
            <CardDescription>{t("patient.medicineDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div className="space-y-3" data-ocid="patient.medicine.loading_state">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.medicine.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : medicines.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.medicine.empty_state"
          >
            <Pill
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("patient.noMedicines")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {medicines.map((medicine, index) => (
              <li
                key={medicine.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2"
                data-ocid={`patient.medicine.item.${index + 1}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {medicine.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t("patient.stock")}: {medicine.stock} {t("patient.units")}
                  </p>
                </div>
                <Badge variant={statusVariant[medicine.status]}>
                  {t(`status.${medicine.status}`)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
