import { PrivacyBadges } from "@/components/PrivacyBadges";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function renderBadges() {
  return render(
    <LanguageProvider>
      <PrivacyBadges />
    </LanguageProvider>,
  );
}

describe("PrivacyBadges", () => {
  it("renders the secure login, authorized access, role-based access, and logout badges", () => {
    renderBadges();

    expect(screen.getByTestId("privacy.badges")).toBeInTheDocument();
    expect(screen.getByTestId("privacy.badge.secureLogin")).toBeInTheDocument();
    expect(
      screen.getByTestId("privacy.badge.authorizedAccess"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("privacy.badge.roleBasedAccess"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("privacy.badge.logout")).toBeInTheDocument();
  });
});
