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
import type { Teleconsultation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Check, Clock, Video } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  Teleconsultation["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  scheduled: "secondary",
  "in-progress": "default",
  completed: "outline",
  cancelled: "destructive",
};

export function TeleconsultationCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["teleconsultations"],
    queryFn: api.getTeleconsultations,
  });
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const upcoming = (data ?? []).filter(
    (c) => c.status !== "completed" && c.status !== "cancelled",
  );

  const handleJoin = (id: string) => {
    setJoined((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="patient.teleconsultation_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Video className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("patient.teleconsultation")}
            </CardTitle>
            <CardDescription>
              {t("patient.teleconsultationDesc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="patient.teleconsultation.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.teleconsultation.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : upcoming.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.teleconsultation.empty_state"
          >
            <Video
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("patient.noTeleconsultations")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {upcoming.map((consult, index) => (
              <li
                key={consult.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`patient.teleconsultation.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {consult.doctorName}
                  </p>
                  <Badge variant={statusVariant[consult.status]}>
                    {t(`status.${consult.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {t("patient.scheduledFor")} {consult.scheduledAt.slice(0, 16)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("patient.duration")}: {consult.durationMinutes}{" "}
                  {t("patient.minutes")}
                </p>
                {joined.has(consult.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="patient.teleconsultation.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("patient.callJoined")}
                  </div>
                ) : (
                  <Button
                    className="mt-2 w-full"
                    size="sm"
                    onClick={() => handleJoin(consult.id)}
                    data-ocid={`patient.teleconsultation.join_button.${index + 1}`}
                  >
                    <Video className="size-4" aria-hidden="true" />
                    {t("patient.joinCall")}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
