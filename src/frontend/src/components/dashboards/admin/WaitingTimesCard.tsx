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
import type { TriageEntry } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Clock3, Timer } from "lucide-react";

const severityVariant: Record<
  TriageEntry["severity"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  low: "secondary",
  medium: "outline",
  high: "outline",
  critical: "destructive",
};

/** Reference time used to compute a fictional average wait from arrival times. */
const REFERENCE_MINUTES = 10 * 60 + 30; // 10:30

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function WaitingTimesCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["triage"],
    queryFn: api.getTriage,
  });

  const waiting = (data ?? []).filter(
    (entry) => entry.status === "waiting" || entry.status === "in-triage",
  );

  const avgWait =
    waiting.length > 0
      ? Math.round(
          waiting.reduce(
            (sum, entry) =>
              sum +
              Math.max(0, REFERENCE_MINUTES - toMinutes(entry.arrivalTime)),
            0,
          ) / waiting.length,
        )
      : 0;

  return (
    <Card className="h-full" data-ocid="admin.waiting_times_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Clock3 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("admin.waitingTimes")}
            </CardTitle>
            <CardDescription>{t("admin.waitingTimesDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="admin.waiting_times.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.waiting_times.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : waiting.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.waiting_times.empty_state"
          >
            <Timer
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("admin.noWaiting")}
            </p>
          </div>
        ) : (
          <>
            <div
              className="flex items-center justify-between rounded-xl bg-gradient-subtle px-4 py-3"
              data-ocid="admin.waiting_times.summary"
            >
              <span className="text-sm text-muted-foreground">
                {t("admin.avgWait")}
              </span>
              <span className="font-display text-xl font-semibold text-foreground">
                {avgWait} {t("admin.min")}
              </span>
            </div>
            <ul className="flex flex-col gap-3">
              {waiting.map((entry, index) => (
                <li
                  key={entry.id}
                  className="rounded-lg border bg-background p-3"
                  data-ocid={`admin.waiting_times.item.${index + 1}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {entry.patientName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {entry.complaint}
                      </p>
                    </div>
                    <Badge variant={severityVariant[entry.severity]}>
                      {t(`status.${entry.severity}`)}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t(`status.${entry.status}`)}</span>
                    <span className="tabular-nums">
                      {t("admin.arrival")}: {entry.arrivalTime}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
