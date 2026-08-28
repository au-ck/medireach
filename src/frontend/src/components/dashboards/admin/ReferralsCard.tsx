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
import { ArrowRight, GitPullRequest } from "lucide-react";

const statusVariant: Record<
  ReferralStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  confirmed: "secondary",
  completed: "default",
  cancelled: "destructive",
};

export function ReferralsCard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["referrals"],
    queryFn: api.getReferrals,
  });

  const referrals = data ?? [];

  return (
    <Card className="h-full" data-ocid="admin.referrals_card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <GitPullRequest className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              {t("admin.referrals")}
            </CardTitle>
            <CardDescription>{t("admin.referralsDesc")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading ? (
          <div className="space-y-3" data-ocid="admin.referrals.loading_state">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.referrals.error_state"
          >
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : referrals.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="admin.referrals.empty_state"
          >
            <GitPullRequest
              className="size-8 text-muted-foreground/50"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {t("admin.noAlerts")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {referrals.map((referral, index) => (
              <li
                key={referral.id}
                className="rounded-lg border bg-background p-3"
                data-ocid={`admin.referrals.item.${index + 1}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-foreground">
                    {referral.patientName}
                  </p>
                  <Badge variant={statusVariant[referral.status]}>
                    {t(`status.${referral.status}`)}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{referral.fromFacility}</span>
                  <ArrowRight
                    className="size-3.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span className="truncate">{referral.toFacility}</span>
                </div>
                <p className="mt-1.5 truncate text-xs text-muted-foreground">
                  {referral.reason} · {referral.date}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
