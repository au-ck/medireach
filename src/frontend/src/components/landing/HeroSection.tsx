import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";

const stats = [
  { valueKey: "landing.hero.stat1Value", labelKey: "landing.hero.stat1Label" },
  { valueKey: "landing.hero.stat2Value", labelKey: "landing.hero.stat2Label" },
  { valueKey: "landing.hero.stat3Value", labelKey: "landing.hero.stat3Label" },
];

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden bg-gradient-subtle"
      data-ocid="landing.hero"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        <div className="animate-fade-in-up">
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full px-3 py-1 text-accent"
            data-ocid="landing.hero.badge"
          >
            <Stethoscope className="size-3.5" aria-hidden="true" />
            {t("landing.hero.badge")}
          </Badge>

          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            {t("landing.hero.title").replace(t("landing.hero.highlight"), "")}
            <span className="text-gradient">
              {" "}
              {t("landing.hero.highlight")}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            {t("landing.hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              data-ocid="landing.hero.primary_button"
              className="inline-flex"
            >
              <Button
                size="lg"
                className="h-12 rounded-full bg-gradient-primary px-7 text-base shadow-subtle transition-smooth hover:shadow-elevated"
              >
                {t("landing.hero.primaryCta")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </Link>
            <a
              href="#services"
              data-ocid="landing.hero.secondary_button"
              className="inline-flex"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-7 text-base"
              >
                {t("landing.hero.secondaryCta")}
              </Button>
            </a>
          </div>

          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            {t("landing.hero.trust")}
          </p>
        </div>

        <div className="relative animate-fade-in-up">
          <div className="animate-float-soft overflow-hidden rounded-3xl border bg-card shadow-elevated">
            <img
              src="/assets/generated/hero-community-health.dim_1200x900.png"
              alt="A healthcare worker in teal scrubs uses a tablet to consult with a family—a mother, father, and young daughter—at an outdoor table in front of a Rural Health Clinic."
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>

      <div className="border-t bg-card/60">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {stats.map((stat, index) => (
            <div
              key={stat.valueKey}
              className="flex items-center gap-4"
              data-ocid={`landing.hero.stat.${index + 1}`}
            >
              <span className="font-display text-3xl font-bold text-gradient">
                {t(stat.valueKey)}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {t(stat.labelKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
