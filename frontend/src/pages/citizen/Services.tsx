import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, CreditCard, GraduationCap, User, Building2, Briefcase,
  Heart, Utensils, Shield, Bus, Plane, Zap, MoreHorizontal,

  ClipboardList, Calculator, BookOpen, AlertCircle, ShoppingCart,
  Landmark, Tractor, HelpCircle, ChevronRight, Grid3X3
} from "lucide-react";
import { ServiceCard, ServiceColorVariant } from "@/components/services/ServiceCard";
import { CategoryCard } from "@/components/services/CategoryCard";
import { ServiceSection } from "@/components/services/ServiceSection";
import { HeroBanner } from "@/components/services/HeroBanner";
import { ServiceTabs } from "@/components/services/ServiceTabs";
import { Button } from "@/components/ui/button";
import { healthServices, emergencyServices, executeServiceAction } from "@/services/serviceDefinitions";

// Service data
const certificateServices = [
  { title: "Birth Certificate", icon: FileText, color: "yellow" as ServiceColorVariant },
  { title: "Income Certificate", icon: CreditCard, color: "green" as ServiceColorVariant },
  { title: "Character Certificate", icon: User, color: "orange" as ServiceColorVariant },
  { title: "Domicile Certificate", icon: Building2, color: "blue" as ServiceColorVariant },
];

const pensionServices = [
  { title: "Current Holding", icon: ClipboardList, color: "cyan" as ServiceColorVariant },
  { title: "Calculator & Process", icon: Calculator, color: "green" as ServiceColorVariant },
  { title: "Passbook", icon: BookOpen, color: "pink" as ServiceColorVariant },
  { title: "Life Certificate", icon: FileText, color: "blue" as ServiceColorVariant },
];

const studentServices = [
  { title: "Institutions and Programs", icon: GraduationCap, color: "yellow" as ServiceColorVariant },
  { title: "Eligibility and Applications", icon: ClipboardList, color: "green" as ServiceColorVariant },
  { title: "Academic Resources", icon: BookOpen, color: "blue" as ServiceColorVariant },
  { title: "Notices and Announcements", icon: AlertCircle, color: "pink" as ServiceColorVariant },
];

const utilityServices = [
  { title: "View Ration Card", icon: ShoppingCart, color: "orange" as ServiceColorVariant },
  { title: "Ration Transaction Details", icon: ClipboardList, color: "green" as ServiceColorVariant },
  { title: "Nearby Ration Shop", icon: Landmark, color: "cyan" as ServiceColorVariant },
  { title: "LPG Gas", icon: Zap, color: "blue" as ServiceColorVariant },
];

const farmerServices = [
  { title: "Certificates & Land Records", icon: FileText, color: "green" as ServiceColorVariant },
  { title: "Livestock (Pashu Bazaar)", icon: Tractor, color: "yellow" as ServiceColorVariant },
  { title: "Market & Products", icon: ShoppingCart, color: "orange" as ServiceColorVariant },
  { title: "Help & Advice", icon: HelpCircle, color: "pink" as ServiceColorVariant },
];

const popularServices = [
  { title: "Generate Life Certificate", subtitle: "Jeevan Pramaan", icon: FileText, color: "green" as ServiceColorVariant },
  { title: "Blood Availability", subtitle: "ORS Patient Portal", icon: Heart, color: "pink" as ServiceColorVariant },
  { title: "ESIC Centre", subtitle: "ESIC", icon: Building2, color: "orange" as ServiceColorVariant },
  { title: "Register Grievance", subtitle: "National Consumer", icon: AlertCircle, color: "yellow" as ServiceColorVariant },
];

