import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import { Home, Heart, Users, BookOpen, Briefcase, Calendar, MapPin, Clock } from "lucide-react";

const Programs = () => {
  const programs = [
    {
      id: "transitional-housing",
      title: "Transitional Housing Program",
      category: "Housing",
      duration: "6-24 months",
      capacity: "20 women",
      description: "Safe, supportive housing for women transitioning from incarceration, homelessness, or crisis situations. Our furnished apartments provide stability while residents work toward independence.",
      features: [
        "Furnished private apartments",
        "24/7 on-site support staff",
        "Case management services",
        "Life skills workshops",
        "Mental health counseling",
        "Childcare assistance available"
      ],
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: "workforce-development",
      title: "Workforce Development",
      category: "Employment",
      duration: "3-6 months",
      capacity: "50 participants",
      description: "Comprehensive job training and placement program designed to help women develop marketable skills and secure sustainable employment.",
      features: [
        "Skills assessment and career planning",
        "Job readiness training",
        "Computer and digital literacy",
        "Resume and interview preparation",
        "Industry certifications",
        "Job placement assistance"
      ],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: "parenting-support",
      title: "Parenting & Family Reunification",
      category: "Family",
      duration: "Ongoing",
      capacity: "30 families",
      description: "Supporting mothers in rebuilding relationships with their children and developing healthy parenting skills through education, counseling, and supervised visits.",
      features: [
        "Parenting education classes",
        "Family therapy and counseling",
        "Supervised visitation support",
        "Child development workshops",
        "Court advocacy",
        "Childcare during programs"
      ],
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "education-support",
      title: "Education & GED Program",
      category: "Education",
      duration: "6-12 months",
      capacity: "25 students",
      description: "Academic support to help women complete their high school education, prepare for college, or pursue vocational training.",
      features: [
        "GED preparation and testing",
        "Adult basic education",
        "College application assistance",
        "Financial aid guidance",
        "Study skills workshops",
        "Tutoring support"
      ],
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "mental-health",
      title: "Mental Health & Wellness",
      category: "Wellness",
      duration: "Ongoing",
      capacity: "100 participants",
      description: "Comprehensive mental health services including individual counseling, group therapy, trauma-informed care, and substance abuse support.",
      features: [
        "Individual therapy sessions",
        "Group therapy and support groups",
        "Trauma-informed care",
        "Substance abuse counseling",
        "Crisis intervention",
        "Psychiatric services"
      ],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "legal-advocacy",
      title: "Legal Advocacy & Support",
      category: "Legal",
      duration: "As needed",
      capacity: "Unlimited",
      description: "Legal guidance and advocacy to help women navigate the justice system, expunge records, and address legal barriers to housing and employment.",
      features: [
        "Legal consultation",
        "Record expungement assistance",
        "Court accompaniment",
        "Know your rights education",
        "Immigration support",
        "Referrals to legal aid"
      ],
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop&crop=center",
      featured: false
    }
  ];

  const featuredPrograms = programs.filter(program => program.featured);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Housing":
        return <Home className="h-5 w-5" />;
      case "Employment":
        return <Briefcase className="h-5 w-5" />;
      case "Family":
        return <Heart className="h-5 w-5" />;
      case "Education":
        return <BookOpen className="h-5 w-5" />;
      case "Wellness":
        return <Users className="h-5 w-5" />;
      case "Legal":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Our Programs"
        subtitle="Comprehensive support services designed to help women rebuild their lives with dignity and hope. From housing to employment, we provide the foundation for lasting transformation."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
            Apply for Programs
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-royal-plum">
            Learn More
          </Button>
        </div>
      </Hero>

      {/* Featured Programs */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Featured Programs"
            subtitle="Our core programs provide comprehensive support for women at every stage of their journey"
          />
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredPrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden hover:shadow-soft transition-shadow">
                <div className="aspect-video bg-warm-cream overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(program.category)}
                      {program.category}
                    </Badge>
                    <Badge className="bg-crown-gold text-royal-plum">
                      Featured
                    </Badge>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
                    {program.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {program.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Capacity: {program.capacity}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-royal-plum">Program Features:</h4>
                    <ul className="space-y-1">
                      {program.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-crown-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                      {program.features.length > 3 && (
                        <li className="text-sm text-muted-foreground font-medium">
                          + {program.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-royal-plum hover:bg-royal-plum/90 text-white">
                    Learn More About This Program
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Programs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="All Programs"
            subtitle="Explore our complete range of support services"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.id} className="overflow-hidden hover:shadow-soft transition-shadow">
                <div className="aspect-video bg-warm-cream overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(program.category)}
                      {program.category}
                    </Badge>
                    {program.featured && (
                      <Badge className="bg-crown-gold text-royal-plum">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
                    {program.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {program.description.length > 120 
                      ? `${program.description.substring(0, 120)}...` 
                      : program.description
                    }
                  </p>
                  
                  <div className="grid grid-cols-1 gap-2 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>{program.capacity}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Impact Statistics */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Program Impact
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Our programs create lasting change in the lives of women and families throughout our community.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">300+</div>
              <p className="text-white/90">Women served annually</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">85%</div>
              <p className="text-white/90">Housing program success rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">200+</div>
              <p className="text-white/90">Jobs secured through workforce development</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">150+</div>
              <p className="text-white/90">Families reunified</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="How to Apply"
            subtitle="Ready to begin your journey? Here's how to get started with our programs"
          />
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-royal-plum rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                Initial Contact
              </h3>
              <p className="text-muted-foreground mb-4">
                Call our hotline or visit our center for an initial screening and needs assessment.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-royal-plum">
                  <MapPin className="h-4 w-4" />
                  <span>123 Hope Street, Your City</span>
                </div>
                <div className="flex items-center gap-2 text-royal-plum">
                  <Clock className="h-4 w-4" />
                  <span>Mon-Fri: 9AM-5PM</span>
                </div>
              </div>
            </Card>
            
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-royal-plum rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                Assessment & Planning
              </h3>
              <p className="text-muted-foreground mb-4">
                Work with our case managers to assess your needs and create a personalized support plan.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Comprehensive needs assessment</li>
                <li>• Goal setting and planning</li>
                <li>• Program matching</li>
              </ul>
            </Card>
            
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-royal-plum rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                Program Enrollment
              </h3>
              <p className="text-muted-foreground mb-4">
                Begin your journey with immediate support and ongoing case management.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Program orientation</li>
                <li>• Resource coordination</li>
                <li>• Ongoing support</li>
              </ul>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
              Start Your Application
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="py-20 bg-lotus-rose text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">
            Need Immediate Help?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            If you're in crisis or need immediate support, don't wait. Contact us now.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">24/7 Crisis Hotline</h3>
                <p className="text-2xl font-bold text-crown-gold mb-2">(555) 123-HELP</p>
                <p className="text-sm text-white/90">Available 24 hours a day</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Walk-In Services</h3>
                <p className="text-lg font-bold text-crown-gold mb-2">Mon-Fri 9AM-5PM</p>
                <p className="text-sm text-white/90">123 Hope Street, Your City</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;