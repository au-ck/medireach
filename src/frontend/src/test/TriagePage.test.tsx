import { LanguageProvider } from "@/i18n/LanguageContext";
import { api } from "@/lib/api";
import type { TriageEntry } from "@/lib/types";
import { TriagePage } from "@/pages/TriagePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockTriage: TriageEntry[] = [
  {
    id: "T-1001",
    patientName: "Anita Rao",
    complaint: "Chest pain",
    severity: "critical",
    status: "waiting",
    arrivalTime: "09:12",
  },
  {
    id: "T-1002",
    patientName: "Ravi Kumar",
    complaint: "Mild fever",
    severity: "low",
    status: "treated",
    arrivalTime: "08:40",
  },
];

vi.mock("@/lib/api", () => ({
  api: {
    getTriage: vi.fn(),
  },
}));

const getTriageMock = vi.mocked(api.getTriage);

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TriagePage />
      </LanguageProvider>
    </QueryClientProvider>,
  );
}

describe("TriagePage decision support", () => {
  beforeEach(() => {
    getTriageMock.mockReset();
    getTriageMock.mockResolvedValue(mockTriage);
  });

  it("renders the decision-support badge and emergency warning", async () => {
    renderPage();

    expect(
      screen.getByTestId("triage.decision_support_badge"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("triage.emergency_warning")).toBeInTheDocument();
    expect(
      screen.getByTestId("triage.emergency_call_button"),
    ).toBeInTheDocument();
  });

  it("lists triage entries with their severity and status", async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("triage.list")).toBeInTheDocument();
    });

    expect(screen.getByText("Anita Rao")).toBeInTheDocument();
    expect(screen.getByText("Ravi Kumar")).toBeInTheDocument();
    expect(screen.getByTestId("triage.severity.1")).toBeInTheDocument();
    expect(screen.getByTestId("triage.status.2")).toBeInTheDocument();
  });

  it("opens the clinical guidance dialog for a selected entry", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("triage.list")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("triage.view_guidance.1"));
    expect(screen.getByTestId("triage.guidance_modal")).toBeInTheDocument();
    expect(screen.getByTestId("triage.guidance_title")).toBeInTheDocument();
  });

  it("shows a success state after starting triage on a waiting entry", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("triage.list")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("triage.start_triage.1"));
    expect(screen.getByTestId("triage.success_state")).toBeInTheDocument();
  });
});
