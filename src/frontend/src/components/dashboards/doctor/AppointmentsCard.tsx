import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, CalendarPlus, Check, Clock } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  AppointmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  scheduled: "secondary",
  completed: "default",
  cancelled: "destructive",
  pending: "outline",
  confirmed: "default",
};

export function AppointmentsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["appointments"],
    queryFn: api.getAppointments,
  });
  const [scheduled, setScheduled] = useState(false);

  const appointments = (data ?? []).filter((a) => a.status !== "cancelled");

  const handleSchedule = () => {
    setScheduled(true);
  };

  return (
    <Card className="h-full" data-ocid="doctor.appointments_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <CalendarCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("doctor.appointments")}
            </CardTitle>
            <CardDescription>{t("doctor.appointmentsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="doctor.appointments.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.appointments.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : appointments.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.appointments.empty_state"
          >
            <CalendarCheck
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("doctor.noAppointments")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {appointments.slice(0, 4).map((appt, index) => (
              <li
                key={appt.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`doctor.appointments.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {appt.patientName}
                  </p>
                  <Badge variant={statusVariant[appt.status]}>
                    {t(`status.${appt.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {appt.date} · {appt.time}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {t("doctor.reason")}: {appt.reason}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-1">
          {scheduled ? (
            <div
              className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
              data-ocid="doctor.appointments.success_state"
            >
              <Check className="size-4" aria-hidden="true" />
              {t("doctor.appointmentScheduled")}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleSchedule}
              data-ocid="doctor.appointments.schedule_button"
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              {t("doctor.scheduleAppointment")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
