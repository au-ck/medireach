import { Layout } from "@/components/Layout";
import type { Role } from "@/lib/types";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AppointmentsPage } from "@/pages/AppointmentsPage";
import { DiagnosticsPage } from "@/pages/DiagnosticsPage";
import { DoctorDashboard } from "@/pages/DoctorDashboard";
import { FacilityMonitoringPage } from "@/pages/FacilityMonitoringPage";
import { HighRiskFollowUpPage } from "@/pages/HighRiskFollowUpPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { MedicineAvailabilityPage } from "@/pages/MedicineAvailabilityPage";
import { PatientDashboard } from "@/pages/PatientDashboard";
import { PharmacistDashboard } from "@/pages/PharmacistDashboard";
import { ReferralsPage } from "@/pages/ReferralsPage";
import { TeleconsultationPage } from "@/pages/TeleconsultationPage";
import { TriagePage } from "@/pages/TriagePage";
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

interface RouterContext {
  isAuthenticated: boolean;
  role: Role | null;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/patient",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: PatientDashboard,
});

const pharmacistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pharmacist",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: PharmacistDashboard,
});

const doctorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctor",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DoctorDashboard,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminDashboard,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/appointments",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppointmentsPage,
});

const referralsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/referrals",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: ReferralsPage,
});

const teleconsultationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teleconsultation",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: TeleconsultationPage,
});

const triageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/triage",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: TriagePage,
});

const diagnosticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/diagnostics",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DiagnosticsPage,
});

const medicineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/medicine",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: MedicineAvailabilityPage,
});

const highRiskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/high-risk",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: HighRiskFollowUpPage,
});

const facilityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/facility",
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: FacilityMonitoringPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  patientRoute,
  pharmacistRoute,
  doctorRoute,
  adminRoute,
  appointmentsRoute,
  referralsRoute,
  teleconsultationRoute,
  triageRoute,
  diagnosticsRoute,
  medicineRoute,
  highRiskRoute,
  facilityRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: false,
    role: null,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
