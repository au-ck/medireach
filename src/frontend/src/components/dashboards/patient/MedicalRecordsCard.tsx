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
import { Check, Download, FileText } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  DiagnosticResult["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  ready: "default",
  reviewed: "secondary",
};

export function MedicalRecordsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["diagnostics"],
    queryFn: api.getDiagnostics,
  });
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  const records = (data ?? []).slice(0, 3);

  const handleDownload = (id: string) => {
    setDownloaded((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="patient.medical_records_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("patient.medicalRecords")}
            </CardTitle>
            <CardDescription>{t("patient.medicalRecordsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="patient.medical_records.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.medical_records.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : records.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.medical_records.empty_state"
          >
            <FileText
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("patient.noRecords")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {records.map((record, index) => (
              <li
                key={record.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`patient.medical_records.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {record.test}
                  </p>
                  <Badge variant={statusVariant[record.status]}>
                    {t(`status.${record.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-foreground">{record.result}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("patient.date")}: {record.date}
                </p>
                {downloaded.has(record.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="patient.medical_records.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("patient.recordViewed")}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleDownload(record.id)}
                    data-ocid={`patient.medical_records.download_button.${index + 1}`}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    {t("patient.downloadRecord")}
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
