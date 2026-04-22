import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Instagram, Heart, Users, Shield, Target, Building, Lightbulb } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import { Link } from "react-router-dom";


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
      <section className="py-32 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mission Card */}
            <div className="group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-deep-plum via-[#4A2C5E] to-[#2D4A6E] dark:from-[#5A3D64] dark:via-[#6B4575] dark:to-[#4A5B7E]"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              <div className="relative p-12">
                <div className="w-16 h-1 bg-rose-gold mb-6"></div>
                <h3 className="font-serif text-3xl font-bold text-white mb-6">Our Mission</h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  She Rises provides safe housing, supportive services, and reentry resources that empower
                  women experiencing homelessness and rebuilding after incarceration.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold to-[#C99A6E] dark:from-[#DEB088] dark:to-[#D4A574]"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              <div className="relative p-12">
                <div className="w-16 h-1 bg-white mb-6"></div>
                <h3 className="font-serif text-3xl font-bold text-deep-plum dark:text-background mb-6">Our Vision</h3>
                <p className="text-lg text-deep-plum/90 dark:text-background/90 leading-relaxed">
                  A community where women have the stability, tools, and encouragement to write her next chapter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-32 bg-soft-gray dark:bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-1 bg-rose-gold mb-6 mx-auto"></div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-deep-plum dark:text-foreground mb-6">
                Our Values
              </h2>
              <p className="text-xl text-foreground/70 dark:text-muted-foreground max-w-3xl mx-auto">
                The principles that guide our work and define our commitment to the women we serve
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {values.map((value, index) => (
                <div key={index} className="group">
                  <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-6 text-center transition-all duration-500 hover:shadow-xl hover:scale-105 hover:border-rose-gold h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-[#C99A6E] rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-deep-plum dark:text-foreground mb-3">
                      {value.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do in 60 Seconds */}
      <section className="py-32 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-1 bg-rose-gold mb-6 mx-auto"></div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-deep-plum dark:text-foreground mb-6">
                What We Do in 60 Seconds
              </h2>
              <p className="text-xl text-foreground/70 dark:text-muted-foreground max-w-3xl mx-auto">
                A quick overview of how we support women in their journey to independence
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-soft-gray dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-10">
                <h4 className="font-serif text-2xl font-bold text-deep-plum dark:text-foreground mb-8">We Provide:</h4>
                <ul className="space-y-4">
                  {whatWeDo.map((item, index) => (
                    <li key={index} className="flex items-start group">
                      <div className="w-3 h-3 bg-rose-gold rounded-full mt-2 mr-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-125"></div>
                      <span className="text-foreground/80 dark:text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-deep-plum via-[#4A2C5E] to-[#2D4A6E] dark:from-[#5A3D64] dark:via-[#6B4575] dark:to-[#4A5B7E]"></div>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>
                <div className="relative p-10">
                  <div className="text-6xl md:text-7xl text-rose-gold/40 font-serif leading-none mb-4">"</div>
                  <blockquote className="text-3xl font-serif text-white italic mb-6 leading-tight">
                    When SHE rises, we all rise.
                  </blockquote>
                  <p className="text-white/90 mb-8 leading-relaxed">
                    This isn't just our motto—it's our belief that when we invest in women,
                    we strengthen families, communities, and society as a whole.
                  </p>
                  <Link to="/donate">
                    <Button className="bg-rose-gold hover:bg-rose-gold/90 text-white font-semibold rounded-full px-8 py-6 transition-all duration-300 hover:scale-105 shadow-lg">
                      Support Our Mission
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="py-32 bg-soft-gray dark:bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-20 h-1 bg-rose-gold mb-6 mx-auto"></div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-deep-plum dark:text-foreground mb-6">
                Meet Our Founder
              </h2>
              <p className="text-xl text-foreground/70 dark:text-muted-foreground max-w-3xl mx-auto">
                Leadership driven by experience, compassion, and unwavering dedication
              </p>
            </div>

            <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="p-12 md:p-16">
                <div className="grid md:grid-cols-3 gap-12 items-center">
                  <div className="md:col-span-2 space-y-6">
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-deep-plum dark:text-foreground">
                      Precious Ransom
                    </h3>
                    <div className="text-lg text-rose-gold font-semibold">Executive Director</div>
                    <p className="text-foreground/80 dark:text-muted-foreground text-lg leading-relaxed">
                      With over a decade of experience in social services and community advocacy,
                      Precious founded She Rises after witnessing firsthand the challenges women face
                      when transitioning from incarceration back to community life. Her vision combines
                      practical support with dignified care, creating pathways for lasting transformation.
                    </p>
                    <div className="bg-soft-gray dark:bg-muted border-l-4 border-rose-gold pl-6 py-4 italic">
                      <p className="text-deep-plum dark:text-foreground text-xl leading-relaxed">
                        "Every woman who walks through our doors has a story of resilience. Our job is to
                        provide the foundation they need to write their next chapter with confidence and hope."
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-56 h-56 bg-gradient-to-br from-rose-gold to-[#C99A6E] rounded-full mx-auto mb-6 overflow-hidden ring-4 ring-rose-gold/20 shadow-2xl">
                      <img
                        src={preciousRansomImage}
                        alt="Precious Ransom, Executive Director"
                        className="w-full h-full object-cover object-center"
                        style={{ objectPosition: 'center 20%' }}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-foreground/70 dark:text-muted-foreground hover:text-rose-gold transition-colors">
                        <Mail className="h-5 w-5" />
                        <a href="mailto:pransom@safehavenforempowerment.org" className="text-sm">
                          pransom@safehavenforempowerment.org
                        </a>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-foreground/70 dark:text-muted-foreground hover:text-rose-gold transition-colors">
                        <Phone className="h-5 w-5" />
                        <a href="tel:+19095479998" className="text-sm">(909) 547-9998</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-plum via-[#4A2C5E] to-[#2D4A6E] dark:from-[#5A3D64] dark:via-[#6B4575] dark:to-[#4A5B7E]"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-1 bg-rose-gold mb-8 mx-auto"></div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8 text-white drop-shadow-2xl">
              Ready to Make a Difference?
            </h2>
            <p className="text-2xl text-white/95 mb-12 leading-relaxed drop-shadow-lg">
              Join us in empowering women to write their next chapter. Every contribution,
              volunteer hour, and voice of support helps create lasting change.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/get-involved">
                <Button size="lg" className="bg-rose-gold hover:bg-rose-gold/90 text-white font-semibold rounded-full px-12 py-7 text-lg transition-all duration-300 hover:scale-105 shadow-2xl">
                  Get Involved
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" className="bg-white/95 hover:bg-white text-deep-plum font-semibold rounded-full px-12 py-7 text-lg transition-all duration-300 hover:scale-105 shadow-2xl">
                  Donate Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white/60 text-white hover:bg-white/10 rounded-full px-12 py-7 text-lg transition-all duration-300 hover:scale-105 shadow-2xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;