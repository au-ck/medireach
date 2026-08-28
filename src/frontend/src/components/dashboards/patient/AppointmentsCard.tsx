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
import type { Appointment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarPlus, Check, Clock, X } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  Appointment["status"],
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
  const [cancelled, setCancelled] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState(false);

  const upcoming = (data ?? []).filter(
    (a) => a.status !== "cancelled" && !cancelled.has(a.id),
  );

  const handleCancel = (id: string) => {
    setCancelled((prev) => new Set(prev).add(id));
  };

  const handleBook = () => {
    setBooked(true);
  };

  return (
    <Card className="h-full" data-ocid="patient.appointments_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <CalendarDays className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("patient.appointments")}
            </CardTitle>
            <CardDescription>{t("patient.appointmentsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="patient.appointments.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.appointments.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : upcoming.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.appointments.empty_state"
          >
            <CalendarDays
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("patient.noAppointments")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {upcoming.map((appt, index) => (
              <li
                key={appt.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                data-ocid={`patient.appointments.item.${index + 1}`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {appt.doctorName}
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
                    {appt.reason}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleCancel(appt.id)}
                  aria-label={t("patient.cancelAppointment")}
                  data-ocid={`patient.appointments.cancel_button.${index + 1}`}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-1">
          {booked ? (
            <div
              className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
              data-ocid="patient.appointments.success_state"
            >
              <Check className="size-4" aria-hidden="true" />
              {t("patient.appointmentBooked")}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleBook}
              data-ocid="patient.appointments.book_button"
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              {t("patient.bookAppointment")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
