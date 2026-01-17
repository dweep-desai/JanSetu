import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Categories", href: "#categories" },
  { name: "Dashboard", href: "#dashboard" },
  { name: "About", href: "#about" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">J</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">JanSetu</span>
              <span className="text-[10px] text-muted-foreground -mt-1">Your Government Companion</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border py-4 animate-fade-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-left"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex gap-2 px-4 pt-4 border-t border-border mt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
