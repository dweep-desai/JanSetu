import { 
  FileText, 
  CreditCard, 
  Building2, 
  CloudSun,
  ShoppingCart,
  Phone,
  Folder,
  Users,
  Scale,
  Landmark,
  MapPin,
  Shield
} from "lucide-react";

const popularServices = [
  { icon: Users, name: "EPFO Services", color: "bg-primary" },
  { icon: Shield, name: "Aadhaar", color: "bg-accent" },
  { icon: Folder, name: "DigiLocker", color: "bg-jansetu-green" },
  { icon: Building2, name: "e-District", color: "bg-jansetu-purple" },
  { icon: ShoppingCart, name: "Ration Card", color: "bg-jansetu-red" },
  { icon: CloudSun, name: "Weather", color: "bg-primary" },
  { icon: CreditCard, name: "PAN Card", color: "bg-accent" },
  { icon: FileText, name: "Passport", color: "bg-jansetu-green" },
  { icon: Phone, name: "LPG Booking", color: "bg-jansetu-purple" },
  { icon: Scale, name: "Legal Services", color: "bg-jansetu-red" },
  { icon: Landmark, name: "Banking", color: "bg-primary" },
  { icon: MapPin, name: "Land Records", color: "bg-accent" },
];

export const PopularServicesSection = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Popular Services
          </h2>
          <p className="text-muted-foreground">
            Quick access to most used government services
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
          {popularServices.map((service, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer hover-lift"
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <service.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground line-clamp-2">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
