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
 * Fictional healthcare data used only for demonstration.
 * All names, records, and figures are invented and do not refer to real people.
 */

export const mockPatients: Patient[] = [
  {
    id: "P-1001",
    name: "Anitha Reddy",
    age: 34,
    gender: "female",
    village: "Kothapalli",
    phone: "+91 90000 10001",
    risk: "high",
    conditions: ["Hypertension", "Type 2 Diabetes"],
  },
  {
    id: "P-1002",
    name: "Ravi Kumar",
    age: 52,
    gender: "male",
    village: "Pedda Mandadi",
    phone: "+91 90000 10002",
    risk: "stable",
    conditions: ["Asthma"],
  },
  {
    id: "P-1003",
    name: "Lakshmi Devi",
    age: 28,
    gender: "female",
    village: "Chintalapudi",
    phone: "+91 90000 10003",
    risk: "moderate",
    conditions: ["Anemia"],
  },
  {
    id: "P-1004",
    name: "Suresh Babu",
    age: 61,
    gender: "male",
    village: "Gopalapuram",
    phone: "+91 90000 10004",
    risk: "critical",
    conditions: ["Coronary Artery Disease", "Hypertension"],
  },
  {
    id: "P-1005",
    name: "Meena Kumari",
    age: 41,
    gender: "female",
    village: "Dwaraka Tirumala",
    phone: "+91 90000 10005",
    risk: "stable",
    conditions: ["Migraine"],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "A-2001",
    patientId: "P-1001",
    patientName: "Anitha Reddy",
    doctorName: "Dr. Nagesh Rao",
    date: "2026-08-28",
    time: "09:30",
    reason: "Blood pressure review",
    status: "scheduled",
  },
  {
    id: "A-2002",
    patientId: "P-1004",
    patientName: "Suresh Babu",
    doctorName: "Dr. Kavitha Sharma",
    date: "2026-08-28",
    time: "11:00",
    reason: "Cardiology follow-up",
    status: "confirmed",
  },
  {
    id: "A-2003",
    patientId: "P-1002",
    patientName: "Ravi Kumar",
    doctorName: "Dr. Nagesh Rao",
    date: "2026-08-28",
    time: "14:15",
    reason: "Asthma check-up",
    status: "pending",
  },
  {
    id: "A-2004",
    patientId: "P-1003",
    patientName: "Lakshmi Devi",
    doctorName: "Dr. Kavitha Sharma",
    date: "2026-08-29",
    time: "10:00",
    reason: "Anemia consultation",
    status: "scheduled",
  },
];

export const mockReferrals: Referral[] = [
  {
    id: "R-3001",
    patientName: "Suresh Babu",
    fromFacility: "Kothapalli PHC",
    toFacility: "District Hospital, Eluru",
    reason: "Cardiac evaluation",
    date: "2026-08-28",
    status: "pending",
  },
  {
    id: "R-3002",
    patientName: "Anitha Reddy",
    fromFacility: "Kothapalli PHC",
    toFacility: "Community Health Center",
    reason: "Diabetic retinopathy screening",
    date: "2026-08-27",
    status: "confirmed",
  },
  {
    id: "R-3003",
    patientName: "Meena Kumari",
    fromFacility: "Chintalapudi PHC",
    toFacility: "District Hospital, Eluru",
    reason: "Neurology consultation",
    date: "2026-08-25",
    status: "completed",
  },
];

