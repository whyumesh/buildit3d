import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Upload } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

export default function ContactSection() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Remove mock functionality - implement real form submission
    console.log('Form submitted:', form);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Quote Request Sent!",
      description: "We'll get back to you within 24 hours with a detailed quote.",
    });
    
    // Reset form
    setForm({
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      timeline: "",
      message: ""
    });
    
    setIsSubmitting(false);
  };

  const handleFileUpload = () => {
    console.log('File upload triggered');
    // TODO: Remove mock functionality - implement file upload
    toast({
      title: "File Upload",
      description: "File upload functionality will be implemented in the full version.",
    });
  };

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Get Your Quote Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your project to life? Fill out the form below and we'll provide you with
            a detailed quote and timeline for your 3D printing needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="mr-3 h-5 w-5 text-primary" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="mailto:buildit3d.services@gmail.com" 
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    buildit3d.services@gmail.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Phone className="mr-3 h-5 w-5 text-primary" />
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <a 
                        href="tel:+919372877291" 
                        className="text-primary hover:text-primary/80 transition-colors font-medium block"
                      >
                        Yash Pawar: +91 93728 77291
                      </a>
                    </div>
                    <div>
                      <a 
                        href="tel:+919082921245" 
                        className="text-primary hover:text-primary/80 transition-colors font-medium block"
                      >
                        Sohan Yerandkar: +91 90829 21245
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">Available Mon-Sat 9AM-7PM IST</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="mr-3 h-5 w-5 text-primary" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      Located in Maharashtra, India
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/BejPh5ueeDmM4NKa7?g_st=aw" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Google Maps
                    </a>
                    <div className="mt-4">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1234567890!2d73.1234567890!3d19.1234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzI0LjQiTiA3M8KwMDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="mr-3 h-5 w-5 text-primary" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We typically respond to quotes within 24 hours
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Emergency projects: Same day response available
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-2xl">Request a Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      data-testid="input-phone"
                    />
                  </div>

                  {/* Project Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-type">Project Type *</Label>
                      <Select value={form.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                        <SelectTrigger data-testid="select-project-type">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prototyping">Rapid Prototyping</SelectItem>
                          <SelectItem value="production">Production Parts</SelectItem>
                          <SelectItem value="architectural">Architectural Models</SelectItem>
                          <SelectItem value="consumer">Consumer Products</SelectItem>
                          <SelectItem value="industrial">Industrial Components</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select value={form.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                        <SelectTrigger data-testid="select-budget">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-500">Under $500</SelectItem>
                          <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                          <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                          <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="over-10000">Over $10,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Project Timeline</Label>
                    <Select value={form.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                      <SelectTrigger data-testid="select-timeline">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rush">Rush (24-48 hours)</SelectItem>
                        <SelectItem value="standard">Standard (3-7 days)</SelectItem>
                        <SelectItem value="flexible">Flexible (1-2 weeks)</SelectItem>
                        <SelectItem value="no-rush">No Rush (2+ weeks)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project Description *</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please describe your project in detail, including dimensions, materials, quantity, and any special requirements..."
                      className="min-h-[120px]"
                      required
                      data-testid="textarea-message"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload Files (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFileUpload}
                      className="w-full justify-start"
                      data-testid="button-upload-files"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload CAD files, sketches, or reference images
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: STL, OBJ, 3MF, STEP, JPG, PNG (Max 10MB each)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="button-submit-quote"
                  >
                    {isSubmitting ? "Sending..." : "Send Quote Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}