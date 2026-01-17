import { CheckCircle2 } from "lucide-react";

const features = [
  "Unified access to 1500+ government services",
  "Secure document storage with DigiLocker integration",
  "Real-time status tracking for applications",
  "Multi-language support for accessibility",
  "24/7 AI-powered chatbot assistance",
  "Seamless payment gateway integration",
];

export const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              About JanSetu
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Bridging Citizens with Government Services
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              JanSetu is India's unified digital public infrastructure platform that brings together 
              all government services, schemes, and documents under one roof. Our mission is to make 
              government services accessible, transparent, and efficient for every citizen.
            </p>
            <p className="text-muted-foreground mb-8">
              Built on the principles of Digital India, JanSetu leverages cutting-edge technology 
              to provide a seamless experience across healthcare, education, finance, transport, 
              and more.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-jansetu-green shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-jansetu-green/20 rounded-3xl p-8 md:p-12">
              {/* Vision Card */}
              <div className="bg-card rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold text-foreground mb-3">Our Vision</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To create a digitally empowered society where every citizen can access 
                  government services anytime, anywhere, with complete transparency and ease.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-foreground mb-3">Our Mission</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Simplify citizen-government interaction through innovative technology, 
                  reduce bureaucratic hurdles, and ensure inclusive digital governance for all.
                </p>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-lg">
                <p className="text-2xl font-bold text-primary">28+</p>
                <p className="text-xs text-muted-foreground">States Covered</p>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg">
                <p className="text-2xl font-bold text-accent">500+</p>
                <p className="text-xs text-muted-foreground">Districts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
