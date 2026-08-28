import { AboutSection } from "@/components/landing/AboutSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { PrivacyTermsSection } from "@/components/landing/PrivacyTermsSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ServicesSection } from "@/components/landing/ServicesSection";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <PrivacyTermsSection />
    </>
  );
}
