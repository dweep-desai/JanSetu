import { 
  Heart, 
  Shield, 
  ShoppingCart, 
  Car, 
  GraduationCap, 
  Plane,
  ChevronRight,
  Building2,
  Wallet,
  Users,
  FileText,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: Heart,
    title: "Health & Wellness",
    services: ["ABHA Card", "Vaccination", "Ayushman Bharat", "Hospital Locator"],
    color: "from-jansetu-red to-jansetu-red/70",
  },
  {
    icon: Shield,
    title: "Police & Legal",
    services: ["FIR Status", "Cyber Crime", "Legal Aid", "Passport"],
    color: "from-primary to-primary/70",
  },
  {
    icon: ShoppingCart,
    title: "Mera Ration",
    services: ["Ration Card", "Fair Price Shop", "Distribution Status", "e-KYC"],
    color: "from-accent to-accent/70",
  },
  {
    icon: Car,
    title: "Transport",
    services: ["Driving License", "Vehicle RC", "Pollution Check", "Road Tax"],
    color: "from-jansetu-green to-jansetu-green/70",
  },
  {
    icon: GraduationCap,
    title: "Education & Skills",
    services: ["Scholarships", "Skill India", "University Portals", "Certificates"],
    color: "from-jansetu-purple to-jansetu-purple/70",
  },
  {
    icon: Plane,
    title: "Travel",
    services: ["Railways", "Bus Booking", "Metro Cards", "Tourism"],
    color: "from-primary to-accent",
  },
];

const moreCategories = [
  { icon: Building2, name: "Government Jobs" },
  { icon: Wallet, name: "Pensions" },
  { icon: Users, name: "Social Welfare" },
  { icon: FileText, name: "Certificates" },
  { icon: Home, name: "Housing" },
];

export const CategoriesSection = () => {
  return (
    <section id="categories" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Service Categories
          </h2>
          <p className="text-muted-foreground text-lg">
            Browse through various categories to find the government services you need
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} p-5`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {category.title}
                  </h3>
                </div>
              </div>

              {/* Services List */}
              <div className="p-5">
                <ul className="space-y-2">
                  {category.services.map((service, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-primary" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* More Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {moreCategories.map((cat, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
            >
              <cat.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Explore More Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="gap-2">
            Explore All Categories
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
