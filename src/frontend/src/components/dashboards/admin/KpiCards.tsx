import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, FileCheck2, HeartPulse, Users } from "lucide-react";

const toneClass: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/15 text-accent",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  tone: "primary" | "accent" | "warning" | "destructive";
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-subtle"
      data-ocid="admin.kpi"
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${toneClass[tone]}`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <p className="font-display text-2xl font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function KpiCards() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: api.getDashboardSummary,
  });

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        data-ocid="admin.kpi.loading_state"
      >
        {["kpi-1", "kpi-2", "kpi-3", "kpi-4"].map((key) => (
          <Skeleton key={key} className="h-[84px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const summary = data ?? {
    totalPatients: 0,
    appointmentsToday: 0,
    pendingReferrals: 0,
    medicinesLow: 0,
  };

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label={t("admin.overview")}
      data-ocid="admin.kpi_row"
    >
      <Kpi
        icon={Users}
        label={t("admin.kpis.totalPatients")}
        value={summary.totalPatients}
        tone="primary"
      />
      <Kpi
        icon={CalendarCheck}
        label={t("admin.kpis.appointmentsToday")}
        value={summary.appointmentsToday}
        tone="accent"
      />
      <Kpi
        icon={FileCheck2}
        label={t("admin.kpis.pendingReferrals")}
        value={summary.pendingReferrals}
        tone="warning"
      />
      <Kpi
        icon={HeartPulse}
        label={t("admin.kpis.medicineAlerts")}
        value={summary.medicinesLow}
        tone="destructive"
      />
    </section>
  );
}
