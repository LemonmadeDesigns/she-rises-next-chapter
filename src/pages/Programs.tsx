import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import ApplicationModal from "@/components/modals/ApplicationModal";
import { Home, Users, Calendar, Phone, Mail } from "lucide-react";

const Programs = () => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const programs = [
    {
      id: "transitional-housing",
      title: "Transitional Housing",
      subtitle: "Launching 2025",
      icon: Home,
      description: "Safe and supportive shared housing for women transitioning from incarceration, homelessness, or unstable environments. Our home provides structure, stability, and individualized support as women work toward independence.",
      features: [
        "Safe, structured shared housing",
        "Case management & individualized goal planning",
        "Life skills, empowerment, and reentry support",
        "Employment readiness resources",
        "Referrals for healthcare, mental health, childcare, and legal aid"
      ],
      capacity: "Housing for multiple women at our current San Bernardino County home. Expansion planned to serve dozens of women across multiple sites in Southern California by 2026.",
      color: "bg-royal-plum"
    },
    {
      id: "reentry-support",
      title: "Reentry Support & Empowerment Services",
      subtitle: "",
      icon: Users,
      description: "Community-based services designed to support women reentering society or seeking stability after crisis or hardship.",
      features: [
        "Resume building & job search assistance",
        "Support with IDs, benefits, and documentation",
        "Appointment and court support",
        "Resource navigation (housing, employment, education, childcare, etc.)",
        "Empowerment workshops & peer support"
      ],
      availability: "Open to women throughout Southern California.",
      color: "bg-lotus-rose"
    },
    {
      id: "community-outreach",
      title: "Community Outreach & Events",
      subtitle: "",
      icon: Calendar,
      description: "She Rises actively engages in outreach efforts to connect women with essential community resources, partners, and support networks.",
      recentEvents: [
        "HIRE Reentry Resource Fair — Anaheim",
        "RCC Rising Scholars Fall Festival — Riverside"
      ],
      upcoming: "Additional community events, workshops, and outreach activities will be announced throughout 2025.",
      color: "bg-crown-gold"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Our Programs"
        subtitle="She Rises provides supportive services to help women rebuild their lives with dignity, stability, and purpose. As a growing organization, our programs are launching in phases throughout 2025–2026 to meet the needs of justice-impacted and at-risk women across Southern California."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
            onClick={() => setIsApplicationModalOpen(true)}
          >
            Contact Us About Programs
          </Button>
          <a href="#our-programs">
            <Button size="lg" className="hero-button-secondary btn-force-visible">
              Learn More
            </Button>
          </a>
        </div>
      </Hero>

      {/* Programs Section */}
      <section id="our-programs" className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {programs.map((program, index) => (
              <Card key={program.id} className="overflow-hidden shadow-soft">
                <CardContent className="p-0">
                  <div className="md:flex">
                    {/* Icon/Visual Section */}
                    <div className={`${program.color} p-8 md:w-1/4 flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <program.icon className="h-10 w-10 text-white" />
                        </div>
                        {program.subtitle && (
                          <Badge className="bg-white/90 text-royal-plum font-semibold">
                            {program.subtitle}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:w-3/4">
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-royal-plum mb-4">
                        {program.title}
                      </h3>

                      <p className="text-muted-foreground text-lg mb-6">
                        {program.description}
                      </p>

                      {/* Features */}
                      {program.features && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-royal-plum mb-3">
                            {program.id === "transitional-housing" ? "Program Features:" : "Services Include:"}
                          </h4>
                          <ul className="space-y-2">
                            {program.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-crown-gold mr-3 text-lg">•</span>
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Capacity Info */}
                      {program.capacity && (
                        <div className="bg-warm-cream p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-royal-plum mb-2">Capacity:</h4>
                          <p className="text-sm text-muted-foreground">{program.capacity}</p>
                        </div>
                      )}

                      {/* Availability Info */}
                      {program.availability && (
                        <div className="bg-warm-cream p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-royal-plum mb-2">Availability:</h4>
                          <p className="text-sm text-muted-foreground">{program.availability}</p>
                        </div>
                      )}

                      {/* Recent Events */}
                      {program.recentEvents && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-royal-plum mb-2">Recent Events:</h4>
                          <ul className="space-y-1 mb-4">
                            {program.recentEvents.map((event, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-crown-gold mr-2">•</span>
                                <span className="text-muted-foreground text-sm">{event}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Upcoming */}
                      {program.upcoming && (
                        <div className="bg-gradient-gold/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-royal-plum mb-2">Upcoming:</h4>
                          <p className="text-sm text-muted-foreground">{program.upcoming}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Growing Impact */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Our Growing Impact
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            We are building a strong foundation to support women across Southern California through comprehensive programs.
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <ul className="space-y-4 text-left">
                <li className="flex items-start">
                  <span className="text-crown-gold mr-3 text-xl">•</span>
                  <span className="text-white text-lg">Transitional Housing Opening 2025 (San Bernardino County)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crown-gold mr-3 text-xl">•</span>
                  <span className="text-white text-lg">Comprehensive reentry and empowerment services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crown-gold mr-3 text-xl">•</span>
                  <span className="text-white text-lg">Community partnerships across the Inland Empire and Orange County</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crown-gold mr-3 text-xl">•</span>
                  <span className="text-white text-lg">Expansion planned for 2026–2027</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="How to Get Started"
            subtitle="Ready to learn more or connect with our programs?"
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-royal-plum rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                Reach Out
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact us by phone or email to discuss your needs and learn about our programs.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-royal-plum">
                  <Phone className="h-4 w-4" />
                  <span>(909) 547-9998</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Mon-Fri: 9AM-5PM PST
                </div>
              </div>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-royal-plum rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                Initial Conversation
              </h3>
              <p className="text-muted-foreground mb-4">
                We'll discuss your situation, answer questions, and determine which services may be right for you.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Confidential conversation</li>
                <li>• No judgment, only support</li>
                <li>• Referrals if needed</li>
              </ul>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-royal-plum rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                Next Steps Together
              </h3>
              <p className="text-muted-foreground mb-4">
                If She Rises is the right fit, we'll work with you on intake, planning, and getting started.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Personalized planning</li>
                <li>• Clear expectations</li>
                <li>• Ongoing support</li>
              </ul>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
              onClick={() => setIsApplicationModalOpen(true)}
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-lotus-rose text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            Contact us to learn more about our programs and services.
          </p>
          <p className="text-sm text-white/80 mb-8 max-w-2xl mx-auto">
            Not a 24-hour crisis shelter. For immediate crisis support, please call 988 (Suicide & Crisis Lifeline) or 211 (Homeless Outreach).
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-white shadow-soft">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-crown-gold mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Contact She Rises</h3>
                <p className="text-2xl font-bold text-crown-gold mb-2">(909) 547-9998</p>
                <p className="text-sm text-white/90">Mon-Fri: 9AM-5PM PST</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white shadow-soft">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-crown-gold mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Email Us</h3>
                <p className="text-lg font-bold text-crown-gold mb-2">pransom@safehavenforempowerment.org</p>
                <p className="text-sm text-white/90">Response within 1-2 business days</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
      />
    </Layout>
  );
};

export default Programs;
