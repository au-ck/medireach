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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Facility, Medicine, MedicineStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Package,
  Pill,
  Search,
  Store,
  TriangleAlert,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = "all" | MedicineStatus;

/**
 * Fictional mapping of which pharmacy locations carry each medicine.
 * Derived from the fictional facility list so the "where to find it"
 * feature is data-driven and trilingual.
 */
const pharmacyStock: Record<string, string[]> = {
  "M-4001": ["Kothapalli PHC", "Community Health Center"],
  "M-4002": ["Kothapalli PHC"],
  "M-4003": ["Community Health Center", "District Hospital"],
  "M-4004": [],
  "M-4005": ["Kothapalli PHC", "Community Health Center", "District Hospital"],
};

const statusMeta: Record<
  MedicineStatus,
  {
    labelKey: string;
    badge: "default" | "secondary" | "destructive";
    icon: typeof CheckCircle2;
  }
> = {
  available: {
    labelKey: "status.available",
    badge: "default",
    icon: CheckCircle2,
  },
  low: { labelKey: "status.low", badge: "secondary", icon: TriangleAlert },
  unavailable: {
    labelKey: "status.unavailable",
    badge: "destructive",
    icon: AlertCircle,
  },
};

function statusTone(status: MedicineStatus): string {
  switch (status) {
    case "available":
      return "bg-success/15 text-success";
    case "low":
      return "bg-warning/15 text-warning";
    case "unavailable":
      return "bg-destructive/15 text-destructive";
  }
}

