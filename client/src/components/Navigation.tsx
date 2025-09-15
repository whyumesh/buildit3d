import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-2xl font-bold text-primary hover-elevate"
              data-testid="logo-button"
            >
              Builit3D
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => scrollToSection("services")}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors hover-elevate"
                data-testid="nav-services"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors hover-elevate"
                data-testid="nav-portfolio"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors hover-elevate"
                data-testid="nav-contact"
              >
                Contact
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-to-r from-primary to-ring"
              data-testid="button-get-quote"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card rounded-lg mt-2 mb-4">
              <button
                onClick={() => scrollToSection("services")}
                className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium w-full text-left hover-elevate"
                data-testid="mobile-nav-services"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium w-full text-left hover-elevate"
                data-testid="mobile-nav-portfolio"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium w-full text-left hover-elevate"
                data-testid="mobile-nav-contact"
              >
                Contact
              </button>
              <div className="pt-2">
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="w-full bg-gradient-to-r from-primary to-ring"
                  data-testid="mobile-button-get-quote"
                >
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}