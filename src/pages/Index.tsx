import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Heart,
  Home as HomeIcon,
  Users,
  Compass,
  PhoneCall,
  ClipboardList,
  KeyRound,
  Sprout,
  HandHeart,
  Building2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/sections/SectionHeader";
import EventPhotosCarousel from "@/components/carousel/EventPhotosCarousel";
import heroImage from "@/assets/she-rises-banner-hero.jpg";
import innercodeLogo from "@/assets/innercode-logo.png";
import awipLogo from "@/assets/awip-logo.png";
import transitionalHomeImage from "@/assets/transitional-home.jpg";
import mentoringImage from "@/assets/mentoring.jpg";
import employmentImage from "@/assets/employment-readiness.jpg";
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
      description:
        "Safe, stable housing with community guidelines and dedicated case management.",
      icon: HomeIcon,
      image: transitionalHomeImage,
      href: "/programs#transitional-housing",
    },
    {
      title: "Supportive Services",
      description:
        "Employment readiness, life-skills workshops, and peer mentoring that builds confidence.",
      icon: Users,
      image: mentoringImage,
      href: "/programs#supportive-services",
    },
    {
      title: "Community Resources",
      description:
        "Warm connections to healthcare, transportation, and community support networks.",
      icon: Compass,
      image: employmentImage,
      href: "/programs#reentry-resources",
    },
  ];

  const whoWeServe = [
    "Women returning home after incarceration or navigating parole and probation",
    "Women experiencing homelessness or housing instability",
    "Women rebuilding after family disruption or other major life transitions",
  ];

  const howItWorks = [
    {
      icon: PhoneCall,
      title: "Reach Out",
      description:
        "Call, email, or send us a message. A real person answers — no judgment, no pressure.",
    },
    {
      icon: ClipboardList,
      title: "Apply",
      description:
        "Complete a simple application so we can understand your situation and goals.",
    },
    {
      icon: KeyRound,
      title: "Move In",
      description:
        "When a space opens, we welcome you into a safe, structured home environment.",
    },
    {
      icon: Sprout,
      title: "Grow",
      description:
        "With case management, mentoring, and life-skills support, you build your next chapter.",
    },
  ];

  const impactItems = [
    "100+ Women Supported",
    "New Beds Opening 2025–2026",
    "Expanding Support Services Across SoCal",
  ];

  const faqs = [
    {
      q: "Who is eligible for the program?",
      a: "SHE RISES serves adult women who are rebuilding stability after incarceration, parole or probation, homelessness, family disruption, or other major life transitions. If you're unsure whether you qualify, reach out — we'll talk it through together.",
    },
    {
      q: "Is SHE RISES a medical or clinical facility?",
      a: "No. SHE RISES is a non-medical transitional housing program. We provide safe housing, case management, and supportive services, and we connect residents with outside providers for clinical care.",
    },
    {
      q: "How do I apply?",
      a: "Start by contacting us by phone or email, or through the contact form on this site. We'll walk you through the application step by step.",
    },
    {
      q: "How can I help as a donor or partner?",
      a: "You can make a one-time or monthly donation, volunteer your time, or partner with us as an agency, employer, or faith community. Visit our Get Involved page to choose the path that fits you.",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="She Rises Hero"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 35%" }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-deep/70 via-primary-deep/50 to-primary-deep/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="eyebrow !text-accent mb-6">Safe Haven for Empowerment</p>
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-[1.05] drop-shadow-2xl">
                Every Woman
                <br />
                Deserves a Safe
                <br />
                <span className="text-accent">Place to Rise</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-2xl mb-10 leading-relaxed drop-shadow-lg">
                Non-medical transitional housing and support for women rebuilding
                stability after incarceration, homelessness, or major life transitions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-primary-deep font-semibold px-10 py-6 text-lg rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    Apply for Housing <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button
                    size="lg"
                    className="bg-white/95 hover:bg-white text-primary-deep font-semibold px-10 py-6 text-lg rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    Donate Now <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-16">
            <p className="eyebrow mb-4">What We Do</p>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-6">
              Our Programs
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Comprehensive support that helps women stabilize, rebuild, and thrive
              through every step of their journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => (
              <Link key={index} to={pillar.href} className="group block">
                <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border shadow-sm">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-deep via-primary-deep/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <pillar.icon className="h-8 w-8 text-accent mb-4" />
                    <h3 className="font-heading text-2xl font-bold mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-white/90 text-base leading-relaxed mb-4">
                      {pillar.description}
                    </p>
                    <div className="flex items-center text-accent font-semibold transform transition-transform duration-500 group-hover:translate-x-2">
                      Learn More <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24 bg-surface-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-4">Who We Serve</p>
              <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-6">
                Women Ready for a Fresh Start
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                SHE RISES walks alongside adult women who are rebuilding stability.
                If any of these sound like you — or someone you're referring — you're
                in the right place.
              </p>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-rose hover:bg-rose-hover text-rose-foreground font-semibold px-8 rounded-2xl"
                >
                  Start a Conversation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {whoWeServe.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-surface border border-border rounded-2xl p-6 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="font-heading font-bold text-accent-text">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed pt-2">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="eyebrow mb-4">The Path Forward</p>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Four simple steps from first contact to a stable, supported home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="bg-surface border border-border rounded-2xl p-8 shadow-sm text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="eyebrow mb-2">Step {index + 1}</div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="relative py-24 bg-primary-deep text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="eyebrow !text-accent mb-4">Our Growing Impact</p>
              <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6">
                Building a Strong Foundation
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                Supporting women across Southern California, one safe home at a time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {impactItems.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="text-6xl md:text-7xl font-heading font-extrabold text-accent mb-4 transform transition-transform duration-500 group-hover:scale-110">
                    0{index + 1}
                  </div>
                  <div className="w-16 h-1 bg-accent/50 mx-auto mb-4"></div>
                  <p className="text-lg text-white/90 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Carousel */}
      <section className="py-24 bg-surface-alt">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Impact in Action"
            subtitle="Celebrating community, connection, and transformation"
            className="mb-12"
          />
          <EventPhotosCarousel images={eventPhotos} />
        </div>
      </section>

      {/* Pull Quote */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative py-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary-deep to-primary">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "50px 50px",
                }}
              ></div>
            </div>
            <div className="relative text-center max-w-4xl mx-auto px-8">
              <div className="text-8xl md:text-9xl text-accent/40 font-heading leading-none mb-[-40px]">
                "
              </div>
              <blockquote className="text-4xl md:text-5xl font-heading text-white italic leading-tight drop-shadow-2xl">
                When SHE rises, we all rise.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Partner / Donate Band */}
      <section className="py-24 bg-surface-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-2xl p-10 shadow-sm flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                <HandHeart className="h-7 w-7 text-accent-text" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                Give With Confidence
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                Every dollar goes directly toward safe housing, essentials, and the
                support services that help women rebuild their lives.
              </p>
              <Link to="/donate">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-primary-deep font-semibold px-8 rounded-2xl"
                >
                  Donate <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-10 shadow-sm flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-accent-text" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                Partner With Us
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                Referral agencies, employers, and faith communities help our residents
                thrive. Let's build something lasting together.
              </p>
              <Link to="/get-involved">
                <Button
                  size="lg"
                  className="bg-rose hover:bg-rose-hover text-rose-foreground font-semibold px-8 rounded-2xl"
                >
                  Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">Common Questions</p>
              <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-heading font-bold text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-surface-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-surface border border-border rounded-2xl p-10 md:p-14 shadow-sm">
              <div className="text-center mb-8">
                <p className="eyebrow mb-4">Stay Connected</p>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                  Get Our Updates
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Receive news about our programs, events, and ways to get involved.
                </p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-14 px-6 text-base rounded-2xl"
                    autoComplete="email"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-rose hover:bg-rose-hover text-rose-foreground font-semibold h-14 px-10 text-base rounded-2xl transition-all duration-300"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4">Our Partners</p>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-6">
              Together, Building Stronger Communities
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="group relative aspect-square bg-surface-alt rounded-2xl p-10 flex items-center justify-center border border-border transition-all duration-500 hover:border-accent hover:shadow-lg">
              <div className="text-center w-full">
                <img
                  src={innercodeLogo}
                  alt="InnerCode"
                  className="max-h-32 w-full object-contain mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="text-sm font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Technology Partner
                </div>
              </div>
            </div>

            <div className="group relative aspect-square bg-surface-alt rounded-2xl p-10 flex items-center justify-center border border-border transition-all duration-500 hover:border-accent hover:shadow-lg">
              <div className="text-center w-full">
                <img
                  src={awipLogo}
                  alt="A Work In Progress"
                  className="max-h-32 w-full object-contain mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="text-sm font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Community Partner
                </div>
              </div>
            </div>

            <Link
              to="/get-involved"
              className="group aspect-square rounded-2xl border-2 border-dashed border-border flex items-center justify-center hover:border-accent transition-all duration-500"
            >
              <div className="text-center text-muted-foreground group-hover:text-accent-text transition-colors">
                <div className="text-base font-medium">Your Logo</div>
              </div>
            </Link>

            <Link
              to="/get-involved"
              className="group aspect-square rounded-2xl border-2 border-dashed border-border flex items-center justify-center hover:border-accent transition-all duration-500"
            >
              <div className="text-center text-muted-foreground group-hover:text-accent-text transition-colors">
                <div className="text-base font-medium">Partner With Us</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={eventPhotos[0]}
            alt="Join Our Mission"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/70 via-primary-deep/50 to-primary-deep/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <p className="eyebrow !text-accent mb-6">Join the Movement</p>
            <h2 className="font-heading text-5xl md:text-7xl font-extrabold mb-8 leading-tight drop-shadow-2xl">
              Empower Women on
              <br />
              Their Journey
            </h2>
            <p className="text-xl md:text-2xl text-white/95 mb-12 leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
              Your support helps women write their next chapter with dignity, safety,
              and opportunity.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/donate">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-primary-deep font-semibold px-12 py-7 text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Make a Donation <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/get-involved">
                <Button
                  size="lg"
                  className="bg-white/95 hover:bg-white text-primary-deep font-semibold px-12 py-7 text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
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
