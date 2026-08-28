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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Appointment, Patient, PatientRisk } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartPulse,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Stethoscope,
  UserRound,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

type RiskFilter = "all" | PatientRisk;

const FILTERS: RiskFilter[] = ["all", "critical", "high", "moderate", "stable"];

function riskVariant(risk: PatientRisk) {
  switch (risk) {
    case "critical":
      return "destructive" as const;
    case "high":
      return "secondary" as const;
    case "moderate":
      return "secondary" as const;
    case "stable":
      return "outline" as const;
  }
}

function riskIconClass(risk: PatientRisk) {
  switch (risk) {
    case "critical":
      return "bg-destructive/15 text-destructive";
    case "high":
      return "bg-warning/15 text-warning";
    case "moderate":
      return "bg-accent/15 text-accent";
    case "stable":
      return "bg-primary/10 text-primary";
  }
}

function appointmentStatusVariant(status: Appointment["status"]) {
  switch (status) {
    case "completed":
      return "outline" as const;
    case "cancelled":
      return "destructive" as const;
    default:
      return "default" as const;
  }
}

function PatientCard({
  patient,
  index,
  onView,
}: {
  patient: Patient;
  index: number;
  onView: (patient: Patient) => void;
}) {
  const { t } = useTranslation();

  return (
    <Card
      className="border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      data-ocid={`highRisk.patient.${index + 1}`}
    >
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${riskIconClass(
              patient.risk,
            )}`}
          >
            {patient.risk === "critical" || patient.risk === "high" ? (
              <AlertTriangle className="size-5" aria-hidden="true" />
            ) : (
              <HeartPulse className="size-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-display text-base font-semibold text-foreground">
                {patient.name}
              </p>
              <Badge
                variant={riskVariant(patient.risk)}
                data-ocid={`highRisk.risk.${index + 1}`}
              >
                {t(`status.${patient.risk}`)}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>
                {t("highRisk.age")}: {patient.age}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden="true" />
                {patient.village}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {patient.conditions.map((condition) => (
            <Badge key={condition} variant="secondary" className="font-normal">
              {condition}
            </Badge>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onView(patient)}
          data-ocid={`highRisk.view_patient.${index + 1}`}
        >
          <UserRound className="size-4" aria-hidden="true" />
          {t("highRisk.viewPatient")}
        </Button>
      </CardContent>
    </Card>
  );
}

function FollowUpRow({
  appointment,
  index,
  onMarkDone,
  onReschedule,
}: {
  appointment: Appointment;
  index: number;
  onMarkDone: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
}) {
  const { t } = useTranslation();

  return (
    <Card
      className="border-border bg-card shadow-sm"
      data-ocid={`highRisk.followup.${index + 1}`}
    >
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <CalendarDays className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-foreground">
              {appointment.patientName}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {appointment.reason}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Stethoscope className="size-3.5" aria-hidden="true" />
                {appointment.doctorName}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {appointment.date} · {appointment.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <Badge
            variant={appointmentStatusVariant(appointment.status)}
            data-ocid={`highRisk.followup.status.${index + 1}`}
          >
            {t(`status.${appointment.status}`)}
          </Badge>
          {appointment.status !== "completed" &&
            appointment.status !== "cancelled" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule(appointment)}
                  data-ocid={`highRisk.reschedule.${index + 1}`}
                >
                  {t("highRisk.reschedule")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => onMarkDone(appointment)}
                  data-ocid={`highRisk.mark_done.${index + 1}`}
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {t("highRisk.markDone")}
                </Button>
              </>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

export function HighRiskFollowUpPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<RiskFilter>("all");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"today" | "upcoming" | "completed">(
    "upcoming",
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedulePatient, setSchedulePatient] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleReason, setScheduleReason] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.getPatients(),
  });

  const appointmentsQuery = useQuery({
    queryKey: ["appointments"],
    queryFn: () => api.getAppointments(),
  });

  const patients = patientsQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];

  const isLoading = patientsQuery.isLoading || appointmentsQuery.isLoading;
  const isError = patientsQuery.isError || appointmentsQuery.isError;

  const highRiskPatients = useMemo(
    () =>
      patients.filter(
        (p) =>
          p.risk === "critical" || p.risk === "high" || p.risk === "moderate",
      ),
    [patients],
  );

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();
    return highRiskPatients.filter(
      (p) =>
        (filter === "all" || p.risk === filter) &&
        (term === "" ||
          p.name.toLowerCase().includes(term) ||
          p.village.toLowerCase().includes(term) ||
          p.conditions.some((c) => c.toLowerCase().includes(term))),
    );
  }, [highRiskPatients, filter, search]);

  const riskCounts = useMemo(
    () =>
      highRiskPatients.reduce<Record<RiskFilter, number>>(
        (acc, p) => {
          acc.all += 1;
          acc[p.risk] += 1;
          return acc;
        },
        { all: 0, critical: 0, high: 0, moderate: 0, stable: 0 },
      ),
    [highRiskPatients],
  );

  const followUps = useMemo(() => {
    const today = "2026-08-28";
    const upcoming = appointments.filter(
      (a) =>
        a.status !== "completed" && a.status !== "cancelled" && a.date >= today,
    );
    const completed = appointments.filter((a) => a.status === "completed");
    return { upcoming, completed };
  }, [appointments]);

  const shownFollowUps =
    tab === "completed" ? followUps.completed : followUps.upcoming;

  const openSchedule = (patient?: Patient) => {
    setSchedulePatient(patient?.name ?? "");
    setScheduleDate("");
    setScheduleTime("");
    setScheduleReason("");
    setScheduleOpen(true);
  };

  const handleSchedule = () => {
    if (!schedulePatient || !scheduleDate || !scheduleTime) return;
    setScheduling(true);
    window.setTimeout(() => {
      setScheduling(false);
      setScheduleOpen(false);
      setFeedback("scheduled");
      window.setTimeout(() => setFeedback(null), 2500);
    }, 600);
  };

  const handleMarkDone = (_appointment: Appointment) => {
    setFeedback("done");
    window.setTimeout(() => setFeedback(null), 2500);
  };

  const handleReschedule = (appointment: Appointment) => {
    setSchedulePatient(appointment.patientName);
    setScheduleDate(appointment.date);
    setScheduleTime(appointment.time);
    setScheduleReason(appointment.reason);
    setScheduleOpen(true);
  };

  const handleRescheduleSubmit = () => {
    if (!schedulePatient || !scheduleDate || !scheduleTime) return;
    setScheduling(true);
    window.setTimeout(() => {
      setScheduling(false);
      setScheduleOpen(false);
      setFeedback("rescheduled");
      window.setTimeout(() => setFeedback(null), 2500);
    }, 600);
  };

  const feedbackKey =
    feedback === "scheduled"
      ? "highRisk.followUpScheduled"
      : feedback === "done"
        ? "highRisk.followUpDone"
        : "highRisk.followUpRescheduled";

  const feedbackDescKey =
    feedback === "scheduled"
      ? "highRisk.followUpScheduledDesc"
      : feedback === "done"
        ? "highRisk.followUpDoneDesc"
        : "highRisk.followUpRescheduledDesc";

  return (
    <div className="space-y-6" data-ocid="highRisk.page">
      <header className="flex flex-col gap-2">
        <h1
          className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
          data-ocid="highRisk.title"
        >
          {t("highRisk.title")}
        </h1>
        <p className="text-muted-foreground" data-ocid="highRisk.subtitle">
          {t("highRisk.subtitle")}
        </p>
      </header>

      <div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        data-ocid="highRisk.summary"
      >
        <Card
          className="border-border bg-gradient-subtle shadow-sm"
          data-ocid="highRisk.summary.patients"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold text-foreground">
                {highRiskPatients.length}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {t("highRisk.highRiskPatients")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-border bg-gradient-subtle shadow-sm"
          data-ocid="highRisk.summary.critical"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <ShieldAlert className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold text-foreground">
                {riskCounts.critical}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {t("highRisk.criticalCount")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-border bg-gradient-subtle shadow-sm"
          data-ocid="highRisk.summary.followups"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold text-foreground">
                {followUps.upcoming.length}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {t("highRisk.followUpsScheduled")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-border bg-gradient-subtle shadow-sm"
          data-ocid="highRisk.summary.due"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold text-foreground">
                {
                  followUps.upcoming.filter((a) => a.date === "2026-08-28")
                    .length
                }
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {t("highRisk.dueThisWeek")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {feedback && (
        <Card
          className="border-success/40 bg-success/5"
          data-ocid="highRisk.success_state"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
              <CheckCircle2 className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">
                {t(feedbackKey)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(feedbackDescKey)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {t("highRisk.riskFlags")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("highRisk.riskFlagsDesc")}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("highRisk.searchPatients")}
            className="pl-9"
            data-ocid="highRisk.search_input"
            aria-label={t("highRisk.searchPatients")}
          />
        </div>
        <Button
          onClick={() => openSchedule()}
          data-ocid="highRisk.schedule_button"
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          {t("highRisk.scheduleFollowUp")}
        </Button>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as RiskFilter)}
        data-ocid="highRisk.filter"
      >
        <TabsList className="w-full flex-wrap sm:w-fit">
          {FILTERS.map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              data-ocid={`highRisk.filter.${key}`}
            >
              {key === "all" ? t("highRisk.all") : t(`status.${key}`)}
              <span className="ml-1 rounded-full bg-muted px-1.5 text-xs text-muted-foreground">
                {riskCounts[key]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Card
          className="border-border bg-card"
          data-ocid="highRisk.loading_state"
        >
          <CardContent className="flex items-center justify-center gap-3 p-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            {t("common.loading")}
          </CardContent>
        </Card>
      ) : isError ? (
        <Card
          className="border-border bg-card"
          data-ocid="highRisk.error_state"
        >
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <XCircle className="size-6" aria-hidden="true" />
            </span>
            <p className="text-muted-foreground">{t("common.error")}</p>
            <Button
              variant="outline"
              onClick={() => {
                void patientsQuery.refetch();
                void appointmentsQuery.refetch();
              }}
              data-ocid="highRisk.retry_button"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : filteredPatients.length === 0 ? (
        <Card
          className="border-dashed border-border bg-card"
          data-ocid="highRisk.empty_state"
        >
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <UserRound className="size-6" aria-hidden="true" />
            </span>
            <p className="font-display text-base font-semibold text-foreground">
              {t("highRisk.noPatients")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="highRisk.patient_list"
        >
          {filteredPatients.map((patient, index) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              index={index}
              onView={setSelectedPatient}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {t("highRisk.followUps")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("highRisk.followUpsDesc")}
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as typeof tab)}
        data-ocid="highRisk.followup_tabs"
      >
        <TabsList className="w-full flex-wrap sm:w-fit">
          <TabsTrigger value="today" data-ocid="highRisk.followup_tab.today">
            {t("highRisk.today")}
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            data-ocid="highRisk.followup_tab.upcoming"
          >
            {t("highRisk.upcoming")}
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            data-ocid="highRisk.followup_tab.completed"
          >
            {t("highRisk.completed")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {shownFollowUps.length === 0 ? (
        <Card
          className="border-dashed border-border bg-card"
          data-ocid="highRisk.followup_empty_state"
        >
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <CalendarDays className="size-6" aria-hidden="true" />
            </span>
            <p className="font-display text-base font-semibold text-foreground">
              {t("highRisk.noFollowUps")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4" data-ocid="highRisk.followup_list">
          {shownFollowUps.map((appointment, index) => (
            <FollowUpRow
              key={appointment.id}
              appointment={appointment}
              index={index}
              onMarkDone={handleMarkDone}
              onReschedule={handleReschedule}
            />
          ))}
        </div>
      )}

      <Dialog
        open={selectedPatient !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPatient(null);
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          data-ocid="highRisk.patient_modal"
        >
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle data-ocid="highRisk.patient_modal_title">
                  {selectedPatient.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedPatient.id} · {selectedPatient.age} ·{" "}
                  {selectedPatient.village}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-1.5">
                {selectedPatient.conditions.map((condition) => (
                  <Badge
                    key={condition}
                    variant="secondary"
                    className="font-normal"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setSelectedPatient(null);
                    openSchedule(selectedPatient);
                  }}
                  data-ocid="highRisk.patient_modal_schedule"
                >
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {t("highRisk.scheduleFollowUp")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={scheduleOpen}
        onOpenChange={(open) => {
          if (!open) setScheduleOpen(false);
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          data-ocid="highRisk.schedule_modal"
        >
          <DialogHeader>
            <DialogTitle data-ocid="highRisk.schedule_title">
              {t("highRisk.scheduleFollowUp")}
            </DialogTitle>
            <DialogDescription>{t("highRisk.followUpsDesc")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-patient">
                {t("highRisk.selectPatient")}
              </Label>
              <Select
                value={schedulePatient}
                onValueChange={setSchedulePatient}
              >
                <SelectTrigger
                  id="schedule-patient"
                  data-ocid="highRisk.schedule_patient"
                >
                  <SelectValue placeholder={t("highRisk.selectPatient")} />
                </SelectTrigger>
                <SelectContent>
                  {highRiskPatients.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-date">{t("highRisk.date")}</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  data-ocid="highRisk.schedule_date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-time">{t("highRisk.time")}</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  data-ocid="highRisk.schedule_time"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule-reason">{t("highRisk.reason")}</Label>
              <Input
                id="schedule-reason"
                value={scheduleReason}
                onChange={(e) => setScheduleReason(e.target.value)}
                placeholder={t("highRisk.reasonPlaceholder")}
                data-ocid="highRisk.schedule_reason"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setScheduleOpen(false)}
              data-ocid="highRisk.schedule_cancel"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={
                feedback === "rescheduled"
                  ? handleRescheduleSubmit
                  : handleSchedule
              }
              disabled={
                scheduling || !schedulePatient || !scheduleDate || !scheduleTime
              }
              data-ocid="highRisk.schedule_submit"
            >
              {scheduling ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  {t("highRisk.scheduling")}
                </>
              ) : (
                <>
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {t("highRisk.schedule")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
