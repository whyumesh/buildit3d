import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Cog, Zap, ArrowRight } from "lucide-react";

interface Service {
  icon: any;
  title: string;
  description: string;
  features: string[];
  price: string;
}

const services: Service[] = [
  {
    icon: Layers,
    title: "Rapid Prototyping",
    description: "Fast, accurate prototypes to validate your designs and concepts",
    features: ["24-48 hour turnaround", "Multiple material options", "Precision testing", "Design validation"],
    price: "Starting at $50"
  },
  {
    icon: Cog,
    title: "Production Parts",
    description: "High-quality end-use parts for manufacturing and industry",
    features: ["Industrial grade materials", "Batch production", "Quality assurance", "Custom finishing"],
    price: "Starting at $100"
  },
  {
    icon: Zap,
    title: "Rush Services",
    description: "Expedited printing for urgent projects and tight deadlines",
    features: ["Same-day delivery", "Priority queue", "24/7 support", "Express shipping"],
    price: "Starting at $200"
  }
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleLearnMore = (serviceName: string) => {
    console.log(`Learn more about ${serviceName} triggered`);
    // TODO: Remove mock functionality - implement service details modal
  };

  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Our 3D Printing Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From rapid prototyping to production-ready parts, we offer comprehensive 3D printing solutions
            tailored to your specific needs and timeline.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden transition-all duration-300 hover-elevate ${
                  hoveredIndex === index ? "scale-105" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-testid={`card-service-${index}`}
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-ring rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-ring rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="pt-4 border-t">
                    <div className="text-2xl font-bold text-primary mb-4">
                      {service.price}
                    </div>
                    
                    <Button
                      onClick={() => handleLearnMore(service.title)}
                      variant="outline"
                      className="w-full group"
                      data-testid={`button-learn-more-${index}`}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-ring/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Need a custom solution or have questions about our services?
          </p>
          <Button
            onClick={() => {
              const element = document.getElementById("contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            size="lg"
            className="bg-gradient-to-r from-primary to-ring"
            data-testid="button-contact-us"
          >
            Contact Us Today
          </Button>
        </div>
      </div>
    </section>
  );
}