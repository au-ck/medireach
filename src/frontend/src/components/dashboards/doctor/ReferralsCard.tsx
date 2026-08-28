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
import type { Referral, ReferralStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightLeft, Check, GitBranch } from "lucide-react";
import { useState } from "react";

const statusVariant: Record<
  ReferralStatus,
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
  const [created, setCreated] = useState(false);

  const referrals = (data ?? []).filter((r) => r.status !== "cancelled");

  const handleCreate = () => {
    setCreated(true);
  };

  return (
    <Card className="h-full" data-ocid="doctor.referrals_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <GitBranch className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("doctor.referrals")}
            </CardTitle>
            <CardDescription>{t("doctor.referralsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div className="space-y-3" data-ocid="doctor.referrals.loading_state">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.referrals.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : referrals.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="doctor.referrals.empty_state"
          >
            <GitBranch
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("doctor.noReferrals")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {referrals.slice(0, 4).map((referral, index) => (
              <li
                key={referral.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`doctor.referrals.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {referral.patientName}
                  </p>
                  <Badge variant={statusVariant[referral.status]}>
                    {t(`status.${referral.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowRightLeft className="size-3.5" aria-hidden="true" />
                  {referral.fromFacility} → {referral.toFacility}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {t("doctor.reason")}: {referral.reason}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-1">
          {created ? (
            <div
              className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
              data-ocid="doctor.referrals.success_state"
            >
              <Check className="size-4" aria-hidden="true" />
              {t("doctor.referralCreated")}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleCreate}
              data-ocid="doctor.referrals.create_button"
            >
              <GitBranch className="size-4" aria-hidden="true" />
              {t("doctor.createReferral")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
