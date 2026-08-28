import { AppointmentsCard } from "@/components/dashboards/patient/AppointmentsCard";
import { FollowUpRemindersCard } from "@/components/dashboards/patient/FollowUpRemindersCard";
import { MedicalRecordsCard } from "@/components/dashboards/patient/MedicalRecordsCard";
import { MedicineAvailabilityCard } from "@/components/dashboards/patient/MedicineAvailabilityCard";
import { PrescriptionsCard } from "@/components/dashboards/patient/PrescriptionsCard";
import { QueueStatusCard } from "@/components/dashboards/patient/QueueStatusCard";
import { ReferralsCard } from "@/components/dashboards/patient/ReferralsCard";
import { TeleconsultationCard } from "@/components/dashboards/patient/TeleconsultationCard";
import { useTranslation } from "@/i18n/useTranslation";
import { HeartPulse } from "lucide-react";

export function PatientDashboard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6" data-ocid="patient.page">
      <header
        className="flex flex-col gap-1"
        data-ocid="patient.welcome_header"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-subtle">
            <HeartPulse className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t("patient.greeting")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("patient.subtitle")}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AppointmentsCard />
        <QueueStatusCard />
        <TeleconsultationCard />
        <MedicalRecordsCard />
        <ReferralsCard />
        <PrescriptionsCard />
        <MedicineAvailabilityCard />
        <FollowUpRemindersCard />
      </div>
    </div>
  );
}
