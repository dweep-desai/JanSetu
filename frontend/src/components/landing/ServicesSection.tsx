import { 
  Heart, 
  GraduationCap, 
  Wallet, 
  Car,
  Syringe,
  Building,
  CreditCard,
  FileText,
  Train,
  Plane,
  Award,
  Calculator
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const mainServices = [
  {
    icon: Heart,
    title: "Healthcare",
    description: "Access vaccination records, health schemes, hospital information, and ABHA cards",
    color: "text-jansetu-red",
    bgColor: "bg-jansetu-red/10",
    subServices: [
      { icon: Syringe, name: "Vaccination Records" },
      { icon: FileText, name: "ABHA Card" },
      { icon: Building, name: "Hospital Info" },
      { icon: Heart, name: "Health Schemes" },
    ],
  },
  {
    icon: GraduationCap,
    title: "Education & Scholarships",
    description: "Find scholarship portals, university information, and skill development programs",
    color: "text-primary",
    bgColor: "bg-primary/10",
    subServices: [
      { icon: Award, name: "Scholarships" },
      { icon: Building, name: "Universities" },
      { icon: FileText, name: "Certificates" },
      { icon: GraduationCap, name: "Skill Development" },
    ],
  },
  {
    icon: Wallet,
    title: "Finance & Taxation",
    description: "Manage PAN, income tax, GST, CIBIL score, and financial services",
    color: "text-jansetu-green",
    bgColor: "bg-jansetu-green/10",
    subServices: [
      { icon: CreditCard, name: "PAN Services" },
      { icon: Calculator, name: "Income Tax" },
      { icon: FileText, name: "GST Portal" },
      { icon: Wallet, name: "CIBIL Score" },
    ],
  },
  {
    icon: Car,
    title: "Transport & Travel",
    description: "Book railways, metro tickets, apply for driving license, and vehicle RC",
    color: "text-accent",
    bgColor: "bg-accent/10",
    subServices: [
      { icon: Train, name: "Railways" },
      { icon: Plane, name: "Air Travel" },
      { icon: Car, name: "Driving License" },
      { icon: FileText, name: "Vehicle RC" },
    ],
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="section-padding">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Unified Government Services
          </h2>
          <p className="text-muted-foreground text-lg">
            Access all essential government services from one platform. We bring together
            healthcare, education, finance, and transport services for seamless citizen experience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {mainServices.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-border hover:border-primary/30"
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className={`w-7 h-7 ${service.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Sub-services */}
                <div className="grid grid-cols-2 gap-3">
                  {service.subServices.map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <sub.icon className={`w-4 h-4 ${service.color}`} />
                      <span className="text-sm text-foreground">{sub.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
