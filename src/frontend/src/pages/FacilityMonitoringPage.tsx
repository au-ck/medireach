import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Facility } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BedDouble,
  Building2,
  CheckCircle2,
  CircleDot,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = "all" | "open" | "limited" | "closed";

interface FacilityAlert {
  facility: Facility;
  severity: "high" | "medium" | "low";
  reasonKey: string;
}

const statusFilters: StatusFilter[] = ["all", "open", "limited", "closed"];

function getAlert(facility: Facility): FacilityAlert | null {
  const ratio =
    facility.bedsTotal > 0 ? facility.bedsAvailable / facility.bedsTotal : 0;
  if (facility.status === "closed") {
    return {
      facility,
      severity: "high",
      reasonKey: "facility.alertReasonClosed",
    };
  }
  if (facility.status === "limited" && facility.bedsAvailable === 0) {
    return {
      facility,
      severity: "high",
      reasonKey: "facility.alertReasonNoBeds",
    };
  }
  if (facility.status === "limited") {
    return {
      facility,
      severity: "medium",
      reasonKey: "facility.alertReasonLimited",
    };
  }
  if (ratio < 0.2) {
    return {
      facility,
      severity: "medium",
      reasonKey: "facility.alertReasonLowBeds",
    };
  }
  return null;
}

function statusVariant(
  status: Facility["status"],
): "default" | "secondary" | "destructive" {
  if (status === "open") return "default";
  if (status === "limited") return "secondary";
  return "destructive";
}

function severityVariant(
  severity: FacilityAlert["severity"],
): "destructive" | "secondary" | "outline" {
  if (severity === "high") return "destructive";
  if (severity === "medium") return "secondary";
  return "outline";
}

function capacityColor(ratio: number): string {
  if (ratio <= 0.2) return "bg-destructive";
  if (ratio <= 0.5) return "bg-warning";
  return "bg-accent";
}

