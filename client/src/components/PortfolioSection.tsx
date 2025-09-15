import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import showcaseImage from "@assets/generated_images/3D_printed_products_showcase_03df019d.png";
import mechanicalImage from "@assets/generated_images/Precision_mechanical_component_c2703b62.png";
import architecturalImage from "@assets/generated_images/Architectural_model_showcase_1382d53c.png";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  timeframe: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Precision Mechanical Components",
    category: "Industrial",
    description: "High-precision mechanical parts for aerospace and automotive applications",
    image: mechanicalImage,
    technologies: ["PLA", "ABS", "PETG"],
    timeframe: "2-3 days"
  },
  {
    id: 2,
    title: "Architectural Scale Models",
    category: "Architecture",
    description: "Detailed scale models for architectural presentations and planning",
    image: architecturalImage,
    technologies: ["PLA", "Resin"],
    timeframe: "1-2 weeks"
  },
  {
    id: 3,
    title: "Product Prototypes",
    category: "Consumer",
    description: "Rapid prototyping for consumer product development and testing",
    image: showcaseImage,
    technologies: ["PLA", "TPU", "Wood Fill"],
    timeframe: "24-48 hours"
  }
];

export default function PortfolioSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleViewProject = (projectTitle: string) => {
    console.log(`View project ${projectTitle} triggered`);
    // TODO: Remove mock functionality - implement project detail modal
  };

  return (
    <section id="portfolio" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of successful 3D printing projects across various industries.
            Each project showcases our commitment to quality, precision, and innovation.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {portfolioItems.map((item) => (
            <Card
              key={item.id}
              className={`group relative overflow-hidden transition-all duration-500 hover-elevate ${
                hoveredId === item.id ? "scale-[1.02]" : ""
              }`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              data-testid={`card-portfolio-${item.id}`}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      onClick={() => handleViewProject(item.title)}
                      variant="outline"
                      size="sm"
                      className="bg-background/90 backdrop-blur"
                      data-testid={`button-view-project-${item.id}`}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Project
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.timeframe}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-primary/5 border-primary/20 text-primary"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who have brought their ideas to life with our
              professional 3D printing services. Let's discuss your project today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                size="lg"
                data-testid="button-get-started"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => console.log('View all projects triggered')}
                data-testid="button-view-all"
              >
                View All Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}