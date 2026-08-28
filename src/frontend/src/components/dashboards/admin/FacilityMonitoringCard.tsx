import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Facility } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";

const statusVariant: Record<
  Facility["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  open: "default",
  limited: "outline",
  closed: "destructive",
};

export function FacilityMonitoringCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["facilities"],
    queryFn: api.getFacilities,
  });

  const facilities = data ?? [];

  return (
    <Card className="h-full" data-ocid="admin.facility_monitoring_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("admin.facilityMonitoring")}
            </CardTitle>
            <CardDescription>
              {t("admin.facilityMonitoringDesc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="admin.facility_monitoring.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.facility_monitoring.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : facilities.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.facility_monitoring.empty_state"
          >
            <Building2
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("admin.noAlerts")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {facilities.map((facility, index) => {
              const pct =
                facility.bedsTotal > 0
                  ? Math.round(
                      (facility.bedsAvailable / facility.bedsTotal) * 100,
                    )
                  : 0;
              return (
                <li
                  key={facility.id}
                  className="rounded-lg border bg-background p-3"
                  data-ocid={`admin.facility_monitoring.item.${index + 1}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {facility.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {facility.location}
                      </p>
                    </div>
                    <Badge variant={statusVariant[facility.status]}>
                      {t(`status.${facility.status}`)}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {facility.bedsAvailable} {t("admin.bedsAvailable")}
                      </span>
                      <span className="tabular-nums">
                        {t("admin.of")} {facility.bedsTotal} {t("admin.beds")}
                      </span>
                    </div>
                    <Progress value={pct} aria-label={facility.name} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
