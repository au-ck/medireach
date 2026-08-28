import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/i18n/useTranslation";
import { FileText, KeyRound, Lock, ShieldCheck, UserCheck } from "lucide-react";

const securityFeatures = [
  { key: "landing.privacy.secureLogin", Icon: Lock },
  { key: "landing.privacy.authorizedAccess", Icon: KeyRound },
  { key: "landing.privacy.roleBasedAccess", Icon: UserCheck },
];

export function PrivacyTermsSection() {
  const { t } = useTranslation();

  return (
    <section
      className="bg-background py-16 md:py-24"
      data-ocid="landing.privacy"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-accent"
            data-ocid="landing.privacy.badge"
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {t("landing.privacy.badge")}
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("landing.privacy.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("landing.privacy.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card
            className="rounded-2xl border bg-card shadow-subtle transition-smooth hover:shadow-elevated"
            data-ocid="landing.privacy.policy_card"
          >
            <CardHeader>
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <FileText className="size-6" aria-hidden="true" />
              </span>
              <CardTitle className="mt-3 font-display text-xl">
                {t("landing.privacy.privacyTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {t("landing.privacy.privacyBody")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card
            className="rounded-2xl border bg-card shadow-subtle transition-smooth hover:shadow-elevated"
            data-ocid="landing.privacy.terms_card"
          >
            <CardHeader>
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <ShieldCheck className="size-6" aria-hidden="true" />
              </span>
              <CardTitle className="mt-3 font-display text-xl">
                {t("landing.privacy.termsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {t("landing.privacy.termsBody")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {securityFeatures.map(({ key, Icon }, index) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-5"
              data-ocid={`landing.privacy.feature.${index + 1}`}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="font-display font-semibold text-foreground">
                {t(key)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
