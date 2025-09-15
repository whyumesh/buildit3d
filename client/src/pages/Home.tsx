import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-4">Buildit3D</div>
            <p className="text-muted-foreground mb-6">
              Professional 3D printing services for all your prototyping and production needs.
            </p>
            <div className="flex justify-center space-x-6 text-muted-foreground text-sm">
              <span>© 2024 Buildit3D. All rights reserved.</span>
              <span>|</span>
              <button className="hover:text-primary transition-colors hover-elevate">
                Privacy Policy
              </button>
              <span>|</span>
              <button className="hover:text-primary transition-colors hover-elevate">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}