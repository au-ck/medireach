import { AvailabilityCard } from "@/components/dashboards/pharmacist/AvailabilityCard";
import { ExpiryAlertsCard } from "@/components/dashboards/pharmacist/ExpiryAlertsCard";
import { InventoryCard } from "@/components/dashboards/pharmacist/InventoryCard";
import { PrescriptionsCard } from "@/components/dashboards/pharmacist/PrescriptionsCard";
import { StockUpdatesCard } from "@/components/dashboards/pharmacist/StockUpdatesCard";
import { useTranslation } from "@/i18n/useTranslation";
import { Pill } from "lucide-react";

export function PharmacistDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6" data-ocid="pharmacist.page">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-subtle">
          <Pill className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("pharmacist.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {t("pharmacist.subtitle")}
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <InventoryCard />
        <StockUpdatesCard />
        <PrescriptionsCard />
        <AvailabilityCard />
        <ExpiryAlertsCard />
      </div>
    </div>
  );
}
