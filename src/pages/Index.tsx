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
import heroImage from "@/assets/she-rises-banner.png";
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

  const stats = [
    { number: "300+", label: "women supported annually" },
    { number: "1,000+", label: "successful reentries" },
    { number: "5", label: "housing sites" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title={
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl">
            Every Woman Deserves a<br />
            <span className="text-crown-gold drop-shadow-xl">Safe Place to Rise</span>
          </h1>
        }
        subtitle="Here we help you write the next chapter"
        backgroundImage={heroImage}
        fullHeight
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link to="/about">
            <Button 
              size="lg" 
              className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold px-10 py-6 text-lg rounded-2xl shadow-2xl"
            >
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/donate">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-royal-plum px-10 py-6 text-lg rounded-2xl backdrop-blur-md bg-white/10"
            >
              Donate Now <Heart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Three Pillars Section */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Programs"
            subtitle="We help women stabilize, rebuild, and thrive through comprehensive support services"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <ProgramCard
                key={index}
                title={pillar.title}
                description={pillar.description}
                icon={pillar.icon}
                image={pillar.image}
                href={pillar.href}
              />
            ))}
          </div>

          {/* Pull Quote */}
          <div className="mt-16 text-center">
            <blockquote className="text-3xl md:text-4xl font-serif text-royal-plum italic">
              "When SHE rises, we all rise."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Upcoming Events Teaser */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Join us for connection, resources, and community"
          />
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                donationsNeeded={event.donationsNeeded}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/events">
              <Button variant="outline" size="lg" className="border-lotus-rose text-lotus-rose hover:bg-lotus-rose hover:text-white">
                See All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-soft">
                <div className="text-4xl md:text-5xl font-bold text-royal-plum mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-royal-plum mb-4">
              Stay Connected
            </h2>
            <p className="text-muted-foreground mb-8">
              Join our mailing list to receive updates about our programs, events, and ways to get involved
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                autoComplete="email"
                required
              />
              <Button type="submit" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Partner/Sponsor Section */}
      <section className="py-16 bg-warm-cream">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Partners"
            subtitle="Together, we're building stronger communities"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-center">
            {/* Actual Partner Logos */}
            <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-105 min-h-[19rem]">
              <img
                src="/partners/innercode-og-logo.png"
                alt="InnerCode - Technology Partner"
                className="max-h-64 w-auto object-contain transition-all duration-300 hover:scale-110"
              />
            </div>
            <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-105 min-h-[19rem]">
              <img
                src="/partners/AWIP-Mission.png"
                alt="AWIP - Community Partner"
                className="max-h-64 w-auto object-contain transition-all duration-300 hover:scale-110"
              />
            </div>
            {/* Placeholder for future partners */}
            <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 group min-h-[19rem]">
              <div className="text-center text-gray-400 group-hover:text-lotus-rose transition-colors">
                <div className="text-sm font-medium mb-1">Your Organization</div>
                <div className="text-xs">Partner with us</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 group min-h-[19rem]">
              <div className="text-center text-gray-400 group-hover:text-lotus-rose transition-colors">
                <div className="text-sm font-medium mb-1">Become a Partner</div>
                <div className="text-xs">Join our mission</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-royal-plum mb-6">
            Empower Women on Their Journey
          </h2>
          <p className="text-lg text-royal-plum/80 mb-8 max-w-2xl mx-auto">
            Your support helps women write their next chapter with dignity, safety, and opportunity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved">
              <Button size="lg" variant="outline" className="border-royal-plum text-royal-plum hover:bg-royal-plum hover:text-white">
                Get Involved
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" className="bg-royal-plum hover:bg-royal-plum/90 text-white">
                Donate Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;