export function FacilityMonitoringPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const {
    data: facilities,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["facilities"],
    queryFn: () => api.getFacilities(),
  });

  const alerts = useMemo<FacilityAlert[]>(() => {
    if (!facilities) return [];
    return facilities
      .map(getAlert)
      .filter((alert): alert is FacilityAlert => alert !== null)
      .sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.severity] - order[b.severity];
      });
  }, [facilities]);

  const activeAlerts = alerts.filter(
    (alert) => !acknowledged.has(alert.facility.id),
  );

  const filteredFacilities = useMemo(() => {
    if (!facilities) return [];
    if (filter === "all") return facilities;
    return facilities.filter((facility) => facility.status === filter);
  }, [facilities, filter]);

  const openCount = facilities?.filter((f) => f.status === "open").length ?? 0;
  const totalBedsAvailable =
    facilities?.reduce((sum, f) => sum + f.bedsAvailable, 0) ?? 0;

  const handleAcknowledge = (facilityId: string) => {
    setAcknowledged((prev) => {
      const next = new Set(prev);
      next.add(facilityId);
      return next;
    });
  };

  const handleRefresh = () => {
    void refetch();
  };

  const kpis = [
    {
      key: "facility.totalFacilities",
      value: facilities?.length ?? 0,
      icon: Building2,
    },
    {
      key: "facility.openFacilities",
      value: openCount,
      icon: CircleDot,
    },
    {
      key: "facility.bedsAvailable",
      value: totalBedsAvailable,
      icon: BedDouble,
    },
    {
      key: "facility.activeAlerts",
      value: activeAlerts.length,
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="space-y-6" data-ocid="facility.page">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
            data-ocid="facility.title"
          >
            {t("facility.title")}
          </h1>
          <p
            className="mt-1 text-muted-foreground"
            data-ocid="facility.subtitle"
          >
            {t("facility.subtitle")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isFetching}
          data-ocid="facility.refresh_button"
        >
          <RefreshCw
            className={isFetching ? "animate-spin" : ""}
            aria-hidden="true"
          />
          {t("facility.refresh")}
        </Button>
      </header>

      {/* KPI summary */}
      <section
        aria-label={t("facility.statusOverview")}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        data-ocid="facility.kpi_section"
      >
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.key}
              className="border-border bg-gradient-subtle shadow-subtle"
              data-ocid={`facility.kpi.${index + 1}`}
            >
              <CardContent className="flex items-center gap-4 px-6 py-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-muted-foreground">
                    {t(kpi.key)}
                  </p>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {kpi.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Status + capacity overview */}
      <section
        aria-label={t("facility.capacityOverview")}
        data-ocid="facility.overview_section"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              {t("facility.capacityOverview")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("facility.capacityOverviewDesc")}
            </p>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label={t("facility.statusOverview")}
            data-ocid="facility.filter_tabs"
          >
            {statusFilters.map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                role="tab"
                aria-selected={filter === status}
                data-ocid={`facility.filter.${status}`}
              >
                {t(
                  `facility.filter${status.charAt(0).toUpperCase()}${status.slice(1)}`,
                )}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            data-ocid="facility.loading_state"
          >
            {["facility-1", "facility-2", "facility-3"].map((key) => (
              <Card key={key} className="border-border">
                <CardContent className="space-y-3 px-6 py-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Card className="border-border" data-ocid="facility.error_state">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <AlertTriangle
                className="size-8 text-destructive"
                aria-hidden="true"
              />
              <p className="text-muted-foreground">{t("common.error")}</p>
              <Button variant="outline" onClick={handleRefresh}>
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        ) : filteredFacilities.length === 0 ? (
          <Card className="border-border" data-ocid="facility.empty_state">
            <CardContent className="px-6 py-10 text-center text-muted-foreground">
              {t("facility.noFacilities")}
            </CardContent>
          </Card>
        ) : (
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            data-ocid="facility.facility_list"
          >
            {filteredFacilities.map((facility, index) => {
              const ratio =
                facility.bedsTotal > 0
                  ? facility.bedsAvailable / facility.bedsTotal
                  : 0;
              const capacityPercent = Math.round(ratio * 100);
              return (
                <Card
                  key={facility.id}
                  className="border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  data-ocid={`facility.card.${index + 1}`}
                >
                  <CardHeader className="gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                        <Stethoscope className="size-6" aria-hidden="true" />
                      </span>
                      <Badge
                        variant={statusVariant(facility.status)}
                        data-ocid={`facility.status.${index + 1}`}
                      >
                        {t(`status.${facility.status}`)}
                      </Badge>
                    </div>
                    <CardTitle className="font-display text-base">
                      {facility.name}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="size-3.5" aria-hidden="true" />
                        {facility.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {facility.location}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("facility.capacity")}
                      </span>
                      <span className="font-medium text-foreground">
                        {facility.bedsAvailable} {t("facility.of")}{" "}
                        {facility.bedsTotal} {t("facility.beds")}
                      </span>
                    </div>
                    <Progress
                      value={capacityPercent}
                      className={capacityColor(ratio)}
                      aria-label={`${facility.name} ${t("facility.capacity")}`}
                      data-ocid={`facility.capacity.${index + 1}`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {facility.bedsAvailable}{" "}
                      {t("facility.bedsAvailableLabel")}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Alerts */}
      <section
        aria-label={t("facility.alerts")}
        data-ocid="facility.alerts_section"
      >
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("facility.alerts")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("facility.alertsDesc")}
          </p>
        </div>

        {activeAlerts.length === 0 ? (
          <Card
            className="border-border bg-gradient-subtle"
            data-ocid="facility.alerts_empty"
          >
            <CardContent className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <CheckCircle2 className="size-8 text-accent" aria-hidden="true" />
              <p className="text-muted-foreground">{t("facility.noAlerts")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3" data-ocid="facility.alerts_list">
            {activeAlerts.map((alert, index) => (
              <Card
                key={alert.facility.id}
                className="border-border shadow-sm"
                data-ocid={`facility.alert.${index + 1}`}
              >
                <CardContent className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        alert.severity === "high"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      <AlertTriangle className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-sm font-semibold text-foreground">
                          {alert.facility.name}
                        </p>
                        <Badge variant={severityVariant(alert.severity)}>
                          {t(
                            `facility.alert${alert.severity.charAt(0).toUpperCase()}${alert.severity.slice(1)}`,
                          )}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t(alert.reasonKey)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAcknowledge(alert.facility.id)}
                    data-ocid={`facility.alert.acknowledge.${index + 1}`}
                  >
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    {t("facility.acknowledge")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
