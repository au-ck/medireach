import { AppointmentsCard } from "@/components/dashboards/doctor/AppointmentsCard";
import { ConsultationsCard } from "@/components/dashboards/doctor/ConsultationsCard";
import { DiagnosticsCard } from "@/components/dashboards/doctor/DiagnosticsCard";
import { FollowUpsCard } from "@/components/dashboards/doctor/FollowUpsCard";
import { MedicalRecordsCard } from "@/components/dashboards/doctor/MedicalRecordsCard";
import { PatientsCard } from "@/components/dashboards/doctor/PatientsCard";
import { PrescriptionsCard } from "@/components/dashboards/doctor/PrescriptionsCard";
import { ReferralsCard } from "@/components/dashboards/doctor/ReferralsCard";
import { TriageCard } from "@/components/dashboards/doctor/TriageCard";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CalendarCheck,
  FileCheck2,
  HeartPulse,
  Users,
} from "lucide-react";

function Kpi({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  tone?: "primary" | "accent" | "warning" | "destructive";
}) {
  const toneClass: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-subtle"
      data-ocid="doctor.kpi"
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

export function DoctorDashboard() {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: api.getDashboardSummary,
  });

  const summary = data ?? {
    totalPatients: 0,
    appointmentsToday: 0,
    pendingReferrals: 0,
    medicinesLow: 0,
  };

  return (
    <div className="flex flex-col gap-6" data-ocid="doctor.page">
      <header
        className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground sm:p-8"
        data-ocid="doctor.welcome_header"
      >
        <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
          {t("roles.doctor")}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
          {t("doctor.greeting")}
        </h1>
        <p className="mt-1 text-sm text-primary-foreground/85">
          {t("doctor.subtitle")}
        </p>
      </header>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label={t("doctor.today")}
        data-ocid="doctor.kpi_row"
      >
        <Kpi
          icon={Users}
          label={t("doctor.totalPatients")}
          value={summary.totalPatients}
          tone="primary"
        />
        <Kpi
          icon={CalendarCheck}
          label={t("doctor.todayAppointments")}
          value={summary.appointmentsToday}
          tone="accent"
        />
        <Kpi
          icon={FileCheck2}
          label={t("doctor.pendingReferrals")}
          value={summary.pendingReferrals}
          tone="warning"
        />
        <Kpi
          icon={HeartPulse}
          label={t("doctor.lowStock")}
          value={summary.medicinesLow}
          tone="destructive"
        />
      </section>

      <section
        className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"
        data-ocid="doctor.cards_grid"
      >
        <PatientsCard />
        <AppointmentsCard />
        <ConsultationsCard />
        <MedicalRecordsCard />
        <TriageCard />
        <PrescriptionsCard />
        <ReferralsCard />
        <DiagnosticsCard />
        <FollowUpsCard />
      </section>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="size-3.5" aria-hidden="true" />
        {t("doctor.subtitle")}
      </p>
    </div>
  );
}
