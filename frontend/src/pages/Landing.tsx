import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { PopularServicesSection } from "@/components/landing/PopularServicesSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreviewSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <PopularServicesSection />
        <BenefitsSection />
        <CategoriesSection />
        <DashboardPreviewSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
