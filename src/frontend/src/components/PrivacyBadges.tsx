import { useTranslation } from "@/i18n/useTranslation";
import { KeyRound, LogOut, ShieldCheck, UserCheck } from "lucide-react";

const badges = [
  { key: "privacy.secureLogin", icon: ShieldCheck },
  { key: "privacy.authorizedAccess", icon: KeyRound },
  { key: "privacy.roleBasedAccess", icon: UserCheck },
] as const;

export function PrivacyBadges() {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-ocid="privacy.badges"
    >
      {badges.map(({ key, icon: Icon }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          data-ocid={`privacy.badge.${key.split(".")[1]}`}
        >
          <Icon className="size-3.5 text-accent" aria-hidden="true" />
          {t(key)}
        </span>
      ))}
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
        data-ocid="privacy.badge.logout"
      >
        <LogOut className="size-3.5 text-accent" aria-hidden="true" />
        {t("privacy.logout")}
      </span>
    </div>
  );
}
