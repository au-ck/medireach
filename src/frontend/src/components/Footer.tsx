import { PrivacyBadges } from "@/components/PrivacyBadges";
import { useTranslation } from "@/i18n/useTranslation";
import { HeartPulse } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary" data-ocid="footer">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                <HeartPulse className="size-4" aria-hidden="true" />
              </span>
              <span className="font-display text-base font-semibold text-foreground">
                {t("app.name")}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("footer.about")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {t("footer.contact")}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>{t("footer.help")}</li>
                <li>{t("footer.privacy")}</li>
                <li>{t("footer.terms")}</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3">
            <PrivacyBadges />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {t("app.name")}. {t("footer.rights")}
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-ocid="footer.caffeine_link"
          >
            {t("footer.builtWith")}
          </a>
        </div>
      </div>
    </footer>
  );
}
