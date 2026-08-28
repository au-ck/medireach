import { AnalyticsCharts } from "@/components/dashboards/admin/AnalyticsCharts";
import { FacilityMonitoringCard } from "@/components/dashboards/admin/FacilityMonitoringCard";
import { HighRiskPatientsCard } from "@/components/dashboards/admin/HighRiskPatientsCard";
import { KpiCards } from "@/components/dashboards/admin/KpiCards";
import { MedicineAlertsCard } from "@/components/dashboards/admin/MedicineAlertsCard";
import { ReferralsCard } from "@/components/dashboards/admin/ReferralsCard";
import { TeleconsultationTrendsCard } from "@/components/dashboards/admin/TeleconsultationTrendsCard";
import { WaitingTimesCard } from "@/components/dashboards/admin/WaitingTimesCard";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

const QUERY_KEYS = [
  "dashboardSummary",
  "facilities",
  "referrals",
  "medicines",
  "patients",
  "triage",
  "teleconsultations",
  "appointments",
  "diagnostics",
];

export function AdminDashboard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all(
        QUERY_KEYS.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6" data-ocid="admin.page">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
            data-ocid="admin.title"
          >
            {t("admin.title")}
          </h1>
          <p className="mt-1 text-muted-foreground" data-ocid="admin.subtitle">
            {t("admin.subtitle")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void handleRefresh()}
          disabled={refreshing}
          data-ocid="admin.refresh_button"
        >
          <RefreshCw
            className={refreshing ? "animate-spin" : ""}
            aria-hidden="true"
          />
          {t("admin.refresh")}
        </Button>
      </header>

      <KpiCards />

      <section
        aria-label={t("admin.overview")}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3"
        data-ocid="admin.overview_grid"
      >
        <FacilityMonitoringCard />
        <ReferralsCard />
        <MedicineAlertsCard />
        <HighRiskPatientsCard />
        <WaitingTimesCard />
        <TeleconsultationTrendsCard />
      </section>

      <AnalyticsCharts />
    </div>
  );
}
