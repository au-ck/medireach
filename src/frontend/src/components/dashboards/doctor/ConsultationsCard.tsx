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

export function ConsultationsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["teleconsultations"],
    queryFn: api.getTeleconsultations,
  });
  const [started, setStarted] = useState<Set<string>>(new Set());

  const consultations = (data ?? []).filter(
    (c) => c.status !== "cancelled" && !started.has(c.id),
  );

  const handleStart = (id: string) => {
    setStarted((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="doctor.consultations_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Video className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("doctor.consultations")}
            </CardTitle>
            <CardDescription>{t("doctor.consultationsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="doctor.consultations.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.consultations.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : consultations.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.consultations.empty_state"
          >
            <Video
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("doctor.noConsultations")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {consultations.slice(0, 4).map((c, index) => (
              <li
                key={c.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`doctor.consultations.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {c.patientName}
                  </p>
                  <Badge variant={statusVariant[c.status]}>
                    {t(`doctor.${c.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {c.scheduledAt} · {t("doctor.duration")}: {c.durationMinutes}m
                </p>
                {started.has(c.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="doctor.consultations.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("doctor.consultationStarted")}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleStart(c.id)}
                    data-ocid={`doctor.consultations.start_button.${index + 1}`}
                  >
                    <Video className="size-4" aria-hidden="true" />
                    {t("doctor.startConsultation")}
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
