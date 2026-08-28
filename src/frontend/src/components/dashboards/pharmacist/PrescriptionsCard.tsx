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
import { Check, ClipboardList } from "lucide-react";
import { useState } from "react";

interface Prescription {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  items: string[];
}

// Fictional local data — mockData has no prescriptions.
const PRESCRIPTIONS: Prescription[] = [
  {
    id: "RX-9001",
    patient: "Anitha Reddy",
    doctor: "Dr. Nagesh Rao",
    date: "2026-08-28",
    items: ["Amlodipine 5mg", "Metformin 500mg"],
  },
  {
    id: "RX-9002",
    patient: "Ravi Kumar",
    doctor: "Dr. Kavitha Sharma",
    date: "2026-08-28",
    items: ["Salbutamol Inhaler"],
  },
  {
    id: "RX-9003",
    patient: "Lakshmi Devi",
    doctor: "Dr. Nagesh Rao",
    date: "2026-08-27",
    items: ["ORS Sachets", "Paracetamol 500mg"],
  },
];

export function PrescriptionsCard() {
  const { t } = useTranslation();
  const [dispensed, setDispensed] = useState<Set<string>>(new Set());

  const pending = PRESCRIPTIONS.filter((p) => !dispensed.has(p.id));

  const handleDispense = (id: string) => {
    setDispensed((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="pharmacist.prescriptions_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <ClipboardList className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("pharmacist.prescriptions")}
            </CardTitle>
            <CardDescription>
              {t("pharmacist.prescriptionsDesc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {pending.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="pharmacist.prescriptions.empty_state"
          >
            <ClipboardList
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-foreground">
              {t("pharmacist.noPrescriptions")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("pharmacist.noPrescriptionsDesc")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {pending.map((prescription, index) => (
              <li
                key={prescription.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`pharmacist.prescriptions.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {prescription.patient}
                  </p>
                  <Badge variant="secondary">{prescription.id}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("pharmacist.doctor")}: {prescription.doctor} ·{" "}
                  {t("pharmacist.date")}: {prescription.date}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {prescription.items.join(", ")}
                </p>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => handleDispense(prescription.id)}
                  data-ocid={`pharmacist.prescriptions.dispense_button.${index + 1}`}
                >
                  <Check className="size-4" aria-hidden="true" />
                  {t("pharmacist.dispense")}
                </Button>
              </li>
            ))}
          </ul>
        )}

        {dispensed.size > 0 && (
          <output
            className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
            data-ocid="pharmacist.prescriptions.success_state"
          >
            <Check className="size-4" aria-hidden="true" />
            {t("pharmacist.dispensed")} · {t("pharmacist.dispensedDesc")}
          </output>
        )}
      </CardContent>
    </Card>
  );
}
