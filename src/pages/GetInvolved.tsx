import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import BecomeVolunteerModal from "@/components/modals/BecomeVolunteerModal";
import PartnerWithUsModal from "@/components/modals/PartnerWithUsModal";
import GenericContactModal from "@/components/modals/GenericContactModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import { Heart, Clock, Building2, DollarSign, Gift, ArrowRight, CheckCircle } from "lucide-react";
import getInvolvedHeroImage from "@/assets/mentoring.jpg";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="eyebrow mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-text">{children}</p>
);

const SectionHeading = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div className="text-center mb-12">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4">{title}</h2>
    {subtitle && (
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
    )}
  </div>
);

const GetInvolved = () => {
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const opportunities = [
    {
      id: "direct-support",
      title: "Direct Support Volunteer",
      category: "Direct Service",
      commitment: "4-8 hours/week",
      description: "Work directly with women in our programs, providing mentorship, life skills support, and companionship.",
      requirements: [
        "Background check required",
        "Training provided",
        "6-month minimum commitment",
        "Trauma-informed care training"
      ],
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: "administrative",
      title: "Administrative Support",
      category: "Office Support",
      commitment: "2-4 hours/week",
      description: "Help with data entry, filing, phone calls, and general office tasks that keep our programs running smoothly.",
      requirements: [
        "Basic computer skills",
        "Reliable schedule",
        "Detail-oriented",
        "Professional communication"
      ],
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "events",
      title: "Event Support Team",
      category: "Events",
      commitment: "Flexible",
      description: "Help plan and execute fundraising events, community workshops, and awareness campaigns.",
      requirements: [
        "Enthusiasm for event planning",
        "Good communication skills",
        "Team player attitude",
        "Weekend availability preferred"
      ],
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: "professional",
      title: "Professional Skills Volunteer",
      category: "Professional Services",
      commitment: "1-3 hours/week",
      description: "Share your professional expertise in areas like financial counseling, healthcare, or career coaching.",
      requirements: [
        "Professional certification/license",
        "Relevant experience",
        "Cultural sensitivity training",
        "Flexible schedule"
      ],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "transportation",
      title: "Transportation Assistance",
      category: "Support Services",
      commitment: "2-4 hours/week",
      description: "Help women get to appointments, job interviews, court dates, and program activities.",
      requirements: [
        "Valid driver's license",
        "Clean driving record",
        "Reliable vehicle",
        "Flexible schedule"
      ],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center",
      featured: false
    }
  ];

  const sponsorshipLevels = [
    {
      id: "platinum",
      name: "Platinum Partner",
      amount: "$1,000+",
      benefits: [
        "Logo on all marketing materials",
        "Dedicated program naming opportunity",
        "Quarterly impact reports",
        "VIP event access for 10 people",
        "Board presentation opportunity"
      ]
    },
    {
      id: "gold",
      name: "Gold Supporter",
      amount: "$500+",
      benefits: [
        "Logo on website and newsletter",
        "Annual impact report",
        "VIP event access for 6 people",
        "Social media recognition",
        "Tour of facilities"
      ]
    },
    {
      id: "silver",
      name: "Silver Champion",
      amount: "$250+",
      benefits: [
        "Website recognition",
        "Event tickets for 4 people",
        "Quarterly newsletter",
        "Certificate of appreciation",
        "Impact updates"
      ]
    },
    {
      id: "bronze",
      name: "Bronze Ally",
      amount: "$100+",
      benefits: [
        "Website listing",
        "Event tickets for 2 people",
        "Thank you certificate",
        "Annual impact summary"
      ]
    }
  ];

  const waysToHelp = [
    {
      icon: Heart,
      title: "Volunteer",
      description: "Share your time and skills to directly support women in our programs.",
      action: { label: "Learn More", onClick: undefined, href: "#volunteer-opportunities" }
    },
    {
      icon: Building2,
      title: "Corporate Partnership",
      description: "Partner with us to create meaningful employee engagement opportunities.",
      action: { label: "Learn More", onClick: () => setIsPartnershipModalOpen(true), href: undefined }
    },
    {
      icon: DollarSign,
      title: "Sponsorship",
      description: "Sponsor programs, events, or facilities to maximize your community impact.",
      action: { label: "Learn More", onClick: () => setIsSponsorshipModalOpen(true), href: undefined }
    },
    {
      icon: Gift,
      title: "In-Kind Donations",
      description: "Donate goods, services, or expertise to support our daily operations.",
      action: { label: "Learn More", onClick: () => setIsDonationModalOpen(true), href: undefined }
    }
  ];

  const featuredOpportunities = opportunities.filter(opp => opp.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Get Involved"
        subtitle="Join our mission to empower women and transform lives. Whether through volunteering, partnerships, or sponsorship, your support creates lasting change in our community."
        backgroundImage={getInvolvedHeroImage}
        backgroundImageAlt="Get Involved with She Rises - Volunteer and Partnership Opportunities"
        backgroundImageWidth={1920}
        backgroundImageHeight={1080}
        backgroundImagePosition="center 30%"
        parallax={true}
        className="py-32 md:py-40"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            id="btn-volunteer"
            size="lg"
            className="bg-accent text-primary-deep hover:bg-accent/90 font-bold rounded-full px-8"
            onClick={() => setIsVolunteerModalOpen(true)}
          >
            Become a Volunteer
          </Button>
          <Button
            id="btn-partner"
            size="lg"
            className="hero-button-secondary btn-force-visible rounded-full px-8"
            onClick={() => setIsPartnerModalOpen(true)}
          >
            Partner With Us
          </Button>
        </div>
      </Hero>

      {/* Ways to Help */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Ways to help"
            title="Ways to Make a Difference"
            subtitle="Every contribution, big or small, helps create positive change in the lives of women and families"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
            {waysToHelp.map((way) => {
              const Icon = way.icon;
              return (
                <Card
                  key={way.title}
                  className="rounded-2xl border border-border bg-surface text-center p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-extrabold text-foreground mb-3">{way.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-1">{way.description}</p>
                  {way.action.href ? (
                    <a href={way.action.href} className="mt-auto">
                      <Button variant="outline" size="sm" className="w-full rounded-full">
                        {way.action.label}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-auto rounded-full"
                      onClick={way.action.onClick}
                    >
                      {way.action.label}
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Volunteer Opportunities */}
      <section id="volunteer-opportunities" className="py-20 md:py-28 bg-surface-alt">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Volunteer"
            title="Featured Volunteer Opportunities"
            subtitle="High-impact roles where your contribution makes the biggest difference"
          />

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="rounded-2xl border border-border bg-surface overflow-hidden shadow-soft transition-transform duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{opportunity.category}</Badge>
                    <Badge className="bg-accent text-primary-deep hover:bg-accent">Featured</Badge>
                  </div>

                  <h3 className="text-2xl font-extrabold text-foreground mb-4">
                    {opportunity.title}
                  </h3>

                  <p className="text-muted-foreground mb-6">
                    {opportunity.description}
                  </p>

                  <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Commitment: {opportunity.commitment}</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-foreground">Requirements:</h4>
                    <ul className="space-y-1">
                      {opportunity.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-accent-text mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                    onClick={() => setIsVolunteerModalOpen(true)}
                  >
                    Apply for This Role
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Volunteer Opportunities */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="All roles"
            title="All Volunteer Opportunities"
            subtitle="Find the perfect way to contribute your time and talents"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="rounded-2xl border border-border bg-surface overflow-hidden shadow-soft transition-transform duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{opportunity.category}</Badge>
                    {opportunity.featured && (
                      <Badge className="bg-accent text-primary-deep hover:bg-accent">Featured</Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-foreground mb-3">
                    {opportunity.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4">
                    {opportunity.description.length > 120
                      ? `${opportunity.description.substring(0, 120)}...`
                      : opportunity.description
                    }
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{opportunity.commitment}</span>
                  </div>

                  <Link to={`/volunteer/${opportunity.id}`} className="w-full">
                    <Button size="sm" variant="outline" className="w-full rounded-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Levels */}
      <section className="py-20 md:py-28 bg-surface-alt">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Sponsorship"
            title="Corporate Sponsorship Opportunities"
            subtitle="Partner with us to amplify your community impact and brand visibility"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {sponsorshipLevels.map((level) => (
              <Card key={level.id} className="rounded-2xl border border-border bg-surface overflow-hidden shadow-soft transition-transform duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="h-1.5 bg-gradient-to-r from-accent to-rose"></div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-extrabold text-foreground mb-2">
                    {level.name}
                  </h3>
                  <div className="text-2xl font-extrabold text-accent-text mb-4">
                    {level.amount}
                  </div>

                  <ul className="space-y-2 flex-1">
                    {level.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-accent-text mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                      onClick={() => setIsSponsorshipModalOpen(true)}
                    >
                      Choose This Level
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Growing Impact */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Eyebrow>Impact</Eyebrow>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6">
            Our Growing Impact
          </h2>
          <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
            As a growing organization, we're building strong partnerships and volunteer support across Southern California.
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <ul className="space-y-4 text-left">
                <li className="flex items-start">
                  <span className="text-accent mr-3 text-xl">•</span>
                  <span className="text-lg">Growing Volunteer Interest</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3 text-xl">•</span>
                  <span className="text-lg">Community Hours Contributed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3 text-xl">•</span>
                  <span className="text-lg">New & Emerging Partnerships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3 text-xl">•</span>
                  <span className="text-lg">Support from Local Donors & Community Members</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 md:py-28 bg-rose text-rose-foreground">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join our community of supporters and be part of transforming lives. Every contribution matters, and every volunteer makes a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent text-primary-deep hover:bg-accent/90 font-bold rounded-full px-8"
              onClick={() => setIsVolunteerModalOpen(true)}
            >
              Start Volunteering Today
            </Button>
            <Button
              size="lg"
              className="hero-button-tertiary btn-force-visible rounded-full px-8"
              onClick={() => setIsPartnerModalOpen(true)}
            >
              Explore Partnerships
            </Button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <BecomeVolunteerModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />
      <PartnerWithUsModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      {/* Partnership Modal */}
      <GenericContactModal
        isOpen={isPartnershipModalOpen}
        onClose={() => setIsPartnershipModalOpen(false)}
        title="Corporate Partnership Inquiry"
        subtitle="Let's explore how we can partner together to empower women in our community"
        inquiryType="Corporate Partnership"
        options={[
          { value: "employee-volunteer", label: "Employee Volunteer Programs" },
          { value: "sponsorship", label: "Event/Program Sponsorship" },
          { value: "grants", label: "Corporate Grants" },
          { value: "inkind", label: "In-Kind Donations" },
          { value: "other", label: "Other Partnership Opportunities" }
        ]}
      />

      {/* Sponsorship Modal */}
      <GenericContactModal
        isOpen={isSponsorshipModalOpen}
        onClose={() => setIsSponsorshipModalOpen(false)}
        title="Sponsorship Inquiry"
        subtitle="Sponsor programs, events, or facilities to maximize your community impact"
        inquiryType="Sponsorship"
        options={[
          { value: "program", label: "Program Sponsorship" },
          { value: "event", label: "Event Sponsorship" },
          { value: "facility", label: "Facility Sponsorship" },
          { value: "annual", label: "Annual Giving" },
          { value: "custom", label: "Custom Sponsorship Package" }
        ]}
      />

      {/* In-Kind Donations Modal */}
      <GenericContactModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        title="In-Kind Donation Inquiry"
        subtitle="Donate goods, services, or expertise to support our daily operations"
        inquiryType="In-Kind Donation"
        options={[
          { value: "goods", label: "Household Goods & Supplies" },
          { value: "furniture", label: "Furniture & Appliances" },
          { value: "services", label: "Professional Services" },
          { value: "food", label: "Food & Groceries" },
          { value: "clothing", label: "Clothing & Personal Items" },
          { value: "other", label: "Other Donations" }
        ]}
      />
    </Layout>
  );
};

export default GetInvolved;
