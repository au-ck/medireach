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
} from "./mockData";
import type {
  Appointment,
  DashboardSummary,
  DiagnosticResult,
  Facility,
  Medicine,
  Patient,
  Referral,
  Teleconsultation,
  TriageEntry,
} from "./types";

/**
 * Service layer for MediReach data.
 *
 * Every method is async and returns a Promise so a real Spring Boot / REST
 * backend can be swapped in later without touching UI components. Today these
 * resolve from fictional in-memory data after a short simulated latency.
 */

const LATENCY_MS = 250;

function simulateLatency<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), LATENCY_MS);
  });
}

export const api = {
  getPatients(): Promise<Patient[]> {
    return simulateLatency(mockPatients);
  },

  getAppointments(): Promise<Appointment[]> {
    return simulateLatency(mockAppointments);
  },

  getReferrals(): Promise<Referral[]> {
    return simulateLatency(mockReferrals);
  },

  getMedicines(): Promise<Medicine[]> {
    return simulateLatency(mockMedicines);
  },

  getTeleconsultations(): Promise<Teleconsultation[]> {
    return simulateLatency(mockTeleconsultations);
  },

  getTriage(): Promise<TriageEntry[]> {
    return simulateLatency(mockTriage);
  },

  getDiagnostics(): Promise<DiagnosticResult[]> {
    return simulateLatency(mockDiagnostics);
  },

  getFacilities(): Promise<Facility[]> {
    return simulateLatency(mockFacilities);
  },

  getDashboardSummary(): Promise<DashboardSummary> {
    return simulateLatency(mockDashboardSummary);
  },
};