function MedicineCard({
  medicine,
  facilities,
}: {
  medicine: Medicine;
  facilities: Facility[];
}) {
  const { t } = useTranslation();
  const meta = statusMeta[medicine.status];
  const StatusIcon = meta.icon;
  const locations = pharmacyStock[medicine.id] ?? [];
  const locationNames = locations
    .map((name) => facilities.find((f) => f.name === name)?.name ?? name)
    .filter(Boolean);

  return (
    <Card
      className="gap-4 border-border shadow-sm transition-shadow hover:shadow-md"
      data-ocid="medicine.card"
    >
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${statusTone(medicine.status)}`}
          >
            <Pill className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-semibold text-foreground">
                {medicine.name}
              </h3>
              <Badge
                variant={meta.badge}
                className="gap-1 rounded-full"
                data-ocid="medicine.status_badge"
              >
                <StatusIcon className="size-3" aria-hidden="true" />
                {t(meta.labelKey)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("medicine.category")}: {medicine.category}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Package className="size-4 text-accent" aria-hidden="true" />
                <span className="font-medium text-foreground">
                  {medicine.stock}
                </span>{" "}
                {t("medicine.units")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {t("medicine.expiry")}: {medicine.expiry}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 sm:max-w-[16rem] sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("medicine.availableAt")}
          </p>
          {locationNames.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1.5">
              {locationNames.map((name) => (
                <li
                  key={name}
                  className="inline-flex items-center gap-1.5 text-sm text-foreground"
                  data-ocid="medicine.location"
                >
                  <Store className="size-3.5 text-accent" aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("medicine.notAvailable")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MedicineAvailabilityPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const medicinesQuery = useQuery({
    queryKey: ["medicines"],
    queryFn: () => api.getMedicines(),
  });
  const facilitiesQuery = useQuery({
    queryKey: ["facilities"],
    queryFn: () => api.getFacilities(),
  });

  const medicines = medicinesQuery.data ?? [];
  const facilities = facilitiesQuery.data ?? [];

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return medicines.filter((m) => {
      const matchesStatus = status === "all" || m.status === status;
      const matchesQuery =
        term.length === 0 ||
        m.name.toLowerCase().includes(term) ||
        m.category.toLowerCase().includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [medicines, query, status]);

  const counts = useMemo(
    () => ({
      total: medicines.length,
      available: medicines.filter((m) => m.status === "available").length,
      low: medicines.filter((m) => m.status === "low").length,
      unavailable: medicines.filter((m) => m.status === "unavailable").length,
    }),
    [medicines],
  );

  const hasFilters = query.trim().length > 0 || status !== "all";

  const clearFilters = () => {
    setQuery("");
    setStatus("all");
  };

  const stats = [
    {
      key: "medicine.totalMedicines",
      value: counts.total,
      icon: Package,
      tone: "bg-primary/10 text-primary",
    },
    {
      key: "medicine.inStock",
      value: counts.available,
      icon: CheckCircle2,
      tone: "bg-success/15 text-success",
    },
    {
      key: "medicine.lowStock",
      value: counts.low,
      icon: TriangleAlert,
      tone: "bg-warning/15 text-warning",
    },
    {
      key: "medicine.outOfStock",
      value: counts.unavailable,
      icon: AlertCircle,
      tone: "bg-destructive/15 text-destructive",
    },
  ] as const;

  const loading = medicinesQuery.isLoading || facilitiesQuery.isLoading;
  const error = medicinesQuery.isError || facilitiesQuery.isError;

  return (
    <div className="space-y-6" data-ocid="medicine.page">
      <header className="flex flex-col gap-1">
        <h1
          className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
          data-ocid="medicine.title"
        >
          {t("medicine.title")}
        </h1>
        <p className="text-muted-foreground" data-ocid="medicine.subtitle">
          {t("medicine.subtitle")}
        </p>
      </header>

      {/* Summary stats */}
      <section
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        aria-label={t("medicine.title")}
        data-ocid="medicine.stats"
      >
        {stats.map(({ key, value, icon: Icon, tone }) => (
          <Card
            key={key}
            className="gap-3 border-border bg-gradient-subtle shadow-sm"
            data-ocid="medicine.stat"
          >
            <CardContent className="flex items-center gap-3">
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-semibold text-foreground">
                  {value}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {t(key)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Search + filter */}
      <section
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        aria-label={t("common.search")}
        data-ocid="medicine.filters"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("medicine.searchPlaceholder")}
            className="h-11 pl-9"
            aria-label={t("medicine.searchPlaceholder")}
            data-ocid="medicine.search_input"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <SelectTrigger
            className="h-11 w-full sm:w-48"
            aria-label={t("medicine.status")}
            data-ocid="medicine.status_select"
          >
            <SelectValue placeholder={t("medicine.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("medicine.allStatuses")}</SelectItem>
            <SelectItem value="available">{t("status.available")}</SelectItem>
            <SelectItem value="low">{t("status.low")}</SelectItem>
            <SelectItem value="unavailable">
              {t("status.unavailable")}
            </SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-11"
            data-ocid="medicine.clear_filters"
          >
            <X className="size-4" aria-hidden="true" />
            {t("medicine.clearFilters")}
          </Button>
        )}
      </section>

      {/* Medicine list */}
      <section aria-label={t("medicine.title")} data-ocid="medicine.list">
        {loading ? (
          <div className="space-y-4" data-ocid="medicine.loading_state">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="gap-4 border-border">
                <CardContent className="flex items-center gap-4">
                  <Skeleton className="size-11 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="hidden h-8 w-32 sm:block" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-border" data-ocid="medicine.error_state">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
                <AlertCircle className="size-6" aria-hidden="true" />
              </span>
              <p className="font-medium text-foreground">{t("common.error")}</p>
              <Button
                variant="outline"
                onClick={() => {
                  void medicinesQuery.refetch();
                  void facilitiesQuery.refetch();
                }}
                data-ocid="medicine.retry_button"
              >
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card
            className="border-dashed bg-gradient-subtle"
            data-ocid="medicine.empty_state"
          >
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Search className="size-6" aria-hidden="true" />
              </span>
              <p className="font-display text-lg font-semibold text-foreground">
                {t("medicine.noResults")}
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {t("medicine.noResultsDesc")}
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-1"
                  data-ocid="medicine.clear_filters"
                >
                  {t("medicine.clearFilters")}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                facilities={facilities}
              />
            ))}
          </div>
        )}
      </section>

      {/* Pharmacy locations */}
      <section
        aria-label={t("medicine.pharmacies")}
        data-ocid="medicine.pharmacies"
      >
        <Card className="border-border bg-gradient-subtle shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Store className="size-5 text-accent" aria-hidden="true" />
              {t("medicine.pharmacies")}
            </CardTitle>
            <CardDescription>{t("medicine.pharmaciesDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {facilitiesQuery.isLoading ? (
              <div
                className="space-y-3"
                data-ocid="medicine.pharmacies_loading"
              >
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {facilities.map((facility, index) => {
                  const availableHere = medicines.filter((m) =>
                    (pharmacyStock[m.id] ?? []).includes(facility.name),
                  );
                  return (
                    <li
                      key={facility.id}
                      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm"
                      data-ocid={`medicine.pharmacy.${index + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-display text-sm font-semibold text-foreground">
                            {facility.name}
                          </p>
                          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" aria-hidden="true" />
                            {facility.location}
                          </p>
                        </div>
                        <Badge
                          variant={
                            facility.status === "open"
                              ? "default"
                              : facility.status === "limited"
                                ? "secondary"
                                : "destructive"
                          }
                          className="rounded-full"
                          data-ocid="medicine.pharmacy_status"
                        >
                          {t(`status.${facility.status}`)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {facility.type} · {facility.bedsAvailable}{" "}
                        {t("medicine.beds")}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {availableHere.length > 0 ? (
                          availableHere.map((m) => (
                            <span
                              key={m.id}
                              className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success"
                              data-ocid="medicine.pharmacy_medicine"
                            >
                              <CheckCircle2
                                className="size-3"
                                aria-hidden="true"
                              />
                              {m.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {t("medicine.notAvailable")}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
