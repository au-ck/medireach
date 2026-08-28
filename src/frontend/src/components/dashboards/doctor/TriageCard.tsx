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
import { Check, Clock, Siren } from "lucide-react";
import { useState } from "react";

const severityVariant: Record<
  TriageEntry["severity"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive",
};

export function TriageCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["triage"],
    queryFn: api.getTriage,
  });
  const [triaged, setTriaged] = useState<Set<string>>(new Set());

  const entries = (data ?? []).filter(
    (e) => e.status !== "treated" && !triaged.has(e.id),
  );

  const handleTriage = (id: string) => {
    setTriaged((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="doctor.triage_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Siren className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("doctor.triage")}
            </CardTitle>
            <CardDescription>{t("doctor.triageDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div className="space-y-3" data-ocid="doctor.triage.loading_state">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.triage.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : entries.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.triage.empty_state"
          >
            <Siren
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("doctor.noTriage")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.slice(0, 4).map((entry, index) => (
              <li
                key={entry.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`doctor.triage.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {entry.patientName}
                  </p>
                  <Badge variant={severityVariant[entry.severity]}>
                    {t(`doctor.${entry.severity}`)}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {t("doctor.complaint")}: {entry.complaint}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {t("doctor.time")}: {entry.arrivalTime}
                </p>
                {triaged.has(entry.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="doctor.triage.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("doctor.triageUpdated")}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleTriage(entry.id)}
                    data-ocid={`doctor.triage.triage_button.${index + 1}`}
                  >
                    <Siren className="size-4" aria-hidden="true" />
                    {t("doctor.triagePatient")}
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
