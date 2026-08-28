import { LanguageSelector } from "@/components/LanguageSelector";
import { LANGUAGE_STORAGE_KEY } from "@/i18n";
import { renderWithLanguage } from "@/test/renderApp";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("LanguageSelector", () => {
  it("renders the current language and switches to Telugu and Hindi", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LanguageSelector />);

    // Default language is English.
    const trigger = screen.getByRole("combobox", { name: "Select language" });
    expect(trigger).toHaveTextContent("EN");

    // Switch to Telugu.
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "తెలుగు" }));
    expect(trigger).toHaveTextContent("తెలుగు");

    // Switch to Hindi.
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "हिंदी" }));
    expect(trigger).toHaveTextContent("हिंदी");
  });

  it("persists the selected language to localStorage", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LanguageSelector />);

    const trigger = screen.getByRole("combobox", { name: "Select language" });
    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "हिंदी" }));

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("hi");
  });
});
