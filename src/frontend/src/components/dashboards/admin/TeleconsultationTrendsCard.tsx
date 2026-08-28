import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Video } from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface WeekPoint {
  week: string;
  consultations: number;
}

/** Returns the Monday of the week containing the given ISO date string. */
function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(`${weekStart}T00:00:00`);
  if (Number.isNaN(d.getTime())) return weekStart;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TeleconsultationTrendsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["teleconsultations"],
    queryFn: api.getTeleconsultations,
  });

  const weekly = useMemo<WeekPoint[]>(() => {
    const counts = new Map<string, number>();
    for (const item of data ?? []) {
      const week = getWeekStart(item.scheduledAt);
      counts.set(week, (counts.get(week) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, consultations]) => ({
        week: formatWeekLabel(week),
        consultations,
      }));
  }, [data]);

  const total = weekly.reduce((sum, point) => sum + point.consultations, 0);

  const chartConfig = {
    consultations: {
      label: t("admin.consultations"),
      color: "var(--chart-2)",
    },
  };

  return (
    <Card className="h-full" data-ocid="admin.teleconsultation_trends_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Video className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("admin.teleconsultationTrends")}
            </CardTitle>
            <CardDescription>
              {t("admin.teleconsultationTrendsDesc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="admin.teleconsultation_trends.loading_state"
          >
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.teleconsultation_trends.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : weekly.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.teleconsultation_trends.empty_state"
          >
            <Video
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("admin.noAlerts")}
            </p>
          </div>
        ) : (
          <>
            <div
              className="flex items-center justify-between rounded-xl bg-gradient-subtle px-4 py-3"
              data-ocid="admin.teleconsultation_trends.summary"
            >
              <span className="text-sm text-muted-foreground">
                {t("admin.thisWeek")}
              </span>
              <span className="font-display text-xl font-semibold text-foreground">
                {total} {t("admin.consultations")}
              </span>
            </div>
            <ChartContainer
              config={chartConfig}
              className="h-44 w-full"
              data-ocid="admin.teleconsultation_trends.chart"
            >
              <AreaChart
                data={weekly}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="consultations"
                  type="natural"
                  fill="var(--color-consultations)"
                  fillOpacity={0.2}
                  stroke="var(--color-consultations)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
