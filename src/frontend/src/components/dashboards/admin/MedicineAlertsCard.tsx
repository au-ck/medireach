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
import type { MedicineStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PackageX, Pill } from "lucide-react";

const statusVariant: Record<
  MedicineStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  low: "outline",
  unavailable: "destructive",
};

export function MedicineAlertsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.getMedicines,
  });

  const alerts = (data ?? []).filter(
    (m) => m.status === "low" || m.status === "unavailable",
  );

  return (
    <Card className="h-full" data-ocid="admin.medicine_alerts_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Pill className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("admin.medicineAlerts")}
            </CardTitle>
            <CardDescription>{t("admin.medicineAlertsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="admin.medicine_alerts.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.medicine_alerts.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : alerts.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.medicine_alerts.empty_state"
          >
            <PackageX
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("admin.noAlerts")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {alerts.map((medicine, index) => (
              <li
                key={medicine.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`admin.medicine_alerts.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {medicine.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {medicine.category}
                    </p>
                  </div>
                  <Badge variant={statusVariant[medicine.status]}>
                    {t(`status.${medicine.status}`)}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="tabular-nums">
                    {medicine.stock} {t("admin.inStock")}
                  </span>
                  <span className="tabular-nums">
                    {t("admin.expiry")}: {medicine.expiry}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
