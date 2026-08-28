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
import type { Medicine, MedicineStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Check, Pill } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  MedicineStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  low: "outline",
  unavailable: "destructive",
};

export function PrescriptionsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.getMedicines,
  });
  const [written, setWritten] = useState<Set<string>>(new Set());

  const medicines = (data ?? []).filter((m) => m.status !== "unavailable");

  const handleWrite = (id: string) => {
    setWritten((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="doctor.prescriptions_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Pill className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("doctor.prescriptions")}
            </CardTitle>
            <CardDescription>{t("doctor.prescriptionsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="doctor.prescriptions.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.prescriptions.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : medicines.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.prescriptions.empty_state"
          >
            <Pill
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("doctor.noPrescriptions")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {medicines.slice(0, 4).map((medicine, index) => (
              <li
                key={medicine.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`doctor.prescriptions.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {medicine.name}
                  </p>
                  <Badge variant={statusVariant[medicine.status]}>
                    {t(`status.${medicine.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {t("doctor.category")}: {medicine.category}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("doctor.stock")}: {medicine.stock} {medicine.unit}
                </p>
                {written.has(medicine.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="doctor.prescriptions.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("doctor.prescriptionWritten")}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleWrite(medicine.id)}
                    data-ocid={`doctor.prescriptions.write_button.${index + 1}`}
                  >
                    <Pill className="size-4" aria-hidden="true" />
                    {t("doctor.writePrescription")}
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
