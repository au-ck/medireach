import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { TriageEntry } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  HeartPulse,
  Loader2,
  Phone,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
  UserRound,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type SeverityFilter = "all" | TriageEntry["severity"];

const FILTERS: SeverityFilter[] = ["all", "critical", "high", "medium", "low"];

function severityVariant(severity: TriageEntry["severity"]) {
  switch (severity) {
    case "critical":
      return "destructive" as const;
    case "high":
      return "secondary" as const;
    case "medium":
      return "secondary" as const;
    case "low":
      return "outline" as const;
  }
}

function severityBadgeClass(severity: TriageEntry["severity"]) {
  return severity === "high"
    ? "border-warning/40 bg-warning/15 text-warning"
    : "";
}

function severityIcon(severity: TriageEntry["severity"]) {
  switch (severity) {
    case "critical":
      return "bg-destructive/15 text-destructive";
    case "high":
      return "bg-warning/15 text-warning";
    case "medium":
      return "bg-accent/15 text-accent";
    case "low":
      return "bg-primary/10 text-primary";
  }
}

function statusVariant(status: TriageEntry["status"]) {
  switch (status) {
    case "waiting":
      return "secondary" as const;
    case "in-triage":
      return "default" as const;
    case "treated":
      return "outline" as const;
    case "referred":
      return "secondary" as const;
  }
}

function guidanceKey(severity: TriageEntry["severity"]) {
  switch (severity) {
    case "critical":
      return "triage.guidanceCritical";
    case "high":
      return "triage.guidanceHigh";
    case "medium":
      return "triage.guidanceMedium";
    case "low":
      return "triage.guidanceLow";
  }
}

