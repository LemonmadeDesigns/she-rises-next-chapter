import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import ProgramCard from "@/components/cards/ProgramCard";
import EventCard from "@/components/cards/EventCard";
import EventPhotosCarousel from "@/components/carousel/EventPhotosCarousel";
import heroImage from "@/assets/she-rises-banner-hero.jpg";
import heroImageWebp from "@/assets/she-rises-banner-hero.webp";
import heroImageAvif from "@/assets/she-rises-banner-hero.avif";
import innercodeLogo from "@/assets/innercode-logo.png";
import awipLogo from "@/assets/awip-logo.png";
import transitionalHomeImage from "@/assets/transitional-home.jpg";
import mentoringImage from "@/assets/mentoring.jpg";
import employmentImage from "@/assets/employment-readiness.jpg";
import eventsData from "@/content/events.json";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Index = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive our updates and news about our programs.",
      });
      setEmail("");
    }
  };

  const eventPhotos = [
    "/images/sherises-imgs-01/IMG_1980.jpeg",
    "/images/sherises-imgs-01/IMG_1981.jpeg",
    "/images/sherises-imgs-01/IMG_1982.jpeg",
    "/images/sherises-imgs-01/IMG_1983.jpeg",
    "/images/sherises-imgs-01/IMG_1984.jpeg",
    "/images/sherises-imgs-01/IMG_1985.jpeg",
    "/images/sherises-imgs-01/IMG_1986.jpeg",
    "/images/sherises-imgs-02/IMG_0736.HEIC(1).jpeg",
    "/images/sherises-imgs-02/IMG_0777.HEIC.jpeg",
    "/images/sherises-imgs-02/IMG_0779.HEIC.jpeg",
    "/images/sherises-imgs-02/IMG_0782.HEIC.jpeg",
  ];

  const pillars = [
    {
      title: "Transitional Housing",
      description: "Safe, stable housing with community guidelines and case management",
      icon: "Home",
      image: transitionalHomeImage,
      href: "/programs#transitional-housing"
    },
    {
      title: "Supportive Services", 
      description: "Employment readiness, life skills workshops, and peer mentoring",
      icon: "Users",
      image: mentoringImage,
      href: "/programs#supportive-services"
    },
    {
      title: "Reentry Resources",
      description: "Legal aid, healthcare, childcare, transportation connections",
      icon: "Link",
      image: employmentImage,
      href: "/programs#reentry-resources"
    }
  ];

  const impactItems = [
    "100+ Women Supported",
    "New Beds Opening 2025–2026",
    "Expanding Support Services Across SoCal"
  ];

  return (
    <Layout>
      {/* Hero Section - Premium Modern with Floating Card */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="She Rises Hero"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 35%' }}
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          {/* Lighter Sophisticated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-deep-plum/60 via-deep-plum/40 to-deep-plum/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="max-w-6xl mx-auto">
            {/* Main Hero Content */}
            <div className="mb-12">
              <div className="w-20 h-1 bg-rose-gold mb-8"></div>
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] drop-shadow-2xl">
                Every Woman<br />
                Deserves a Safe<br />
                <span className="text-rose-gold">Place to Rise</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-2xl mb-10 leading-relaxed drop-shadow-lg">
                Supporting women through safe housing, empowerment, and lasting transformation
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/about">
                  <Button
                    size="lg"
                    className="bg-rose-gold hover:bg-rose-gold/90 text-white font-semibold px-10 py-6 text-lg rounded-none shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    Our Story <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button
                    size="lg"
                    className="bg-white/95 hover:bg-white text-deep-plum font-semibold px-10 py-6 text-lg rounded-none shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    Donate Now <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating Impact Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl max-w-4xl">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-rose-gold mb-2">100+</div>
                  <div className="text-white/80 text-sm md:text-base">Women Supported</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-rose-gold mb-2">85%</div>
                  <div className="text-white/80 text-sm md:text-base">Success Rate</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-rose-gold mb-2">2+</div>
                  <div className="text-white/80 text-sm md:text-base">Years of Impact</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Our Team in Action - Photo Section */}
      <section className="py-24 bg-soft-gray dark:bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Impact in Action"
            subtitle="Celebrating community, connection, and transformation"
            className="mb-12"
          />
          <EventPhotosCarousel images={eventPhotos} />
        </div>
      </section>

      {/* Our Programs - Large Visual Cards with Overlays */}
      <section className="py-32 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="max-w-3xl mb-20">
            <div className="w-20 h-1 bg-rose-gold mb-6"></div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-deep-plum dark:text-foreground mb-6">
              Our Programs
            </h2>
            <p className="text-xl text-foreground/70 dark:text-muted-foreground leading-relaxed">
              Comprehensive support services that help women stabilize, rebuild, and thrive through every step of their journey
            </p>
          </div>

          {/* Large Image Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {pillars.map((pillar, index) => (
              <Link key={index} to={pillar.href} className="group block">
                <div className="relative h-[500px] overflow-hidden">
                  {/* Image */}
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-plum via-deep-plum/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="w-12 h-1 bg-rose-gold mb-4 transform origin-left transition-all duration-500 group-hover:w-20"></div>
                    <h3 className="font-serif text-3xl font-bold mb-3 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                      {pillar.title}
                    </h3>
                    <p className="text-white/90 text-base leading-relaxed mb-4 transform transition-all duration-500 opacity-90 group-hover:opacity-100">
                      {pillar.description}
                    </p>
                    <div className="flex items-center text-rose-gold font-semibold transform transition-transform duration-500 group-hover:translate-x-2">
                      Learn More <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pull Quote with Premium Gradient Background */}
          <div className="relative py-32 overflow-hidden">
            {/* Stunning Gradient Background with Flowing Waves Effect - theme-aware */}
            <div className="absolute inset-0 bg-gradient-to-br from-deep-plum via-[#4A2C5E] to-[#2D4A6E] dark:from-[#5A3D64] dark:via-[#6B4575] dark:to-[#4A5B7E]"></div>

            {/* Animated Wave Overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-gold/20 via-transparent to-blue-400/20"></div>
            </div>

            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            <div className="relative text-center max-w-4xl mx-auto px-8">
              <div className="text-8xl md:text-9xl text-rose-gold/40 dark:text-rose-gold/50 font-serif leading-none mb-[-40px] drop-shadow-lg">"</div>
              <blockquote className="text-4xl md:text-5xl font-serif text-white dark:text-foreground italic leading-tight drop-shadow-2xl">
                When SHE rises, we all rise.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Events & Community Outreach */}
      <section className="py-24 bg-soft-gray dark:bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Community Events & Outreach"
            subtitle="Building connections across Southern California"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 gap-8 mb-10 max-w-6xl mx-auto">
            {eventsData.events.slice(0, 2).map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                description={event.description}
                featured={event.featured}
                href={`/events#${event.id}`}
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-base">
              More events coming soon. We are actively partnering with agencies throughout Southern California.
            </p>
            <Link to="/events">
              <Button variant="outline" size="lg" className="border-deep-plum text-deep-plum hover:bg-deep-plum hover:text-white transition-all duration-300">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Growing Impact - Dark Section with Large Numbers */}
      <section className="relative py-32 bg-deep-plum dark:bg-background text-white dark:text-foreground overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="w-20 h-1 bg-rose-gold mb-6 mx-auto"></div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold mb-6">
                Our Growing Impact
              </h2>
              <p className="text-xl text-white/80 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Building a strong foundation to support women across Southern California
              </p>
            </div>

            {/* Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              {impactItems.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="text-7xl md:text-8xl font-bold text-rose-gold mb-4 transform transition-transform duration-500 group-hover:scale-110">
                    0{index + 1}
                  </div>
                  <div className="w-16 h-1 bg-rose-gold/50 mx-auto mb-4"></div>
                  <p className="text-xl text-white/90 dark:text-foreground/90 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center pt-12 border-t border-white/10 dark:border-border">
              <p className="text-lg text-white/70 dark:text-muted-foreground mb-6">
                Join us in making a lasting difference in women's lives
              </p>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white dark:hover:text-deep-plum font-semibold px-10 py-6 text-lg rounded-none transition-all duration-300"
                >
                  Learn More About Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Premium Design */}
      <section className="relative py-32 overflow-hidden">
        {/* Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-soft-gray to-white dark:from-background dark:via-muted dark:to-background"></div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-gray-200 dark:border-border p-12 md:p-16 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-20 h-1 bg-rose-gold mb-6 mx-auto"></div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-plum dark:text-foreground mb-4">
                  Stay Connected
                </h2>
                <p className="text-lg text-foreground/70 dark:text-muted-foreground leading-relaxed">
                  Receive updates about our programs, events, and ways to get involved
                </p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <Input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-14 px-6 text-base border-2 border-gray-300 dark:border-border focus:border-rose-gold focus:ring-rose-gold rounded-none"
                    autoComplete="email"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-rose-gold hover:bg-rose-gold/90 text-white font-semibold h-14 px-10 text-base rounded-none transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-sm text-foreground/50 dark:text-muted-foreground mt-4 text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - Sophisticated Grid */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-20 h-1 bg-rose-gold mb-6 mx-auto"></div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-deep-plum dark:text-foreground mb-6">
              Our Partners
            </h2>
            <p className="text-xl text-foreground/70 dark:text-muted-foreground max-w-2xl mx-auto">
              Together, building stronger communities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* InnerCode */}
            <div className="group relative aspect-square bg-gradient-to-br from-soft-gray to-white dark:from-muted dark:to-card p-10 flex items-center justify-center border border-gray-200 dark:border-border transition-all duration-500 hover:border-rose-gold hover:shadow-lg">
              <div className="text-center w-full">
                <img src={innercodeLogo} alt="InnerCode" className="max-h-32 w-full object-contain mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="text-sm font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">Technology Partner</div>
              </div>
            </div>

            {/* AWIP */}
            <div className="group relative aspect-square bg-gradient-to-br from-soft-gray to-white dark:from-muted dark:to-card p-10 flex items-center justify-center border border-gray-200 dark:border-border transition-all duration-500 hover:border-rose-gold hover:shadow-lg">
              <div className="text-center w-full">
                <img src={awipLogo} alt="A Work In Progress" className="max-h-32 w-full object-contain mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="text-sm font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">Community Partner</div>
              </div>
            </div>

            {/* Placeholder slots */}
            <div className="group aspect-square border-2 border-dashed border-gray-300 dark:border-border flex items-center justify-center hover:border-rose-gold transition-all duration-500">
              <div className="text-center text-gray-400 dark:text-muted-foreground group-hover:text-rose-gold transition-colors">
                <div className="text-base font-medium">Your Logo</div>
              </div>
            </div>

            <div className="group aspect-square border-2 border-dashed border-gray-300 dark:border-border flex items-center justify-center hover:border-rose-gold transition-all duration-500">
              <div className="text-center text-gray-400 dark:text-muted-foreground group-hover:text-rose-gold transition-colors">
                <div className="text-base font-medium">Partner With Us</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Full-width Image Background */}
      <section className="relative py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={eventPhotos[0]}
            alt="Join Our Mission"
            className="w-full h-full object-cover"
          />
          {/* Improved Gradual Gradient Overlay - lighter and more gradual */}
          <div className="absolute inset-0 bg-gradient-to-b from-deep-plum/70 via-deep-plum/50 to-deep-plum/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-20 h-1 bg-rose-gold mb-8 mx-auto"></div>
            <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-tight drop-shadow-2xl">
              Empower Women on<br />Their Journey
            </h2>
            <p className="text-xl md:text-2xl text-white/95 mb-12 leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
              Your support helps women write their next chapter with dignity, safety, and opportunity
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/donate">
                <Button
                  size="lg"
                  className="bg-rose-gold hover:bg-rose-gold/90 text-white font-semibold px-12 py-7 text-lg rounded-none shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Make a Donation <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/get-involved">
                <Button
                  size="lg"
                  className="bg-white/95 hover:bg-white text-deep-plum font-semibold px-12 py-7 text-lg rounded-none shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;