export const mockMedicines: Medicine[] = [
  {
    id: "M-4001",
    name: "Amlodipine 5mg",
    category: "Antihypertensive",
    stock: 120,
    unit: "tablets",
    status: "available",
    expiry: "2027-03-01",
  },
  {
    id: "M-4002",
    name: "Metformin 500mg",
    category: "Antidiabetic",
    stock: 18,
    unit: "tablets",
    status: "low",
    expiry: "2026-12-01",
  },
  {
    id: "M-4003",
    name: "Salbutamol Inhaler",
    category: "Respiratory",
    stock: 45,
    unit: "inhalers",
    status: "available",
    expiry: "2027-06-01",
  },
  {
    id: "M-4004",
    name: "ORS Sachets",
    category: "Rehydration",
    stock: 0,
    unit: "sachets",
    status: "unavailable",
    expiry: "2026-10-01",
  },
  {
    id: "M-4005",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    stock: 300,
    unit: "tablets",
    status: "available",
    expiry: "2028-01-01",
  },
];

export const mockTeleconsultations: Teleconsultation[] = [
  {
    id: "T-5001",
    patientName: "Anitha Reddy",
    doctorName: "Dr. Nagesh Rao",
    scheduledAt: "2026-08-28T09:30:00",
    durationMinutes: 20,
    status: "scheduled",
  },
  {
    id: "T-5002",
    patientName: "Ravi Kumar",
    doctorName: "Dr. Kavitha Sharma",
    scheduledAt: "2026-08-28T15:00:00",
    durationMinutes: 15,
    status: "scheduled",
  },
  {
    id: "T-5003",
    patientName: "Lakshmi Devi",
    doctorName: "Dr. Nagesh Rao",
    scheduledAt: "2026-08-27T11:00:00",
    durationMinutes: 20,
    status: "completed",
  },
];

export const mockTriage: TriageEntry[] = [
  {
    id: "G-6001",
    patientName: "Suresh Babu",
    complaint: "Chest pain",
    severity: "critical",
    arrivalTime: "08:45",
    status: "in-triage",
  },
  {
    id: "G-6002",
    patientName: "Meena Kumari",
    complaint: "Severe headache",
    severity: "high",
    arrivalTime: "09:10",
    status: "waiting",
  },
  {
    id: "G-6003",
    patientName: "Ravi Kumar",
    complaint: "Breathing difficulty",
    severity: "medium",
    arrivalTime: "09:40",
    status: "waiting",
  },
  {
    id: "G-6004",
    patientName: "Lakshmi Devi",
    complaint: "Dizziness",
    severity: "low",
    arrivalTime: "10:05",
    status: "treated",
  },
];

export const mockDiagnostics: DiagnosticResult[] = [
  {
    id: "D-7001",
    patientName: "Anitha Reddy",
    test: "Blood Glucose (Fasting)",
    result: "142 mg/dL",
    date: "2026-08-27",
    status: "ready",
  },
  {
    id: "D-7002",
    patientName: "Suresh Babu",
    test: "ECG",
    result: "Abnormal rhythm",
    date: "2026-08-27",
    status: "reviewed",
  },
  {
    id: "D-7003",
    patientName: "Lakshmi Devi",
    test: "Hemoglobin",
    result: "9.8 g/dL",
    date: "2026-08-26",
    status: "ready",
  },
  {
    id: "D-7004",
    patientName: "Ravi Kumar",
    test: "Peak Flow",
    result: "Pending analysis",
    date: "2026-08-28",
    status: "pending",
  },
];

export const mockFacilities: Facility[] = [
  {
    id: "F-8001",
    name: "Kothapalli PHC",
    type: "Primary Health Center",
    location: "Kothapalli",
    bedsAvailable: 4,
    bedsTotal: 10,
    status: "open",
  },
  {
    id: "F-8002",
    name: "Community Health Center",
    type: "CHC",
    location: "Eluru",
    bedsAvailable: 12,
    bedsTotal: 30,
    status: "open",
  },
  {
    id: "F-8003",
    name: "District Hospital",
    type: "District Hospital",
    location: "Eluru",
    bedsAvailable: 0,
    bedsTotal: 120,
    status: "limited",
  },
];

export const mockDashboardSummary: DashboardSummary = {
  totalPatients: 1240,
  appointmentsToday: 18,
  pendingReferrals: 6,
  medicinesLow: 3,
};
