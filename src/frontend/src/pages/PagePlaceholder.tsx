import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/i18n/useTranslation";
import { Construction } from "lucide-react";

interface PagePlaceholderProps {
  titleKey: string;
  descriptionKey?: string;
}

export function PagePlaceholder({
  titleKey,
  descriptionKey = "errors.pageUnderConstruction",
}: PagePlaceholderProps) {
  const { t } = useTranslation();

  return (
    <Card
      className="mx-auto max-w-2xl border-dashed bg-gradient-subtle"
      data-ocid="page.placeholder"
    >
      <CardHeader className="items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Construction className="size-7" aria-hidden="true" />
        </span>
        <CardTitle className="mt-2 font-display text-xl">
          {t(titleKey)}
        </CardTitle>
        <CardDescription>{t(descriptionKey)}</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        {t("common.welcome")}
      </CardContent>
    </Card>
  );
}
