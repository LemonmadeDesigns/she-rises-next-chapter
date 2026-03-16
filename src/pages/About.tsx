import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Instagram, Heart, Users, Shield, Target, Building, Lightbulb } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import { Link } from "react-router-dom";


import heroWomanImageWebp from "@/assets/hero-woman-hero.webp";
import heroWomanImageAvif from "@/assets/hero-woman-hero.avif";
import { aboutHeroBlurDataUrl } from "@/assets/about-hero-blur-data";
import heroWomanImage from "@/assets/hero-woman.jpg";
import preciousRansomImage from "@/assets/precious-ransom.jpg";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Dignity",
      description: "Every woman deserves to be treated with respect and honor"
    },
    {
      icon: Heart,
      title: "Safety",
      description: "Creating secure environments where women can heal and grow"
    },
    {
      icon: Target,
      title: "Opportunity",
      description: "Opening doors to employment, education, and empowerment"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections that last beyond our programs"
    },
    {
      icon: Lightbulb,
      title: "Empowerment",
      description: "Providing tools and support for women to rise and thrive"
    }
  ];

  const whatWeDo = [
    "Provide safe, transitional housing with on-site support and case management",
    "Offer employment readiness training and job placement assistance",
    "Connect women with essential services: healthcare, legal aid, childcare",
    "Facilitate life skills workshops and peer mentoring programs",
    "Support family reunification and relationship rebuilding",
    "Advocate for policy changes that benefit formerly incarcerated women"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Our Mission"
        subtitle="She Rises provides safe housing, supportive services, and reentry resources that empower women experiencing homelessness and rebuilding after incarceration."
        backgroundImage={heroWomanImage}
        backgroundImageWebp={heroWomanImageWebp}
        backgroundImageAvif={heroWomanImageAvif}
        backgroundImageBlur={aboutHeroBlurDataUrl}
        backgroundImageAlt="She Rises: Empowering women through safe housing and supportive services"
        backgroundImageWidth={1920}
        backgroundImageHeight={1080}
        parallax={true}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/programs">
            <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
              Our Programs
            </Button>
          </Link>
          <Link to="/get-involved">
            <Button size="lg" className="hero-button-secondary btn-force-visible">
              Get Involved
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="bg-gradient-soft border-0">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">Our Mission</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  She Rises provides safe housing, supportive services, and reentry resources that empower 
                  women experiencing homelessness and rebuilding after incarceration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-gold border-0">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">Our Vision</h3>
                <p className="text-lg text-royal-plum/80 leading-relaxed">
                  A community where women have the stability, tools, and encouragement to write her next chapter.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Values"
            subtitle="The principles that guide our work and define our commitment to the women we serve"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-soft transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-lotus-rose rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-royal-plum mb-3">
                    {value.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do in 60 Seconds */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="What We Do in 60 Seconds"
              subtitle="A quick overview of how we support women in their journey to independence"
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-xl font-bold text-royal-plum mb-4">We Provide:</h4>
                <ul className="space-y-3">
                  {whatWeDo.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-crown-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-warm-cream rounded-2xl p-8">
                <blockquote className="text-2xl font-serif text-royal-plum italic mb-4">
                  "When SHE rises, we all rise."
                </blockquote>
                <p className="text-muted-foreground mb-6">
                  This isn't just our motto—it's our belief that when we invest in women, 
                  we strengthen families, communities, and society as a whole.
                </p>
                <Link to="/donate">
                  <Button className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold">
                    Support Our Mission
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="Meet Our Founder"
              subtitle="Leadership driven by experience, compassion, and unwavering dedication"
            />
            
            <Card className="bg-white">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
                      Precious Ransom, Executive Director
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      With over a decade of experience in social services and community advocacy, 
                      Precious founded She Rises after witnessing firsthand the challenges women face 
                      when transitioning from incarceration back to community life. Her vision combines 
                      practical support with dignified care, creating pathways for lasting transformation.
                    </p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "Every woman who walks through our doors has a story of resilience. Our job is to 
                      provide the foundation they need to write their next chapter with confidence and hope."
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gradient-gold rounded-full mx-auto mb-6 overflow-hidden">
                      <img 
                        src={preciousRansomImage} 
                        alt="Precious Ransom, Executive Director" 
                        className="w-full h-full object-cover object-center"
                        style={{ objectPosition: 'center 20%' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4 text-lotus-rose" />
                        <span className="text-sm text-muted-foreground">pransom@safehavenforempowerment.org</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4 text-lotus-rose" />
                        <span className="text-sm text-muted-foreground">(909) 547-9998</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-shadow-hero">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto text-shadow-subtle">
            Join us in empowering women to write their next chapter. Every contribution, 
            volunteer hour, and voice of support helps create lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved">
              <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
                Get Involved
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" className="hero-button-secondary btn-force-visible">
                Donate Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" className="hero-button-tertiary btn-force-visible">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;