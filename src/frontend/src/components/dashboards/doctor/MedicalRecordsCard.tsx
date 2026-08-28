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
import { Check, Eye, FileText } from "lucide-react";
import { useState } from "react";

const riskVariant: Record<
  PatientRisk,
  "default" | "secondary" | "outline" | "destructive"
> = {
  stable: "secondary",
  moderate: "outline",
  high: "default",
  critical: "destructive",
};

export function MedicalRecordsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: api.getPatients,
  });
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  const patients = (data ?? []).slice(0, 4);

  const handleView = (id: string) => {
    setViewed((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="doctor.medical_records_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("doctor.medicalRecords")}
            </CardTitle>
            <CardDescription>{t("doctor.medicalRecordsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="doctor.medical_records.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.medical_records.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : patients.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.medical_records.empty_state"
          >
            <FileText
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("doctor.noRecords")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {patients.map((patient, index) => (
              <li
                key={patient.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`doctor.medical_records.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {patient.name}
                  </p>
                  <Badge variant={riskVariant[patient.risk]}>
                    {t(`doctor.${patient.risk}`)}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {t("doctor.conditions")}:{" "}
                  {patient.conditions.length > 0
                    ? patient.conditions.join(", ")
                    : t("doctor.noConditions")}
                </p>
                {viewed.has(patient.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="doctor.medical_records.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("doctor.recordsViewed")}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleView(patient.id)}
                    data-ocid={`doctor.medical_records.view_button.${index + 1}`}
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    {t("doctor.viewRecords")}
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
