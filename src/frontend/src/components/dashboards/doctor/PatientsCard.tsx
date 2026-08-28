import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Patient, PatientRisk } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Check, Search, UserPlus, Users } from "lucide-react";
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

export function PatientsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: api.getPatients,
  });
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState(false);

  const filtered = (data ?? []).filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const handleAdd = () => {
    setAdded(true);
  };

  return (
    <Card className="h-full" data-ocid="doctor.patients_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Users className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("doctor.patients")}
            </CardTitle>
            <CardDescription>{t("doctor.patientsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("doctor.searchPatients")}
            className="pl-9"
            aria-label={t("doctor.searchPatients")}
            data-ocid="doctor.patients.search_input"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3" data-ocid="doctor.patients.loading_state">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.patients.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.patients.empty_state"
          >
            <Users
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("doctor.noPatients")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.slice(0, 4).map((patient, index) => (
              <li
                key={patient.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`doctor.patients.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {patient.name}
                  </p>
                  <Badge variant={riskVariant[patient.risk]}>
                    {t(`doctor.${patient.risk}`)}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("doctor.age")}: {patient.age} · {t("doctor.village")}:{" "}
                  {patient.village}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {t("doctor.conditions")}: {patient.conditions.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-1">
          {added ? (
            <div
              className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
              data-ocid="doctor.patients.success_state"
            >
              <Check className="size-4" aria-hidden="true" />
              {t("doctor.patientAdded")}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleAdd}
              data-ocid="doctor.patients.add_button"
            >
              <UserPlus className="size-4" aria-hidden="true" />
              {t("doctor.addPatient")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
