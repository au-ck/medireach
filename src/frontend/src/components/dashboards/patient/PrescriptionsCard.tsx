import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/i18n/useTranslation";
import { Check, Download, Pill, RefreshCw } from "lucide-react";
import { useState } from "react";

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  status: "active" | "inactive";
}

// Fictional local prescription data (mockData has no prescriptions).
const mockPrescriptions: Prescription[] = [
  {
    id: "RX-9001",
    medication: "Amlodipine 5mg",
    dosage: "1 tablet",
    frequency: "Once daily",
    status: "active",
  },
  {
    id: "RX-9002",
    medication: "Metformin 500mg",
    dosage: "1 tablet",
    frequency: "Twice daily",
    status: "active",
  },
  {
    id: "RX-9003",
    medication: "Salbutamol Inhaler",
    dosage: "2 puffs",
    frequency: "As needed",
    status: "active",
  },
];

export function PrescriptionsCard() {
  const { t } = useTranslation();
  const [refilled, setRefilled] = useState<Set<string>>(new Set());

  const handleRefill = (id: string) => {
    setRefilled((prev) => new Set(prev).add(id));
  };

  const handleDownload = (_id: string) => {
    // Download is a client-side action; no state is tracked for it.
  };

  return (
    <Card className="h-full" data-ocid="patient.prescriptions_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Pill className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("patient.prescriptions")}
            </CardTitle>
            <CardDescription>{t("patient.prescriptionsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {mockPrescriptions.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.prescriptions.empty_state"
          >
            <Pill
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("patient.noPrescriptions")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {mockPrescriptions.map((prescription, index) => (
              <li
                key={prescription.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`patient.prescriptions.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {prescription.medication}
                  </p>
                  <Badge variant="default">
                    {t(`status.${prescription.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("patient.dosage")}: {prescription.dosage} ·{" "}
                  {t("patient.frequency")}: {prescription.frequency}
                </p>
                {refilled.has(prescription.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="patient.prescriptions.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("patient.refillRequested")}
                  </div>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(prescription.id)}
                      data-ocid={`patient.prescriptions.download_button.${index + 1}`}
                    >
                      <Download className="size-4" aria-hidden="true" />
                      {t("patient.downloadPrescription")}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRefill(prescription.id)}
                      data-ocid={`patient.prescriptions.refill_button.${index + 1}`}
                    >
                      <RefreshCw className="size-4" aria-hidden="true" />
                      {t("patient.refill")}
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
