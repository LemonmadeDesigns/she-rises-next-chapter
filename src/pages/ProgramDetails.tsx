import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import ApplicationModal from "@/components/modals/ApplicationModal";
import { Home, Heart, Users, BookOpen, Briefcase, Calendar, Clock, MapPin, CheckCircle2, ArrowLeft } from "lucide-react";

const ProgramDetails = () => {
  const { programId } = useParams();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Program data - ideally this would come from a shared data source or API
  const programs = [
    {
      id: "transitional-housing",
      title: "Transitional Housing Program",
      category: "Housing",
      duration: "6-24 months",
      capacity: "20 women",
      description: "Safe, supportive housing for women transitioning from incarceration, homelessness, or crisis situations. Our shared living environment provides stability while residents work toward independence.",
      features: [
        "Shared supportive housing",
        "24/7 on-site support staff",
        "Case management services",
        "Life skills workshops",
        "Mental health counseling",
        "Childcare assistance available"
      ],
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&crop=center",
      featured: true,
      eligibility: [
        "Women 18 years or older",
        "Committed to sobriety and recovery",
        "Willing to participate in case management",
        "Able to live independently with support",
        "Background check required"
      ],
      whatToExpect: [
        "Initial intake and assessment within 48 hours",
        "Orientation to program rules and expectations",
        "Weekly case management meetings",
        "Monthly progress reviews",
        "Individualized support plan development",
        "Connection to community resources"
      ]
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
      featured: true,
      eligibility: [
        "Women seeking employment or career advancement",
        "Able to commit to program schedule",
        "Willing to participate in job search activities",
        "Open to feedback and coaching"
      ],
      whatToExpect: [
        "Comprehensive skills and interest assessment",
        "Personalized career development plan",
        "Hands-on training and workshops",
        "One-on-one coaching and mentorship",
        "Interview preparation and practice",
        "Ongoing support for 90 days after job placement"
      ]
    },
    {
      id: "parenting-support",
      title: "Parenting & Family Reunification",
      category: "Family",
      duration: "Ongoing",
      capacity: "30 families",
      description: "Supporting mothers in rebuilding relationships with their children and developing healthy parenting skills through education and counseling.",
      features: [
        "Parenting education classes",
        "Family therapy and counseling",
        "Family reunification planning",
        "Parent support groups"
      ],
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop&crop=center",
      featured: false,
      eligibility: [
        "Mothers working toward reunification",
        "Compliance with court requirements",
        "Willingness to engage in counseling",
        "Commitment to children's wellbeing"
      ],
      whatToExpect: [
        "Initial family assessment",
        "Customized parenting plan",
        "Weekly parenting classes",
        "Regular counseling sessions",
        "Support with court documentation",
        "Celebration of milestones and progress"
      ]
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
      featured: false,
      eligibility: [
        "Women 18 years or older without high school diploma",
        "Commitment to attend classes regularly",
        "Willingness to complete homework",
        "Placement test required"
      ],
      whatToExpect: [
        "Educational assessment and placement",
        "Personalized learning plan",
        "Small class sizes with individual attention",
        "Practice tests and study materials",
        "GED testing preparation and support",
        "Assistance with next steps after completion"
      ]
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
      featured: false,
      eligibility: [
        "All women in our programs",
        "Community members seeking support",
        "Sliding scale fees available",
        "Insurance accepted"
      ],
      whatToExpect: [
        "Confidential initial consultation",
        "Mental health assessment",
        "Treatment plan development",
        "Regular therapy sessions",
        "Access to crisis support",
        "Coordination with other services"
      ]
    },
  ];

  const program = programs.find(p => p.id === programId);

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

  if (!program) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-royal-plum mb-4">Program Not Found</h1>
          <p className="text-muted-foreground mb-8">The program you're looking for doesn't exist.</p>
          <Link to="/programs">
            <Button>Back to Programs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title={program.title}
        subtitle={program.description}
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
            onClick={() => setIsApplicationModalOpen(true)}
          >
            Apply for This Program
          </Button>
          <Link to="/programs">
            <Button size="lg" className="hero-button-secondary btn-force-visible">
              <ArrowLeft className="h-5 w-5 mr-2" />
              All Programs
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Program Overview */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="rounded-lg overflow-hidden shadow-soft">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Program Info */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getCategoryIcon(program.category)}
                  {program.category}
                </Badge>
                {program.featured && (
                  <Badge className="bg-crown-gold text-royal-plum">
                    Featured Program
                  </Badge>
                )}
              </div>

              <h2 className="font-serif text-3xl font-bold text-royal-plum mb-6">
                Program Overview
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-lotus-rose mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-royal-plum">{program.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-lotus-rose mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold text-royal-plum">{program.capacity}</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {program.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-royal-plum mb-8 text-center">
            What This Program Offers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {program.features.map((feature, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-crown-gold flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{feature}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & What to Expect */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Eligibility */}
            <Card className="shadow-soft">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6">
                  Eligibility Requirements
                </h3>
                <ul className="space-y-4">
                  {program.eligibility.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-lotus-rose rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card className="shadow-soft">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6">
                  What to Expect
                </h3>
                <ul className="space-y-4">
                  {program.whatToExpect.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-crown-gold rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-royal-plum mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Taking the first step toward transformation is courageous. We're here to support you every step of the way.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg text-royal-plum mb-2">Apply Online</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete our online application to begin the intake process
                  </p>
                  <Button
                    className="bg-royal-plum hover:bg-royal-plum/90 text-white"
                    onClick={() => setIsApplicationModalOpen(true)}
                  >
                    Start Application
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg text-royal-plum mb-2">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Speak with our intake team to learn more and get started
                  </p>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-crown-gold">(909) 547-9998</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri: 9AM-5PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-lotus-rose/10 border border-lotus-rose/20 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-lotus-rose mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-royal-plum mb-2">Walk-In Welcome</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit our center Monday through Friday, 9AM-5PM at 123 Hope Street, Your City
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Programs */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-royal-plum mb-8 text-center">
            Other Programs You Might Be Interested In
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {programs
              .filter(p => p.id !== programId)
              .slice(0, 3)
              .map((relatedProgram) => (
                <Card key={relatedProgram.id} className="overflow-hidden shadow-soft">
                  <div className="aspect-video bg-warm-cream overflow-hidden">
                    <img
                      src={relatedProgram.image}
                      alt={relatedProgram.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit mb-3">
                      {getCategoryIcon(relatedProgram.category)}
                      {relatedProgram.category}
                    </Badge>

                    <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
                      {relatedProgram.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4">
                      {relatedProgram.description.substring(0, 100)}...
                    </p>

                    <Link to={`/programs/${relatedProgram.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        Learn More →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/programs">
              <Button variant="outline" size="lg">
                View All Programs
              </Button>
            </Link>
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

export default ProgramDetails;
