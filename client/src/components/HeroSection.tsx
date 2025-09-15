import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@assets/generated_images/3D_printer_hero_background_19d1bb56.png";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWatchDemo = () => {
    console.log('Watch demo triggered');
    // TODO: Remove mock functionality - implement video modal
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Advanced 3D printing technology"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-ring/30 rotate-45 animate-pulse" />
        <div className="absolute top-1/3 right-16 w-8 h-8 bg-ring/20 rounded-full animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border border-primary/40 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-ring rounded-full mr-2 animate-pulse" />
            Professional 3D Printing Services
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Transform Ideas Into
            <span className="bg-gradient-to-r from-primary to-ring bg-clip-text text-transparent">
              {" "}Reality
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Precision 3D printing services for prototyping, production, and everything in between.
            From concept to creation, we bring your vision to life with cutting-edge technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={scrollToContact}
              className="bg-gradient-to-r from-primary to-ring text-primary-foreground px-8 py-4 text-lg font-semibold group"
              data-testid="button-start-project"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleWatchDemo}
              className="px-8 py-4 text-lg font-semibold bg-background/20 backdrop-blur border-primary/30 hover:bg-background/30"
              data-testid="button-watch-demo"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">24h</div>
              <div className="text-muted-foreground">Turnaround Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">99%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}