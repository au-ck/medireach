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
import { BellRing, CalendarClock, Check } from "lucide-react";
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

export function FollowUpRemindersCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["appointments"],
    queryFn: api.getAppointments,
  });
  const [done, setDone] = useState<Set<string>>(new Set());

  const reminders = (data ?? [])
    .filter((a) => a.status !== "cancelled" && !done.has(a.id))
    .slice(0, 3);

  const handleDone = (id: string) => {
    setDone((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="patient.follow_ups_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <BellRing className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("patient.followUps")}
            </CardTitle>
            <CardDescription>{t("patient.followUpsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="patient.follow_ups.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.follow_ups.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : reminders.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.follow_ups.empty_state"
          >
            <BellRing
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("patient.noFollowUps")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {reminders.map((reminder, index) => (
              <li
                key={reminder.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`patient.follow_ups.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {reminder.reason}
                  </p>
                  <Badge variant={statusVariant[reminder.status]}>
                    {t(`status.${reminder.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClock className="size-3.5" aria-hidden="true" />
                  {t("patient.doctor")}: {reminder.doctorName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("patient.date")}: {reminder.date} · {reminder.time}
                </p>
                {done.has(reminder.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="patient.follow_ups.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("patient.followUpDone")}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleDone(reminder.id)}
                    data-ocid={`patient.follow_ups.done_button.${index + 1}`}
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("patient.markDone")}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
