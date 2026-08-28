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
import type { Referral, ReferralStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  FileText,
  Loader2,
  RefreshCw,
  Stethoscope,
  UserRound,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type Filter = "all" | ReferralStatus;

interface TimelineStep {
  key: string;
  titleKey: string;
  descriptionKey: string;
  active: boolean;
}

const FILTERS: Filter[] = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

function statusVariant(status: ReferralStatus) {
  switch (status) {
    case "pending":
      return "secondary" as const;
    case "confirmed":
      return "outline" as const;
    case "completed":
      return "default" as const;
    case "cancelled":
      return "destructive" as const;
  }
}

function buildTimelineSteps(status: ReferralStatus): TimelineStep[] {
  const steps: TimelineStep[] = [
    {
      key: "referred",
      titleKey: "referrals.stepReferred",
      descriptionKey: "referrals.stepReferredDesc",
      active: true,
    },
  ];

  if (status === "cancelled") {
    steps.push({
      key: "cancelled",
      titleKey: "referrals.stepCancelled",
      descriptionKey: "referrals.stepCancelledDesc",
      active: true,
    });
    return steps;
  }

  const reachedConfirmed = status === "confirmed" || status === "completed";
  steps.push({
    key: "confirmed",
    titleKey: "referrals.stepConfirmed",
    descriptionKey: "referrals.stepConfirmedDesc",
    active: reachedConfirmed,
  });
  steps.push({
    key: "handoff",
    titleKey: "referrals.stepHandoff",
    descriptionKey: "referrals.stepHandoffDesc",
    active: reachedConfirmed,
  });
  steps.push({
    key: "completed",
    titleKey: "referrals.stepCompleted",
    descriptionKey: "referrals.stepCompletedDesc",
    active: status === "completed",
  });

  return steps;
}

function ReferralTimeline({ referral }: { referral: Referral }) {
  const { t } = useTranslation();
  const steps = buildTimelineSteps(referral.status);

  return (
    <ol className="relative space-y-6" data-ocid="referrals.timeline">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const Icon = step.active
          ? step.key === "cancelled"
            ? XCircle
            : CheckCircle2
          : Circle;
        return (
          <li key={step.key} className="relative flex gap-4">
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute top-8 left-[15px] h-[calc(100%-2rem)] w-0.5 ${
                  step.active ? "bg-accent" : "bg-border"
                }`}
              />
            )}
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${
                step.active
                  ? step.key === "cancelled"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-accent bg-accent/15 text-accent"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-1">
              <p
                className={`font-display text-sm font-semibold ${
                  step.active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {t(step.titleKey)}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(step.descriptionKey)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ReferralCard({
  referral,
  index,
  onViewTimeline,
}: {
  referral: Referral;
  index: number;
  onViewTimeline: (referral: Referral) => void;
}) {
  const { t } = useTranslation();

  return (
    <Card
      className="border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      data-ocid={`referrals.item.${index + 1}`}
    >
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold text-foreground">
                {referral.patientName}
              </p>
              <p className="text-xs text-muted-foreground">{referral.id}</p>
            </div>
            <Badge
              variant={statusVariant(referral.status)}
              className="ml-auto sm:ml-2"
              data-ocid={`referrals.status.${index + 1}`}
            >
              {t(`status.${referral.status}`)}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-4 text-accent" aria-hidden="true" />
              {referral.fromFacility}
            </span>
            <ArrowRight className="size-4 text-accent" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope className="size-4 text-accent" aria-hidden="true" />
              {referral.toFacility}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-4" aria-hidden="true" />
              {referral.reason}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {referral.date}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 self-start sm:self-center"
          onClick={() => onViewTimeline(referral)}
          data-ocid={`referrals.view_timeline.${index + 1}`}
        >
          <ClipboardList className="size-4" aria-hidden="true" />
          {t("referrals.viewTimeline")}
        </Button>
      </CardContent>
    </Card>
  );
}

export function ReferralsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Referral | null>(null);

  const {
    data: referrals,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["referrals"],
    queryFn: () => api.getReferrals(),
  });

  const filtered = (referrals ?? []).filter(
    (referral) => filter === "all" || referral.status === filter,
  );

  const counts = (referrals ?? []).reduce<Record<Filter, number>>(
    (acc, referral) => {
      acc.all += 1;
      acc[referral.status] += 1;
      return acc;
    },
    { all: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
  );

  return (
    <div className="space-y-6" data-ocid="referrals.page">
      <header className="flex flex-col gap-2">
        <h1
          className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
          data-ocid="referrals.title"
        >
          {t("referrals.title")}
        </h1>
        <p className="text-muted-foreground" data-ocid="referrals.subtitle">
          {t("referrals.subtitle")}
        </p>
      </header>

      <div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        data-ocid="referrals.summary"
      >
        {(["all", "pending", "confirmed", "completed"] as const).map((key) => (
          <Card
            key={key}
            className="border-border bg-gradient-subtle shadow-sm"
            data-ocid={`referrals.summary.${key}`}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <span
                className={`flex size-11 items-center justify-center rounded-xl ${
                  key === "all"
                    ? "bg-primary/10 text-primary"
                    : key === "pending"
                      ? "bg-warning/15 text-warning"
                      : key === "confirmed"
                        ? "bg-accent/15 text-accent"
                        : "bg-success/15 text-success"
                }`}
              >
                {key === "all" ? (
                  <ClipboardList className="size-5" aria-hidden="true" />
                ) : key === "pending" ? (
                  <Loader2 className="size-5" aria-hidden="true" />
                ) : key === "confirmed" ? (
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-semibold text-foreground">
                  {counts[key]}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {key === "all" ? t("referrals.total") : t(`status.${key}`)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as Filter)}
        data-ocid="referrals.filter"
      >
        <TabsList className="w-full flex-wrap sm:w-fit">
          {FILTERS.map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              data-ocid={`referrals.filter.${key}`}
            >
              {key === "all" ? t("referrals.all") : t(`status.${key}`)}
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
          data-ocid="referrals.loading_state"
        >
          <CardContent className="flex items-center justify-center gap-3 p-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            {t("referrals.loading")}
          </CardContent>
        </Card>
      ) : isError ? (
        <Card
          className="border-border bg-card"
          data-ocid="referrals.error_state"
        >
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <XCircle className="size-6" aria-hidden="true" />
            </span>
            <p className="text-muted-foreground">{t("referrals.error")}</p>
            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
              data-ocid="referrals.retry_button"
            >
              <RefreshCw
                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {t("referrals.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card
          className="border-dashed border-border bg-card"
          data-ocid="referrals.empty_state"
        >
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <ClipboardList className="size-6" aria-hidden="true" />
            </span>
            <p className="font-display text-base font-semibold text-foreground">
              {t("referrals.noReferrals")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("referrals.noReferralsDesc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4" data-ocid="referrals.list">
          {filtered.map((referral, index) => (
            <ReferralCard
              key={referral.id}
              referral={referral}
              index={index}
              onViewTimeline={setSelected}
            />
          ))}
        </div>
      )}

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          data-ocid="referrals.timeline_modal"
        >
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle data-ocid="referrals.timeline_title">
                  {t("referrals.timelineTitle")}
                </DialogTitle>
                <DialogDescription>
                  {t("referrals.timelineDesc")}
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <UserRound className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-foreground">
                      {selected.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selected.id}
                    </p>
                  </div>
                  <Badge
                    variant={statusVariant(selected.status)}
                    className="ml-auto"
                  >
                    {t(`status.${selected.status}`)}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2
                      className="size-4 text-accent"
                      aria-hidden="true"
                    />
                    {selected.fromFacility}
                  </span>
                  <ArrowRight
                    className="size-4 text-accent"
                    aria-hidden="true"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <Stethoscope
                      className="size-4 text-accent"
                      aria-hidden="true"
                    />
                    {selected.toFacility}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <ReferralTimeline referral={selected} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