function TriageRow({
  entry,
  index,
  onViewGuidance,
  onStartTriage,
}: {
  entry: TriageEntry;
  index: number;
  onViewGuidance: (entry: TriageEntry) => void;
  onStartTriage: (entry: TriageEntry) => void;
}) {
  const { t } = useTranslation();

  return (
    <Card
      className="border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      data-ocid={`triage.item.${index + 1}`}
    >
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${severityIcon(
              entry.severity,
            )}`}
          >
            {entry.severity === "critical" ? (
              <AlertTriangle className="size-5" aria-hidden="true" />
            ) : (
              <HeartPulse className="size-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-display text-base font-semibold text-foreground">
                {entry.patientName}
              </p>
              <Badge
                variant={severityVariant(entry.severity)}
                className={severityBadgeClass(entry.severity)}
                data-ocid={`triage.severity.${index + 1}`}
              >
                {t(`status.${entry.severity}`)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {entry.complaint}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                {t("triage.arrival")}: {entry.arrivalTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-3.5" aria-hidden="true" />
                {entry.id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <Badge
            variant={statusVariant(entry.status)}
            data-ocid={`triage.status.${index + 1}`}
          >
            {t(`status.${entry.status}`)}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewGuidance(entry)}
            data-ocid={`triage.view_guidance.${index + 1}`}
          >
            <Stethoscope className="size-4" aria-hidden="true" />
            {t("triage.viewGuidance")}
          </Button>
          {entry.status === "waiting" && (
            <Button
              size="sm"
              onClick={() => onStartTriage(entry)}
              data-ocid={`triage.start_triage.${index + 1}`}
            >
              <ArrowRight className="size-4" aria-hidden="true" />
              {t("triage.startTriage")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TriagePage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<SeverityFilter>("all");
  const [selected, setSelected] = useState<TriageEntry | null>(null);
  const [started, setStarted] = useState<string | null>(null);

  const {
    data: entries,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["triage"],
    queryFn: () => api.getTriage(),
  });

  const filtered = (entries ?? []).filter(
    (entry) => filter === "all" || entry.severity === filter,
  );

  const counts = (entries ?? []).reduce<Record<SeverityFilter, number>>(
    (acc, entry) => {
      acc.all += 1;
      acc[entry.severity] += 1;
      return acc;
    },
    { all: 0, critical: 0, high: 0, medium: 0, low: 0 },
  );

  const statusCounts = (entries ?? []).reduce<
    Record<TriageEntry["status"], number>
  >(
    (acc, entry) => {
      acc[entry.status] += 1;
      return acc;
    },
    { waiting: 0, "in-triage": 0, treated: 0, referred: 0 },
  );

  const handleStartTriage = (entry: TriageEntry) => {
    setStarted(entry.id);
    window.setTimeout(() => setStarted(null), 2500);
  };

  return (
    <div className="space-y-6" data-ocid="triage.page">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1
            className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
            data-ocid="triage.title"
          >
            {t("triage.title")}
          </h1>
          <Badge
            variant="outline"
            className="gap-1.5 border-accent/40 bg-accent/10 text-accent"
            data-ocid="triage.decision_support_badge"
          >
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            {t("triage.decisionSupportBadge")}
          </Badge>
        </div>
        <p className="text-muted-foreground" data-ocid="triage.subtitle">
          {t("triage.subtitle")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("triage.decisionSupportNote")}
        </p>
      </header>

      <Card
        className="border-destructive/40 bg-destructive/5"
        data-ocid="triage.emergency_warning"
      >
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <Phone className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-base font-semibold text-foreground">
                {t("triage.emergencyTitle")}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t("triage.emergencyBody")}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            className="shrink-0"
            onClick={() => {
              window.location.href = "tel:108";
            }}
            data-ocid="triage.emergency_call_button"
          >
            <Phone className="size-4" aria-hidden="true" />
            {t("triage.emergencyCall")}
          </Button>
        </CardContent>
      </Card>

      <div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        data-ocid="triage.summary"
      >
        {(
          [
            ["waiting", "triage.waitingCount"],
            ["in-triage", "triage.inTriageCount"],
            ["treated", "triage.treatedCount"],
            ["referred", "triage.referredCount"],
          ] as const
        ).map(([key, labelKey]) => (
          <Card
            key={key}
            className="border-border bg-gradient-subtle shadow-sm"
            data-ocid={`triage.summary.${key}`}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <span
                className={`flex size-11 items-center justify-center rounded-xl ${
                  key === "waiting"
                    ? "bg-warning/15 text-warning"
                    : key === "in-triage"
                      ? "bg-primary/10 text-primary"
                      : key === "treated"
                        ? "bg-success/15 text-success"
                        : "bg-accent/15 text-accent"
                }`}
              >
                {key === "waiting" ? (
                  <Clock className="size-5" aria-hidden="true" />
                ) : key === "in-triage" ? (
                  <Stethoscope className="size-5" aria-hidden="true" />
                ) : key === "treated" ? (
                  <HeartPulse className="size-5" aria-hidden="true" />
                ) : (
                  <ArrowRight className="size-5" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-semibold text-foreground">
                  {statusCounts[key]}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {t(labelKey)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {t("triage.queueSummary")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("triage.queueSummaryDesc")}
        </p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as SeverityFilter)}
        data-ocid="triage.filter"
      >
        <TabsList className="w-full flex-wrap sm:w-fit">
          {FILTERS.map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              data-ocid={`triage.filter.${key}`}
            >
              {key === "all" ? t("triage.all") : t(`status.${key}`)}
              <span className="ml-1 rounded-full bg-muted px-1.5 text-xs text-muted-foreground">
                {counts[key]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Card
          className="border-border bg-card"
          data-ocid="triage.loading_state"
        >
          <CardContent className="flex items-center justify-center gap-3 p-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            {t("triage.loading")}
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="border-border bg-card" data-ocid="triage.error_state">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <XCircle className="size-6" aria-hidden="true" />
            </span>
            <p className="text-muted-foreground">{t("triage.error")}</p>
            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
              data-ocid="triage.retry_button"
            >
              <RefreshCw
                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {t("triage.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card
          className="border-dashed border-border bg-card"
          data-ocid="triage.empty_state"
        >
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Stethoscope className="size-6" aria-hidden="true" />
            </span>
            <p className="font-display text-base font-semibold text-foreground">
              {t("triage.noEntries")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("triage.noEntriesDesc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4" data-ocid="triage.list">
          {filtered.map((entry, index) => (
            <TriageRow
              key={entry.id}
              entry={entry}
              index={index}
              onViewGuidance={setSelected}
              onStartTriage={handleStartTriage}
            />
          ))}
        </div>
      )}

      {started && (
        <Card
          className="border-success/40 bg-success/5"
          data-ocid="triage.success_state"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
              <HeartPulse className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">
                {t("triage.triageStarted")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("triage.triageStartedDesc")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          data-ocid="triage.guidance_modal"
        >
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle data-ocid="triage.guidance_title">
                  {t("triage.guidanceTitle")}
                </DialogTitle>
                <DialogDescription>
                  {t("triage.guidanceFor")} {selected.patientName}
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${severityIcon(
                      selected.severity,
                    )}`}
                  >
                    <HeartPulse className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-foreground">
                      {selected.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selected.complaint}
                    </p>
                  </div>
                  <Badge
                    variant={severityVariant(selected.severity)}
                    className={`ml-auto ${severityBadgeClass(selected.severity)}`}
                  >
                    {t(`status.${selected.severity}`)}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  {t(guidanceKey(selected.severity))}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
