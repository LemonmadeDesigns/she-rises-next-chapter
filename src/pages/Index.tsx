import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Home, Briefcase, Users, Heart, Link as LinkIcon, Calendar, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import heroImage from "@/assets/she-rises-banner.png";
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
      {/* Hero Section with Enhanced Parallax */}
      <section className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-royal-plum/30 via-transparent to-royal-plum/70"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-6 max-w-6xl mx-auto">
            <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight drop-shadow-2xl">
              Every Woman Deserves a 
              <span className="block text-crown-gold drop-shadow-xl text-shadow-glow">Safe Place to Rise</span>
            </h1>
            <p className="text-2xl md:text-4xl mb-12 font-light max-w-4xl mx-auto drop-shadow-lg text-shadow-subtle">
              Here we help you write the next chapter
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-crown-gold hover:bg-lotus-rose text-royal-plum font-bold px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-crown-gold/50 transition-all duration-300 transform hover:scale-110 border-2 border-crown-gold"
              >
                <Link to="/about" className="flex items-center gap-2">
                  Learn More <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-3 border-white text-white hover:bg-white hover:text-royal-plum px-12 py-6 text-xl rounded-2xl shadow-2xl backdrop-blur-md bg-white/20 hover:bg-white transition-all duration-300 transform hover:scale-110"
              >
                <Link to="/donate" className="flex items-center gap-2">
                  Donate Now <Heart className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-32 right-20 text-crown-gold/40 text-8xl animate-pulse">✨</div>
        <div className="absolute bottom-32 left-20 text-crown-gold/40 text-6xl animate-pulse delay-1000">✨</div>
        <div className="absolute top-1/2 right-10 text-lotus-rose/30 text-4xl animate-bounce">🦋</div>
      </section>

      {/* Programs Section - Card Grid Style */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-lotus-rose/40 text-5xl">🦋</div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-royal-plum mb-4">
              Our Programs
            </h2>
            <div className="absolute -bottom-4 right-1/2 transform translate-x-1/2 text-lotus-rose/40 text-5xl">🦋</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover:shadow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-lotus-rose rounded-2xl flex items-center justify-center mb-3">
                  <Home className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-royal-plum mb-2">Safe Housing</h3>
            </Card>

            <Card className="p-6 text-center hover:shadow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-lotus-rose rounded-2xl flex items-center justify-center mb-3">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-royal-plum mb-2">Healthcare Access</h3>
            </Card>

            <Card className="p-6 text-center hover:shadow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-lotus-rose rounded-2xl flex items-center justify-center mb-3">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-royal-plum mb-2">Employment Support</h3>
            </Card>

            <Card className="p-6 text-center hover:shadow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-lotus-rose rounded-2xl flex items-center justify-center mb-3">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-royal-plum mb-2">Benefits & Legal Navigation</h3>
            </Card>

            <Card className="p-6 text-center hover:shadow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-lotus-rose rounded-2xl flex items-center justify-center mb-3">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-royal-plum mb-2">Identity Documents</h3>
            </Card>

            <Card className="p-6 text-center hover:shadow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-lotus-rose rounded-2xl flex items-center justify-center mb-3">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-royal-plum mb-2">Community Referrals</h3>
            </Card>

            <Card className="p-6 text-center hover:shadow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-lotus-rose rounded-2xl flex items-center justify-center mb-3">
                  <LinkIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-royal-plum mb-2">Referrals</h3>
            </Card>
            
            <div className="flex items-center justify-center">
              <Link to="/programs">
                <Button className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold">
                  View All Programs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute top-10 left-10 text-lotus-rose/30 text-4xl">🦋</div>
        <div className="absolute bottom-10 right-10 text-lotus-rose/30 text-4xl">🦋</div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-royal-plum mb-8">
            Testimonials
          </h2>
          <blockquote className="text-xl md:text-2xl text-muted-foreground italic max-w-2xl mx-auto">
            "I felt hopeless when I got out. Here, I found a stable place to live and women who believed in me."
          </blockquote>
          <p className="text-muted-foreground mt-4">— Former program participant</p>
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

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-royal-plum mb-6">
            Empower women on their journey
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your support helps women write their next chapter with dignity, safety, and opportunity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved">
              <Button size="lg" className="bg-lotus-rose hover:bg-lotus-rose/90 text-white font-semibold">
                Get Involved
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold">
                Donate Today
              </Button>
            </Link>
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