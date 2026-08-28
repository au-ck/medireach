import { LanguageProvider } from "@/i18n/LanguageContext";
import { api } from "@/lib/api";
import {
  mockAppointments,
  mockDashboardSummary,
  mockDiagnostics,
  mockFacilities,
  mockMedicines,
  mockPatients,
  mockReferrals,
  mockTeleconsultations,
  mockTriage,
} from "@/lib/mockData";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { DoctorDashboard } from "@/pages/DoctorDashboard";
import { PatientDashboard } from "@/pages/PatientDashboard";
import { PharmacistDashboard } from "@/pages/PharmacistDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", () => ({
  api: {
    getPatients: vi.fn(),
    getAppointments: vi.fn(),
    getReferrals: vi.fn(),
    getMedicines: vi.fn(),
    getTeleconsultations: vi.fn(),
    getTriage: vi.fn(),
    getDiagnostics: vi.fn(),
    getFacilities: vi.fn(),
    getDashboardSummary: vi.fn(),
  },
}));

const apiMock = vi.mocked(api);

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>{ui}</LanguageProvider>
    </QueryClientProvider>,
  );
}

describe("Role dashboards", () => {
  beforeEach(() => {
    apiMock.getPatients.mockReset();
    apiMock.getAppointments.mockReset();
    apiMock.getReferrals.mockReset();
    apiMock.getMedicines.mockReset();
    apiMock.getTeleconsultations.mockReset();
    apiMock.getTriage.mockReset();
    apiMock.getDiagnostics.mockReset();
    apiMock.getFacilities.mockReset();
    apiMock.getDashboardSummary.mockReset();

    apiMock.getPatients.mockResolvedValue(mockPatients);
    apiMock.getAppointments.mockResolvedValue(mockAppointments);
    apiMock.getReferrals.mockResolvedValue(mockReferrals);
    apiMock.getMedicines.mockResolvedValue(mockMedicines);
    apiMock.getTeleconsultations.mockResolvedValue(mockTeleconsultations);
    apiMock.getTriage.mockResolvedValue(mockTriage);
    apiMock.getDiagnostics.mockResolvedValue(mockDiagnostics);
    apiMock.getFacilities.mockResolvedValue(mockFacilities);
    apiMock.getDashboardSummary.mockResolvedValue(mockDashboardSummary);
  });

  it("renders the patient dashboard with its key modules", async () => {
    renderWithProviders(<PatientDashboard />);

    expect(screen.getByTestId("patient.page")).toBeInTheDocument();
    expect(screen.getByTestId("patient.appointments_card")).toBeInTheDocument();
    expect(screen.getByTestId("patient.queue_card")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByTestId("patient.appointments.item.1"),
      ).toBeInTheDocument();
    });
  });

  it("renders the pharmacist dashboard with its key modules", async () => {
    renderWithProviders(<PharmacistDashboard />);

    expect(screen.getByTestId("pharmacist.page")).toBeInTheDocument();
    expect(screen.getByTestId("pharmacist.inventory_card")).toBeInTheDocument();
  });

  it("renders the doctor dashboard with KPIs and key modules", async () => {
    renderWithProviders(<DoctorDashboard />);

    expect(screen.getByTestId("doctor.page")).toBeInTheDocument();
    expect(screen.getByTestId("doctor.kpi_row")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId("doctor.kpi").length).toBeGreaterThan(0);
    });
  });

  it("renders the admin dashboard with its overview grid", async () => {
    renderWithProviders(<AdminDashboard />);

    expect(screen.getByTestId("admin.page")).toBeInTheDocument();
    expect(screen.getByTestId("admin.overview_grid")).toBeInTheDocument();
    expect(screen.getByTestId("admin.refresh_button")).toBeInTheDocument();
  });
});
