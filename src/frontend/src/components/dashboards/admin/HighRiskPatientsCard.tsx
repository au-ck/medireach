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
import type { PatientRisk } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HeartPulse, ShieldAlert } from "lucide-react";

const riskVariant: Record<
  PatientRisk,
  "default" | "secondary" | "outline" | "destructive"
> = {
  stable: "secondary",
  moderate: "outline",
  high: "outline",
  critical: "destructive",
};

export function HighRiskPatientsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: api.getPatients,
  });

  const highRisk = (data ?? []).filter(
    (p) => p.risk === "high" || p.risk === "critical",
  );

  return (
    <Card className="h-full" data-ocid="admin.high_risk_patients_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("admin.highRiskPatients")}
            </CardTitle>
            <CardDescription>{t("admin.highRiskPatientsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="admin.high_risk_patients.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.high_risk_patients.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : highRisk.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.high_risk_patients.empty_state"
          >
            <HeartPulse
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("admin.noHighRisk")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {highRisk.map((patient, index) => (
              <li
                key={patient.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`admin.high_risk_patients.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {patient.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {t("admin.age")}: {patient.age} · {patient.village}
                    </p>
                  </div>
                  <Badge variant={riskVariant[patient.risk]}>
                    {t(`status.${patient.risk}`)}
                  </Badge>
                </div>
                <p className="mt-2 truncate text-xs text-muted-foreground">
                  {patient.conditions.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
