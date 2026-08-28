import { useAuth } from "@/lib/auth";
import { LoginPage } from "@/pages/LoginPage";
import { renderWithLanguage } from "@/test/renderApp";
import { useNavigate } from "@tanstack/react-router";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const loginMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("@/lib/auth", () => ({
  useAuth: () => ({
    role: null,
    isAuthenticated: false,
    isInitializing: false,
    login: loginMock,
    logout: vi.fn(),
  }),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("Role-based demo login", () => {
  beforeEach(() => {
    loginMock.mockClear();
    navigateMock.mockClear();
  });

  it("lets a user pick the Patient role and navigate to the patient dashboard", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /^Patient/ }));
    expect(loginMock).toHaveBeenCalledWith("patient");
    expect(navigateMock).toHaveBeenCalledWith({ to: "/patient" });
  });

  it("lets a user pick the Pharmacist role and navigate to the pharmacist dashboard", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /^Pharmacist/ }));
    expect(loginMock).toHaveBeenCalledWith("pharmacist");
    expect(navigateMock).toHaveBeenCalledWith({ to: "/pharmacist" });
  });

  it("lets a user pick the Doctor role and navigate to the doctor dashboard", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /^Doctor/ }));
    expect(loginMock).toHaveBeenCalledWith("doctor");
    expect(navigateMock).toHaveBeenCalledWith({ to: "/doctor" });
  });

  it("lets a user pick the Healthcare Admin role and navigate to the admin dashboard", async () => {
    const user = userEvent.setup();
    renderWithLanguage(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /^Healthcare Admin/ }));
    expect(loginMock).toHaveBeenCalledWith("admin");
    expect(navigateMock).toHaveBeenCalledWith({ to: "/admin" });
  });
});
