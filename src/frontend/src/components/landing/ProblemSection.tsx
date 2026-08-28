import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/i18n/useTranslation";
import { Clock, MapPin, WifiOff } from "lucide-react";

const icons = [MapPin, WifiOff, Clock];

export function ProblemSection() {
  const { t } = useTranslation();
  const items = t("landing.problem.items") as unknown as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section
      className="bg-background py-16 md:py-24"
      data-ocid="landing.problem"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-accent"
            data-ocid="landing.problem.badge"
          >
            {t("landing.problem.badge")}
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("landing.problem.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("landing.problem.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Card
                key={item.title}
                className="rounded-2xl border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
                data-ocid={`landing.problem.item.${index + 1}`}
              >
                <CardHeader>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <CardTitle className="mt-3 font-display text-lg">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
