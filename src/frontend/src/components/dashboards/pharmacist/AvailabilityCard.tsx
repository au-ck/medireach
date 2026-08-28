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
import type { Medicine, MedicineStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, PackageX, TriangleAlert } from "lucide-react";

const statusVariant: Record<
  MedicineStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  low: "outline",
  unavailable: "destructive",
};

export function AvailabilityCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.getMedicines,
  });

  const medicines = data ?? [];
  const inStock = medicines.filter((m) => m.status === "available").length;
  const lowStock = medicines.filter((m) => m.status === "low").length;
  const outOfStock = medicines.filter((m) => m.status === "unavailable").length;

  const summary = [
    {
      key: "inStock",
      label: t("pharmacist.inStock"),
      count: inStock,
      icon: CheckCircle2,
      tone: "text-success",
      bg: "bg-success/10",
    },
    {
      key: "lowStock",
      label: t("pharmacist.lowStock"),
      count: lowStock,
      icon: TriangleAlert,
      tone: "text-warning",
      bg: "bg-warning/10",
    },
    {
      key: "outOfStock",
      label: t("pharmacist.outOfStock"),
      count: outOfStock,
      icon: PackageX,
      tone: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <Card className="h-full" data-ocid="pharmacist.availability_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("pharmacist.availability")}
            </CardTitle>
            <CardDescription>
              {t("pharmacist.availabilityDesc")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="pharmacist.availability.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="pharmacist.availability.error_state"
          >
            <p className="text-sm text-muted-foreground">
              {t("pharmacist.error")}
            </p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("pharmacist.retry")}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {summary.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col items-center gap-1.5 rounded-lg border bg-background p-3 text-center"
                  data-ocid={`pharmacist.availability.${item.key}`}
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-full ${item.bg} ${item.tone}`}
                  >
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-xl font-semibold tabular-nums text-foreground">
                    {item.count}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <ul className="flex flex-col gap-2">
              {medicines.map((medicine, index) => (
                <li
                  key={medicine.id}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2"
                  data-ocid={`pharmacist.availability.item.${index + 1}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {medicine.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {medicine.stock} {t("pharmacist.units")}
                    </p>
                  </div>
                  <Badge variant={statusVariant[medicine.status]}>
                    {t(`status.${medicine.status}`)}
                  </Badge>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
