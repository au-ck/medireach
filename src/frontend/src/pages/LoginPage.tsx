import { PrivacyBadges } from "@/components/PrivacyBadges";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/i18n/useTranslation";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

interface RoleOption {
  role: Role;
  icon: typeof UserRound;
  titleKey: string;
  descriptionKey: string;
  route: string;
}

const roleOptions: RoleOption[] = [
  {
    role: "patient",
    icon: UserRound,
    titleKey: "roles.patient",
    descriptionKey: "roles.patientDesc",
    route: "/patient",
  },
  {
    role: "pharmacist",
    icon: Pill,
    titleKey: "roles.pharmacist",
    descriptionKey: "roles.pharmacistDesc",
    route: "/pharmacist",
  },
  {
    role: "doctor",
    icon: Stethoscope,
    titleKey: "roles.doctor",
    descriptionKey: "roles.doctorDesc",
    route: "/doctor",
  },
  {
    role: "admin",
    icon: ClipboardList,
    titleKey: "roles.admin",
    descriptionKey: "roles.adminDesc",
    route: "/admin",
  },
];

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (option: RoleOption) => {
    login(option.role);
    void navigate({ to: option.route });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-subtle">
          <HeartPulse className="size-8" aria-hidden="true" />
        </span>
        <h1
          className="font-display text-3xl font-semibold text-foreground"
          data-ocid="login.title"
        >
          {t("auth.loginTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground" data-ocid="login.subtitle">
          {t("auth.loginSubtitle")}
        </p>
      </div>

      <Card
        className="border-border bg-gradient-subtle shadow-subtle"
        data-ocid="login.card"
      >
        <CardHeader className="items-center text-center">
          <CardTitle className="font-display text-xl">
            {t("auth.chooseRole")}
          </CardTitle>
          <CardDescription>{t("auth.selectRole")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            data-ocid="login.role_list"
          >
            {roleOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-ocid={`login.role.${index + 1}`}
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="flex w-full flex-col gap-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-display text-base font-semibold text-foreground">
                        {t(option.titleKey)}
                      </span>
                      <ArrowRight
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t(option.descriptionKey)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1"
              data-ocid="login.secure_note"
            >
              <ShieldCheck
                className="size-3.5 text-accent"
                aria-hidden="true"
              />
              {t("auth.secureNote")}
            </Badge>
            <p
              className="text-xs text-muted-foreground"
              data-ocid="login.demo_note"
            >
              {t("auth.demoNote")}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center" data-ocid="login.privacy">
        <PrivacyBadges />
      </div>
    </div>
  );
}
