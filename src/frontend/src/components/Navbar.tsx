import { LanguageSelector } from "@/components/LanguageSelector";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import { HeartPulse, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const roleLabels: Record<Role, string> = {
  patient: "roles.patient",
  pharmacist: "roles.pharmacist",
  doctor: "roles.doctor",
  admin: "roles.admin",
};

export function Navbar() {
  const { t } = useTranslation();
  const { role, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <header
      className="sticky top-0 z-40 border-b bg-card shadow-subtle"
      data-ocid="navbar"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-ocid="navbar.logo"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
              <HeartPulse className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-foreground">
                {t("app.name")}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {t("app.tagline")}
              </span>
            </span>
          </Link>
        </div>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
          data-ocid="navbar.links"
        >
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            activeProps={{ className: "bg-accent text-accent-foreground" }}
            data-ocid="navbar.link.home"
          >
            {t("nav.home")}
          </Link>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              data-ocid="navbar.link.login"
            >
              {t("nav.login")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />

          {isAuthenticated && role ? (
            <div className="hidden items-center gap-2 md:flex">
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-3 py-1"
                data-ocid="navbar.role_badge"
              >
                <ShieldCheck
                  className="size-3.5 text-accent"
                  aria-hidden="true"
                />
                {t(roleLabels[role])}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                data-ocid="navbar.logout_button"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">
                  {t("nav.logout")}
                </span>
              </Button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex"
              data-ocid="navbar.login_button"
            >
              <Button size="sm">{t("nav.login")}</Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t("common.close") : "Menu"}
            aria-expanded={menuOpen}
            data-ocid="navbar.menu_toggle"
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="border-t bg-card px-4 py-3 md:hidden"
          data-ocid="navbar.mobile_menu"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <Link
              to="/"
              className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              onClick={() => setMenuOpen(false)}
              data-ocid="navbar.mobile.home"
            >
              {t("nav.home")}
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                onClick={() => setMenuOpen(false)}
                data-ocid="navbar.mobile.login"
              >
                {t("nav.login")}
              </Link>
            )}
            {isAuthenticated && role && (
              <div className="mt-2 flex items-center justify-between gap-2 border-t pt-3">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-accent/20 text-accent-foreground">
                      {role.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {t(roleLabels[role])}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  data-ocid="navbar.mobile.logout_button"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  {t("nav.logout")}
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
