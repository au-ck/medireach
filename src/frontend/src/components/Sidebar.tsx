import { useTranslation } from "@/i18n/useTranslation";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Building2,
  CalendarDays,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Send,
  ShieldAlert,
  Stethoscope,
  Video,
} from "lucide-react";

interface SidebarLink {
  to: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
}

const moduleLinks: SidebarLink[] = [
  { to: "/appointments", labelKey: "nav.appointments", icon: CalendarDays },
  { to: "/referrals", labelKey: "nav.referrals", icon: Send },
  { to: "/teleconsultation", labelKey: "nav.teleconsultation", icon: Video },
  { to: "/triage", labelKey: "nav.triage", icon: Activity },
  { to: "/diagnostics", labelKey: "nav.diagnostics", icon: FlaskConical },
  { to: "/medicine", labelKey: "nav.medicine", icon: Pill },
  { to: "/high-risk", labelKey: "nav.highRisk", icon: ShieldAlert },
  { to: "/facility", labelKey: "nav.facility", icon: Building2 },
];

const roleHome: Record<
  Role,
  { to: string; labelKey: string; icon: typeof LayoutDashboard }
> = {
  patient: { to: "/patient", labelKey: "nav.patient", icon: HeartPulse },
  pharmacist: { to: "/pharmacist", labelKey: "nav.pharmacist", icon: Pill },
  doctor: { to: "/doctor", labelKey: "nav.doctor", icon: Stethoscope },
  admin: { to: "/admin", labelKey: "nav.admin", icon: LayoutDashboard },
};

export function Sidebar() {
  const { t } = useTranslation();
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated || !role) {
    return null;
  }

  const home = roleHome[role];

  return (
    <aside
      className="hidden w-64 shrink-0 border-r bg-sidebar lg:block"
      aria-label="Dashboard navigation"
      data-ocid="sidebar"
    >
      <nav className="sticky top-16 flex flex-col gap-1 p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("nav.dashboard")}
        </p>
        <Link
          to={home.to}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          activeOptions={{ exact: true }}
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground",
          }}
          data-ocid="sidebar.link.dashboard"
        >
          <home.icon className="size-4 text-accent" aria-hidden="true" />
          {t(home.labelKey)}
        </Link>

        <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("nav.dashboard")}
        </p>
        {moduleLinks.map(({ to, labelKey, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            activeProps={{
              className: "bg-sidebar-accent text-sidebar-accent-foreground",
            }}
            data-ocid={`sidebar.link.${to.replace("/", "")}`}
          >
            <Icon className="size-4 text-accent" aria-hidden="true" />
            {t(labelKey)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
