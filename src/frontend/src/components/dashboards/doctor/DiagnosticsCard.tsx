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
import type { DiagnosticResult } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Check, FlaskConical } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  DiagnosticResult["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  ready: "default",
  reviewed: "secondary",
};

export function DiagnosticsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["diagnostics"],
    queryFn: api.getDiagnostics,
  });
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  const results = (data ?? []).filter(
    (r) => r.status !== "reviewed" && !reviewed.has(r.id),
  );

  const handleReview = (id: string) => {
    setReviewed((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="doctor.diagnostics_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <FlaskConical className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("doctor.diagnostics")}
            </CardTitle>
            <CardDescription>{t("doctor.diagnosticsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="doctor.diagnostics.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.diagnostics.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : results.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.diagnostics.empty_state"
          >
            <FlaskConical
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("doctor.noDiagnostics")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {results.slice(0, 4).map((result, index) => (
              <li
                key={result.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`doctor.diagnostics.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {result.test}
                  </p>
                  <Badge variant={statusVariant[result.status]}>
                    {t(`status.${result.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-foreground">
                  {result.patientName} · {result.result}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("doctor.date")}: {result.date}
                </p>
                {reviewed.has(result.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="doctor.diagnostics.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("doctor.resultsReviewed")}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleReview(result.id)}
                    data-ocid={`doctor.diagnostics.review_button.${index + 1}`}
                  >
                    <FlaskConical className="size-4" aria-hidden="true" />
                    {t("doctor.reviewResults")}
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
