export type Role = "patient" | "pharmacist" | "doctor" | "admin";

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "pending"
  | "confirmed";

export type ReferralStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type MedicineStatus = "available" | "unavailable" | "low";

export type PatientRisk = "stable" | "moderate" | "high" | "critical";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  village: string;
  phone: string;
  risk: PatientRisk;
  conditions: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
}

export interface Referral {
  id: string;
  patientName: string;
  fromFacility: string;
  toFacility: string;
  reason: string;
  date: string;
  status: ReferralStatus;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: MedicineStatus;
  expiry: string;
}

export interface Teleconsultation {
  id: string;
  patientName: string;
  doctorName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

export interface TriageEntry {
  id: string;
  patientName: string;
  complaint: string;
  severity: "low" | "medium" | "high" | "critical";
  arrivalTime: string;
  status: "waiting" | "in-triage" | "treated" | "referred";
}

export interface DiagnosticResult {
  id: string;
  patientName: string;
  test: string;
  result: string;
  date: string;
  status: "pending" | "ready" | "reviewed";
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  bedsAvailable: number;
  bedsTotal: number;
  status: "open" | "closed" | "limited";
}

export interface DashboardSummary {
  totalPatients: number;
  appointmentsToday: number;
  pendingReferrals: number;
  medicinesLow: number;
}
