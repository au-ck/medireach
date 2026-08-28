import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type {
  AppointmentStatus,
  DiagnosticResult,
  PatientRisk,
  Teleconsultation,
} from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

interface Slice {
  name: string;
  value: number;
  fill: string;
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function toSlices<T extends string>(
  items: Array<{ status?: T; risk?: T }>,
  key: "status" | "risk",
  t: (k: string) => string,
): Slice[] {
  const counts = new Map<T, number>();
  for (const item of items) {
    const value = item[key];
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].map(([value, count], index) => ({
    name: t(`status.${value}`),
    value: count,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));
}

function DonutChart({
  title,
  description,
  slices,
  loading,
  error,
  onRetry,
  ocid,
}: {
  title: string;
  description: string;
  slices: Slice[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  ocid: string;
}) {
  const { t } = useTranslation();

  const config = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {};
    slices.forEach((slice, index) => {
      cfg[`slice-${index}`] = { label: slice.name, color: slice.fill };
    });
    return cfg;
  }, [slices]);

  return (
    <Card className="h-full" data-ocid={ocid}>
      <CardHeader>
        <CardTitle className="font-display text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {loading ? (
          <div className="space-y-3" data-ocid={`${ocid}.loading_state`}>
            <Skeleton className="mx-auto size-36 rounded-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid={`${ocid}.error_state`}
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              {t("common.retry")}
            </Button>
          </div>
        ) : slices.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid={`${ocid}.empty_state`}
          >
            <BarChart3
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("admin.noAlerts")}
            </p>
          </div>
        ) : (
          <ChartContainer
            config={config}
            className="mx-auto aspect-square w-full max-w-[220px]"
            data-ocid={`${ocid}.chart`}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                strokeWidth={2}
              >
                {slices.map((slice) => (
                  <Cell key={slice.name} fill={slice.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="flex-wrap"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function AnalyticsCharts() {
  const { t } = useTranslation();

  const appointments = useQuery({
    queryKey: ["appointments"],
    queryFn: api.getAppointments,
  });
  const patients = useQuery({
    queryKey: ["patients"],
    queryFn: api.getPatients,
  });
  const teleconsultations = useQuery({
    queryKey: ["teleconsultations"],
    queryFn: api.getTeleconsultations,
  });
  const diagnostics = useQuery({
    queryKey: ["diagnostics"],
    queryFn: api.getDiagnostics,
  });

  const appointmentSlices = useMemo(
    () =>
      toSlices<AppointmentStatus>(
        (appointments.data ?? []) as Array<{ status: AppointmentStatus }>,
        "status",
        t,
      ),
    [appointments.data, t],
  );
  const patientSlices = useMemo(
    () =>
      toSlices<PatientRisk>(
        (patients.data ?? []) as Array<{ risk: PatientRisk }>,
        "risk",
        t,
      ),
    [patients.data, t],
  );
  const consultationSlices = useMemo(
    () =>
      toSlices<Teleconsultation["status"]>(
        (teleconsultations.data ?? []) as Array<{
          status: Teleconsultation["status"];
        }>,
        "status",
        t,
      ),
    [teleconsultations.data, t],
  );
  const diagnosticSlices = useMemo(
    () =>
      toSlices<DiagnosticResult["status"]>(
        (diagnostics.data ?? []) as Array<{
          status: DiagnosticResult["status"];
        }>,
        "status",
        t,
      ),
    [diagnostics.data, t],
  );

  return (
    <section
      aria-label={t("admin.analytics")}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      data-ocid="admin.analytics_row"
    >
      <DonutChart
        title={t("admin.appointmentsByStatus")}
        description={t("admin.byStatus")}
        slices={appointmentSlices}
        loading={appointments.isLoading}
        error={appointments.isError}
        onRetry={() => void appointments.refetch()}
        ocid="admin.analytics.appointments"
      />
      <DonutChart
        title={t("admin.patientsByRisk")}
        description={t("admin.byRisk")}
        slices={patientSlices}
        loading={patients.isLoading}
        error={patients.isError}
        onRetry={() => void patients.refetch()}
        ocid="admin.analytics.patients"
      />
      <DonutChart
        title={t("admin.consultationsByStatus")}
        description={t("admin.byStatus")}
        slices={consultationSlices}
        loading={teleconsultations.isLoading}
        error={teleconsultations.isError}
        onRetry={() => void teleconsultations.refetch()}
        ocid="admin.analytics.consultations"
      />
      <DonutChart
        title={t("admin.diagnosticsByStatus")}
        description={t("admin.byStatus")}
        slices={diagnosticSlices}
        loading={diagnostics.isLoading}
        error={diagnostics.isError}
        onRetry={() => void diagnostics.refetch()}
        ocid="admin.analytics.diagnostics"
      />
    </section>
  );
}
