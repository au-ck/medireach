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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Appointment, TriageEntry } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  RefreshCw,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

interface Slot {
  time: string;
  available: boolean;
}

const DOCTORS = [
  { id: "dr-rao", name: "Dr. Nagesh Rao" },
  { id: "dr-sharma", name: "Dr. Kavitha Sharma" },
];

const SLOTS_BY_DOCTOR: Record<string, Slot[]> = {
  "dr-rao": [
    { time: "09:00", available: true },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
  ],
  "dr-sharma": [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
  ],
};

const queueStatusVariant: Record<
  TriageEntry["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  waiting: "outline",
  "in-triage": "secondary",
  treated: "default",
  referred: "destructive",
};

const severityVariant: Record<
  TriageEntry["severity"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive",
};

export function AppointmentsPage() {
  const { t } = useTranslation();
  const [selectedDoctor, setSelectedDoctor] = useState<string>(DOCTORS[0].id);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const [lastBooked, setLastBooked] = useState<string | null>(null);

  const appointmentsQuery = useQuery({
    queryKey: ["appointments"],
    queryFn: api.getAppointments,
  });

  const triageQuery = useQuery({
    queryKey: ["triage"],
    queryFn: api.getTriage,
  });

  const slots = SLOTS_BY_DOCTOR[selectedDoctor] ?? [];

  const queue = useMemo(() => {
    const entries = (triageQuery.data ?? []).filter(
      (entry) => entry.status === "waiting" || entry.status === "in-triage",
    );
    return [...entries].sort((a, b) =>
      a.arrivalTime.localeCompare(b.arrivalTime),
    );
  }, [triageQuery.data]);

  const upcoming = useMemo(() => {
    const base = (appointmentsQuery.data ?? []).filter(
      (a) => a.status !== "cancelled" && a.status !== "completed",
    );
    return [...myAppointments, ...base];
  }, [appointmentsQuery.data, myAppointments]);

  const handleBook = (time: string) => {
    const key = `${selectedDoctor}:${time}`;
    if (bookedSlots.has(key)) return;
    setBookingSlot(key);
    // Simulate a short booking latency so the pending state is visible.
    window.setTimeout(() => {
      const doctor = DOCTORS.find((d) => d.id === selectedDoctor);
      setBookedSlots((prev) => new Set(prev).add(key));
      setMyAppointments((prev) => [
        {
          id: `A-${Date.now()}`,
          patientId: "P-1001",
          patientName: "Anitha Reddy",
          doctorName: doctor?.name ?? "",
          date: "2026-08-28",
          time,
          reason: "General consultation",
          status: "confirmed",
        },
        ...prev,
      ]);
      setBookingSlot(null);
      setLastBooked(time);
    }, 600);
  };

  const handleCancel = (id: string) => {
    setMyAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6" data-ocid="appointments.page">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("appointments.title")}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {t("appointments.subtitle")}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Booking section */}
        <Card className="lg:col-span-3" data-ocid="appointments.booking_card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <CalendarCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle className="font-display text-base">
                  {t("appointments.bookSection")}
                </CardTitle>
                <CardDescription>
                  {t("appointments.bookSectionDesc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="doctor-select"
                className="text-sm font-medium text-foreground"
              >
                {t("appointments.selectDoctor")}
              </label>
              <Select
                value={selectedDoctor}
                onValueChange={(value) => {
                  setSelectedDoctor(value);
                  setLastBooked(null);
                }}
              >
                <SelectTrigger
                  id="doctor-select"
                  className="w-full"
                  data-ocid="appointments.doctor_select"
                >
                  <SelectValue placeholder={t("appointments.selectDoctor")} />
                </SelectTrigger>
                <SelectContent>
                  {DOCTORS.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {t("appointments.selectSlot")}
              </p>
              <fieldset
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                aria-label={t("appointments.selectSlot")}
              >
                {slots.map((slot) => {
                  const key = `${selectedDoctor}:${slot.time}`;
                  const isBooked = bookedSlots.has(key);
                  const isPending = bookingSlot === key;
                  const disabled = !slot.available || isBooked;
                  return (
                    <Button
                      key={key}
                      type="button"
                      variant={isBooked ? "secondary" : "outline"}
                      disabled={disabled || isPending}
                      onClick={() => handleBook(slot.time)}
                      className="h-auto flex-col gap-1 py-3"
                      data-ocid={`appointments.slot.${slot.time.replace(":", "")}`}
                    >
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {slot.time}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isPending
                          ? t("appointments.booking")
                          : isBooked
                            ? t("appointments.booked")
                            : slot.available
                              ? t("appointments.available")
                              : t("appointments.booked")}
                      </span>
                    </Button>
                  );
                })}
              </fieldset>
            </div>

            {lastBooked && (
              <output
                className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-3"
                data-ocid="appointments.booking.success_state"
              >
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-success"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-success">
                    {t("appointments.bookedSuccess")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("appointments.bookedSuccessDesc")}
                  </p>
                </div>
              </output>
            )}
          </CardContent>
        </Card>

        {/* Queue status */}
        <Card className="lg:col-span-2" data-ocid="appointments.queue_card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2 font-display text-base">
                  {t("appointments.queueSection")}
                  <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                    <span
                      className="size-1.5 animate-pulse rounded-full bg-success"
                      aria-hidden="true"
                    />
                    {t("appointments.live")}
                  </span>
                </CardTitle>
                <CardDescription>
                  {t("appointments.queueSectionDesc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {queue.length} {t("appointments.peopleInQueue")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void triageQuery.refetch()}
                disabled={triageQuery.isFetching}
                data-ocid="appointments.queue.refresh_button"
              >
                <RefreshCw
                  className={triageQuery.isFetching ? "animate-spin" : ""}
                  aria-hidden="true"
                />
                {t("appointments.refresh")}
              </Button>
            </div>

            {triageQuery.isLoading ? (
              <div
                className="space-y-3"
                data-ocid="appointments.queue.loading_state"
              >
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : triageQuery.isError ? (
              <div
                className="flex flex-col items-center gap-2 py-6 text-center"
                data-ocid="appointments.queue.error_state"
              >
                <p className="text-sm text-muted-foreground">
                  {t("common.error")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void triageQuery.refetch()}
                >
                  {t("common.retry")}
                </Button>
              </div>
            ) : queue.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 py-6 text-center"
                data-ocid="appointments.queue.empty_state"
              >
                <Activity
                  className="size-8 text-muted-foreground/50"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  {t("appointments.noQueue")}
                </p>
              </div>
            ) : (
              <ol className="flex flex-col gap-2">
                {queue.map((entry, index) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-3 rounded-lg border bg-background p-3"
                    data-ocid={`appointments.queue.item.${index + 1}`}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {entry.patientName}
                        </p>
                        <Badge variant={severityVariant[entry.severity]}>
                          {t(`status.${entry.severity}`)}
                        </Badge>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {t("appointments.arrival")} {entry.arrivalTime} ·{" "}
                        {entry.complaint}
                      </p>
                    </div>
                    <Badge variant={queueStatusVariant[entry.status]}>
                      {t(`status.${entry.status}`)}
                    </Badge>
                  </li>
                ))}
              </ol>
            )}

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="size-3" aria-hidden="true" />
              {t("appointments.lastUpdated")}: {lastUpdated}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Your appointments */}
      <Card data-ocid="appointments.list_card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="font-display text-base">
                {t("appointments.yourAppointments")}
              </CardTitle>
              <CardDescription>
                {t("appointments.yourAppointmentsDesc")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {appointmentsQuery.isLoading ? (
            <div
              className="space-y-3"
              data-ocid="appointments.list.loading_state"
            >
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : upcoming.length === 0 ? (
            <div
              className="flex flex-col items-center gap-2 py-8 text-center"
              data-ocid="appointments.list.empty_state"
            >
              <CalendarClock
                className="size-8 text-muted-foreground/50"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">
                {t("appointments.noAppointments")}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {upcoming.map((appt, index) => (
                <li
                  key={appt.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background p-3"
                  data-ocid={`appointments.list.item.${index + 1}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Stethoscope className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {appt.doctorName}
                        </p>
                        <Badge variant="default">
                          {t(`status.${appt.status}`)}
                        </Badge>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {appt.date} · {appt.time}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <UserRound className="size-3.5" aria-hidden="true" />
                        {appt.reason}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleCancel(appt.id)}
                    data-ocid={`appointments.list.cancel_button.${index + 1}`}
                  >
                    {t("appointments.cancel")}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
