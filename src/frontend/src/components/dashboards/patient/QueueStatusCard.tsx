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
import { Clock, RefreshCw, Users } from "lucide-react";

const severityVariant: Record<
  TriageEntry["severity"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive",
};

export function QueueStatusCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["triage"],
    queryFn: api.getTriage,
  });

  const waiting = (data ?? []).filter((entry) => entry.status === "waiting");
  const position = Math.min(waiting.length + 1, 9);
  const estimatedWait = position * 10;

  return (
    <Card className="h-full" data-ocid="patient.queue_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Users className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("patient.queue")}
            </CardTitle>
            <CardDescription>{t("patient.queueDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {isLoading ? (
          <div className="space-y-3" data-ocid="patient.queue.loading_state">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.queue.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : (
          <>
            <div
              className="flex items-center justify-between rounded-xl bg-gradient-subtle p-4"
              data-ocid="patient.queue.position"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("patient.yourPosition")}
                </p>
                <p className="mt-1 font-display text-4xl font-bold text-primary">
                  {position}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("patient.estimatedWait")}
                </p>
                <p className="mt-1 flex items-center justify-end gap-1.5 font-display text-2xl font-semibold text-foreground">
                  <Clock className="size-5 text-accent" aria-hidden="true" />
                  {estimatedWait} {t("patient.minutes")}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                {t("patient.peopleAhead")}
              </p>
              <ul className="flex flex-col gap-2">
                {waiting.slice(0, 3).map((entry, index) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2"
                    data-ocid={`patient.queue.item.${index + 1}`}
                  >
                    <span className="truncate text-sm text-foreground">
                      {entry.patientName}
                    </span>
                    <Badge variant={severityVariant[entry.severity]}>
                      {t(`status.${entry.severity}`)}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="mt-auto pt-1">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => void refetch()}
            data-ocid="patient.queue.refresh_button"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            {t("common.retry")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
