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
import type { Referral } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Eye, Stethoscope } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  Referral["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  confirmed: "default",
  completed: "secondary",
  cancelled: "destructive",
};

export function ReferralsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["referrals"],
    queryFn: api.getReferrals,
  });
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  const active = (data ?? [])
    .filter((r) => r.status !== "cancelled")
    .slice(0, 3);

  const handleView = (id: string) => {
    setViewed((prev) => new Set(prev).add(id));
  };

  return (
    <Card className="h-full" data-ocid="patient.referrals_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Stethoscope className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("patient.referrals")}
            </CardTitle>
            <CardDescription>{t("patient.referralsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div
            className="space-y-3"
            data-ocid="patient.referrals.loading_state"
          >
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.referrals.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : active.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="patient.referrals.empty_state"
          >
            <Stethoscope
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("patient.noReferrals")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {active.map((referral, index) => (
              <li
                key={referral.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`patient.referrals.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {referral.reason}
                  </p>
                  <Badge variant={statusVariant[referral.status]}>
                    {t(`status.${referral.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="truncate">{referral.fromFacility}</span>
                  <ArrowRight
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">{referral.toFacility}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("patient.date")}: {referral.date}
                </p>
                {viewed.has(referral.id) ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
                    data-ocid="patient.referrals.success_state"
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {t("patient.referralViewed")}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleView(referral.id)}
                    data-ocid={`patient.referrals.view_button.${index + 1}`}
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    {t("patient.viewReferral")}
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