const categories = [
  { title: "Farmers", icon: Tractor, color: "cyan" as ServiceColorVariant },
  { title: "Social Security & Pensioners", icon: User, color: "blue" as ServiceColorVariant },
  { title: "Education, Skills & Employment", icon: GraduationCap, color: "green" as ServiceColorVariant },
  { title: "Women, Child & Senior Citizens", icon: Heart, color: "orange" as ServiceColorVariant },
  { title: "Youth, Skills and Employment", icon: Briefcase, color: "yellow" as ServiceColorVariant },
  { title: "BFSI", icon: Landmark, color: "blue" as ServiceColorVariant },
  { title: "e-District Services", icon: Building2, color: "cyan" as ServiceColorVariant },
  { title: "Health & Wellness", icon: Heart, color: "pink" as ServiceColorVariant },
  { title: "Mera Ration", icon: Utensils, color: "cyan" as ServiceColorVariant },
  { title: "Police and Legal", icon: Shield, color: "green" as ServiceColorVariant },
  { title: "Public Grievance", icon: AlertCircle, color: "pink" as ServiceColorVariant },
  { title: "Transport", icon: Bus, color: "orange" as ServiceColorVariant },
  { title: "Travel", icon: Plane, color: "orange" as ServiceColorVariant },
  { title: "Utility & Bill Payments", icon: Zap, color: "cyan" as ServiceColorVariant },
  { title: "General", icon: MoreHorizontal, color: "blue" as ServiceColorVariant },
];

const exploreTabs = [
  { id: "popular", label: "Popular Services" },
  { id: "trending", label: "Trending Services" },
  { id: "new", label: "What's New" },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState("popular");
  const navigate = useNavigate();

  const handleServiceClick = (service: typeof healthServices[0] | typeof emergencyServices[0]) => {
    executeServiceAction(service, { navigate });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* View All Services */}
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto bg-card border border-border rounded-xl hover:bg-secondary"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Grid3X3 className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium text-foreground">View All Services</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Button>

      {/* Hero Banner */}
      <HeroBanner
        title="Plan your Journey in Advance with"
        subtitle="Delhi Metro Services on JanSetu"
        ctaText="Access Delhi Metro"
      />

      {/* Health Services Section */}
      <ServiceSection title="Health Services" viewAllCount={healthServices.length}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <ServiceCard
                key={service.id}
                title={service.title}
                subtitle={service.description}
                icon={IconComponent}
                colorVariant={
                  service.color.includes('pink') ? 'pink' :
                    service.color.includes('blue') ? 'blue' :
                      service.color.includes('red') ? 'orange' :
                        service.color.includes('green') ? 'green' : 'cyan'
                }
                onClick={() => handleServiceClick(service)}
              />
            );
          })}
        </div>
      </ServiceSection>

      {/* Emergency Services Section */}
      <ServiceSection title="Emergency Services" viewAllCount={emergencyServices.length}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <ServiceCard
                key={service.id}
                title={service.title}
                subtitle={service.description}
                icon={IconComponent}
                colorVariant={
                  service.color.includes('orange') ? 'orange' :
                    service.color.includes('pink') ? 'pink' :
                      service.color.includes('blue') ? 'blue' :
                        service.color.includes('red') ? 'orange' : 'cyan'
                }
                onClick={() => handleServiceClick(service)}
              />
            );
          })}
        </div>
      </ServiceSection>

      {/* Certificates Section */}
      <ServiceSection title="Certificates" viewAllCount={9}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certificateServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              icon={service.icon}
              colorVariant={service.color}
            />
          ))}
        </div>
      </ServiceSection>

      {/* Pension Section */}
      <ServiceSection title="Pension">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pensionServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              icon={service.icon}
              colorVariant={service.color}
            />
          ))}
        </div>
      </ServiceSection>

      {/* Student Section */}
      <ServiceSection title="Student">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              icon={service.icon}
              colorVariant={service.color}
            />
          ))}
        </div>
      </ServiceSection>

      {/* Utility Services Section */}
      <ServiceSection title="Utility Services">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {utilityServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              icon={service.icon}
              colorVariant={service.color}
            />
          ))}
        </div>
      </ServiceSection>

      {/* Farmer Section */}
      <ServiceSection title="Farmer">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {farmerServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              icon={service.icon}
              colorVariant={service.color}
            />
          ))}
        </div>
      </ServiceSection>

      {/* Explore Services Section */}
      <section className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Explore Services</h2>
          <Button variant="link" className="text-primary p-0 h-auto font-medium">
            View All (7)
          </Button>
        </div>

        <ServiceTabs
          tabs={exploreTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {popularServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              subtitle={service.subtitle}
              icon={service.icon}
              colorVariant={service.color}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground mb-4">Categories</h2>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.title}
                title={category.title}
                icon={category.icon}
                colorVariant={category.color}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
