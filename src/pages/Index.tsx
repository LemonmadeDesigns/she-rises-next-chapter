import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Home, Briefcase, Users, Heart, Link as LinkIcon, Calendar, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import heroImage from "@/assets/hero-woman.jpg";
import transitionalHomeImage from "@/assets/transitional-home.jpg";
import mentoringImage from "@/assets/mentoring.jpg";
import employmentImage from "@/assets/employment-readiness.jpg";

const Index = () => {
  const programs = [
    {
      title: "Transitional Housing",
      description: "Safe, stable housing with community guidelines and case management",
      icon: Home,
      image: transitionalHomeImage,
      href: "/programs#transitional-housing"
    },
    {
      title: "Supportive Services", 
      description: "Employment readiness, life skills workshops, and peer mentoring",
      icon: Users,
      image: mentoringImage,
      href: "/programs#supportive-services"
    },
    {
      title: "Reentry Resources",
      description: "Legal aid, healthcare, childcare, transportation connections",
      icon: LinkIcon,
      image: employmentImage,
      href: "/programs#reentry-resources"
    }
  ];

  const upcomingEvents = [
    {
      title: "HIRE Reentry Resource Fair",
      date: "September 17, 2025",
      location: "Honda Center, Anaheim",
      href: "/events#hire-fair"
    },
    {
      title: "She Rises Community Launch",
      date: "November 2025",
      location: "San Bernardino County",
      href: "/events#community-launch"
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
      <section className="relative min-h-[80vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-hero"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Every Woman Deserves a 
            <span className="block text-crown-gold">Safe Place to Rise</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Here we help you write the next chapter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about">
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-royal-plum">
                Learn More
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-royal-plum mb-4">
              Our Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We help women stabilize, rebuild, and thrive through comprehensive support services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const IconComponent = program.icon;
              return (
                <Card key={index} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-royal-plum/20 group-hover:bg-royal-plum/10 transition-colors"></div>
                    <div className="absolute top-4 left-4">
                      <div className="bg-crown-gold/90 p-3 rounded-full">
                        <IconComponent className="h-6 w-6 text-royal-plum" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-royal-plum mb-3">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {program.description}
                    </p>
                    <Link to={program.href}>
                      <Button variant="outline" className="group-hover:bg-lotus-rose group-hover:text-white transition-colors">
                        Explore Programs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="font-serif text-3xl md:text-4xl font-bold italic">
            "When SHE rises, we all rise."
          </blockquote>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-royal-plum mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Join us for connection, resources, and community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-soft transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-royal-plum mb-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {event.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-crown-gold text-crown-gold">
                      Featured
                    </Badge>
                  </div>
                  <Link to={event.href}>
                    <Button size="sm" className="bg-lotus-rose hover:bg-lotus-rose/90 text-white">
                      RSVP
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/events">
              <Button variant="outline" size="lg">
                See All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-royal-plum text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-crown-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-royal-plum mb-4">
              Stay Connected
            </h2>
            <p className="text-muted-foreground mb-8">
              Join our mailing list to receive updates about our programs, events, and ways to get involved
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-royal-plum mb-8">
              Stories of Rising
            </h2>
            <blockquote className="text-xl md:text-2xl text-muted-foreground italic mb-4">
              "I felt hopeless when I got out. Here, I found a stable place to live and women who believed in me."
            </blockquote>
            <p className="text-muted-foreground">— Former program participant</p>
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