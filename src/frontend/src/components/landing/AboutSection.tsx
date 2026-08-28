import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n/useTranslation";
import { CheckCircle2, HeartHandshake } from "lucide-react";

export function AboutSection() {
  const { t } = useTranslation();
  const points = t("landing.about.points") as unknown as string[];

  return (
    <section className="bg-muted/30 py-16 md:py-24" data-ocid="landing.about">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-accent"
            data-ocid="landing.about.badge"
          >
            {t("landing.about.badge")}
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("landing.about.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("landing.about.subtitle")}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-subtle">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <HeartHandshake className="size-7" aria-hidden="true" />
          </span>
          <ul className="mt-6 space-y-4">
            {points.map((point, index) => (
              <li
                key={point}
                className="flex items-start gap-3 text-base text-foreground"
                data-ocid={`landing.about.point.${index + 1}`}
              >
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
