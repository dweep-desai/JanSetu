import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  services: [
    { name: "Healthcare", href: "#" },
    { name: "Education", href: "#" },
    { name: "Finance", href: "#" },
    { name: "Transport", href: "#" },
    { name: "All Services", href: "#" },
  ],
  quickLinks: [
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Help & Support", href: "#" },
    { name: "Feedback", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Accessibility", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">J</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">JanSetu</span>
                <span className="text-[10px] text-background/60 -mt-1">
                  Your Government Companion
                </span>
              </div>
            </div>
            <p className="text-background/70 text-sm mb-6 max-w-sm">
              Unified Digital Public Infrastructure Platform bringing all government 
              services together for seamless citizen experience.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="w-4 h-4" />
                <span>support@jansetu.gov.in</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="w-4 h-4" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="w-4 h-4" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} JanSetu - Government of India. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-background/40">
                An initiative under Digital India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
