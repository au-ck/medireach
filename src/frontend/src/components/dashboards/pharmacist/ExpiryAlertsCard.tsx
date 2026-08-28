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
import { CalendarClock } from "lucide-react";

const EXPIRY_WINDOW_DAYS = 120;

function daysUntil(expiry: string): number {
  const target = new Date(`${expiry}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

export function ExpiryAlertsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.getMedicines,
  });

  const medicines = data ?? [];
  const alerts = medicines
    .map((medicine) => ({ medicine, days: daysUntil(medicine.expiry) }))
    .filter(({ days }) => days <= EXPIRY_WINDOW_DAYS)
    .sort((a, b) => a.days - b.days);

  return (
    <Card className="h-full" data-ocid="pharmacist.expiry_alerts_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <CalendarClock className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("pharmacist.expiryAlerts")}
            </CardTitle>
            <CardDescription>
              {t("pharmacist.expiryAlertsDesc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="pharmacist.expiry_alerts.loading_state"
          >
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="pharmacist.expiry_alerts.error_state"
          >
            <p className="text-sm text-muted-foreground">
              {t("pharmacist.error")}
            </p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("pharmacist.retry")}
            </Button>
          </div>
        ) : alerts.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="pharmacist.expiry_alerts.empty_state"
          >
            <CalendarClock
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-foreground">
              {t("pharmacist.noExpiryAlerts")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("pharmacist.noExpiryAlertsDesc")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {alerts.map(({ medicine, days }, index) => {
              const expired = days < 0;
              return (
                <li
                  key={medicine.id}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2"
                  data-ocid={`pharmacist.expiry_alerts.item.${index + 1}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {medicine.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("pharmacist.expiry")}: {medicine.expiry}
                    </p>
                  </div>
                  <Badge
                    variant={expired ? "destructive" : "outline"}
                    className="shrink-0"
                  >
                    {expired
                      ? t("pharmacist.expired")
                      : `${days} ${t("pharmacist.daysLeft")}`}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
