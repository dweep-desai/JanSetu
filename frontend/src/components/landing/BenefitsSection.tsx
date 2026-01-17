import { FileStack, MessageSquare, Receipt, LayoutGrid } from "lucide-react";

const benefits = [
  {
    icon: LayoutGrid,
    title: "All Services at One Place",
    description:
      "Access government services across healthcare, education, finance, and transport from a single unified platform.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: FileStack,
    title: "All Documents at One Place",
    description:
      "Store and access all your important documents like Aadhaar, PAN, certificates, and more securely.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: MessageSquare,
    title: "All Engagements at One Place",
    description:
      "Get support through chatbot, raise grievances, provide feedback, and stay connected with government updates.",
    color: "text-jansetu-green",
    bgColor: "bg-jansetu-green/10",
  },
  {
    icon: Receipt,
    title: "All Transactions at One Place",
    description:
      "Pay bills, track applications, check status updates, and manage all government-related transactions seamlessly.",
    color: "text-jansetu-purple",
    bgColor: "bg-jansetu-purple/10",
  },
];

export const BenefitsSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Why JanSetu?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need, Unified
          </h2>
          <p className="text-muted-foreground text-lg">
            JanSetu brings together all government services, documents, and transactions
            into one seamless experience.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover-lift"
            >
              <div
                className={`w-14 h-14 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
              >
                <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
