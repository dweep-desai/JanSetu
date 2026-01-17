import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Unified Digital Public Infrastructure
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              <span className="text-primary">JanSetu</span>
              <br />
              <span className="text-foreground">Your Government</span>
              <br />
              <span className="text-accent">Companion</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Access all government services, schemes, and documents in one unified platform. 
              From healthcare to education, finance to transport – everything at your fingertips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 w-full sm:w-auto"
                onClick={() =>
                  document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Services
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">50M+</p>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">1200+</p>
                  <p className="text-xs text-muted-foreground">Services</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-jansetu-green/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-jansetu-green" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">Secure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-72 md:w-80">
              {/* Phone Frame */}
              <div className="bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-card rounded-[2.5rem] overflow-hidden">
                  {/* Phone Screen Content */}
                  <div className="bg-primary p-6 text-primary-foreground">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm opacity-80">Welcome to</p>
                        <h3 className="text-xl font-bold">JanSetu</h3>
                      </div>
                      <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: "🏥", label: "Health" },
                        { icon: "📚", label: "Education" },
                        { icon: "💰", label: "Finance" },
                        { icon: "🚗", label: "Transport" },
                        { icon: "📄", label: "Documents" },
                        { icon: "➕", label: "More" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-[10px] text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-xl">
                      <p className="text-xs text-muted-foreground">Recent Activity</p>
                      <p className="text-sm font-medium text-foreground">PAN Card Application</p>
                      <p className="text-xs text-jansetu-green">✓ Completed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-card p-3 rounded-xl shadow-lg animate-fade-up">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-jansetu-green/20 rounded-full flex items-center justify-center">
                    <span className="text-jansetu-green text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">Aadhaar Verified</p>
                    <p className="text-[10px] text-muted-foreground">Just now</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-card p-3 rounded-xl shadow-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">500+ Services</p>
                    <p className="text-[10px] text-muted-foreground">Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
