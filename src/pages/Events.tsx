import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import EventRegistrationModal from "@/components/modals/EventRegistrationModal";
import { Calendar, Clock, MapPin, Users, Heart, Star, Filter, ArrowRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  category: string;
  type: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  image: string;
  price: string;
  capacity: number;
  registered: number;
  featured: boolean;
  highlights: string[];
}

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const events = [
    {
      id: "fundraising-gala",
      title: "Annual Hope & Healing Fundraising Gala",
      category: "fundraising",
      type: "In-Person",
      date: "2024-03-15",
      time: "6:00 PM - 10:00 PM",
      location: "Grand Ballroom, Downtown Hotel",
      address: "123 Main Street, Your City",
      description: "Join us for an elegant evening celebrating the strength and resilience of women in our community. This annual gala raises critical funds for our housing and support programs.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&crop=center",
      price: "$150 per person",
      capacity: 300,
      registered: 185,
      featured: true,
      highlights: [
        "Keynote speaker: Dr. Maya Johnson, advocate for women's rights",
        "Silent auction featuring local artists",
        "Three-course dinner with wine pairing",
        "Live music and entertainment",
        "Award presentation to community champions"
      ]
    },
    {
      id: "wellness-workshop",
      title: "Monthly Wellness Workshop: Self-Care Saturday",
      category: "wellness",
      type: "In-Person",
      date: "2024-02-24",
      time: "10:00 AM - 2:00 PM",
      location: "She Rises Community Center",
      address: "123 Hope Street, Your City",
      description: "A monthly wellness workshop focused on self-care practices, mental health awareness, and building supportive community connections.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center",
      price: "Free",
      capacity: 50,
      registered: 32,
      featured: false,
      highlights: [
        "Guided meditation and mindfulness exercises",
        "Healthy cooking demonstration",
        "Arts and crafts therapy session",
        "Support group discussions",
        "Resource fair with local wellness providers"
      ]
    },
    {
      id: "job-fair",
      title: "Community Job Fair & Career Expo",
      category: "employment",
      type: "In-Person",
      date: "2024-03-08",
      time: "9:00 AM - 3:00 PM",
      location: "Community College Convention Center",
      address: "456 Education Drive, Your City",
      description: "Connect with local employers actively seeking to hire women from diverse backgrounds. Features on-the-spot interviews and career development resources.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
      price: "Free",
      capacity: 200,
      registered: 89,
      featured: true,
      highlights: [
        "50+ local employers participating",
        "Resume review and career coaching",
        "Professional headshot sessions",
        "Skills assessment opportunities",
        "Transportation vouchers provided"
      ]
    },
    {
      id: "support-group",
      title: "Weekly Support Circle: Healing Together",
      category: "support",
      type: "In-Person",
      date: "Every Thursday",
      time: "6:00 PM - 7:30 PM",
      location: "She Rises Community Center",
      address: "123 Hope Street, Your City",
      description: "A safe, confidential space for women to share experiences, build connections, and support each other on their healing journey.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&crop=center",
      price: "Free",
      capacity: 15,
      registered: 12,
      featured: false,
      highlights: [
        "Licensed therapist facilitation",
        "Peer support and connection",
        "Coping strategies and tools",
        "Light refreshments provided",
        "Childcare available with advance notice"
      ]
    },
    {
      id: "volunteer-orientation",
      title: "Volunteer Orientation & Training",
      category: "volunteer",
      type: "Hybrid",
      date: "2024-02-20",
      time: "6:00 PM - 8:00 PM",
      location: "She Rises Community Center / Virtual",
      address: "123 Hope Street, Your City",
      description: "Learn about volunteer opportunities with She Rises and receive training on our trauma-informed approach to supporting women in transition.",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&crop=center",
      price: "Free",
      capacity: 40,
      registered: 23,
      featured: false,
      highlights: [
        "Overview of She Rises programs and mission",
        "Trauma-informed care training",
        "Volunteer role descriptions and matching",
        "Background check process explained",
        "Meet current volunteers and staff"
      ]
    },
    {
      id: "educational-webinar",
      title: "Financial Literacy Workshop Series",
      category: "education",
      type: "Virtual",
      date: "2024-03-01",
      time: "7:00 PM - 8:30 PM",
      location: "Zoom Meeting",
      address: "Online",
      description: "Four-part series covering budgeting, credit repair, savings strategies, and homeownership preparation specifically designed for women rebuilding their financial lives.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&crop=center",
      price: "Free",
      capacity: 100,
      registered: 67,
      featured: false,
      highlights: [
        "Expert financial advisor facilitation",
        "Interactive budgeting tools and templates",
        "One-on-one financial counseling sessions available",
        "Digital workbook and resources",
        "Follow-up support and check-ins"
      ]
    }
  ];

  const categories = [
    { id: "all", name: "All Events" },
    { id: "fundraising", name: "Fundraising" },
    { id: "wellness", name: "Wellness" },
    { id: "employment", name: "Employment" },
    { id: "support", name: "Support Groups" },
    { id: "volunteer", name: "Volunteer" },
    { id: "education", name: "Education" }
  ];

  const months = [
    { id: "all", name: "All Months" },
    { id: "2024-02", name: "February 2024" },
    { id: "2024-03", name: "March 2024" },
    { id: "2024-04", name: "April 2024" }
  ];

  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
    const monthMatch = selectedMonth === "all" || event.date.startsWith(selectedMonth);
    return categoryMatch && monthMatch;
  });

  const featuredEvents = events.filter(event => event.featured);

  const getCategoryColor = (category: string) => {
    const colors = {
      fundraising: "bg-lotus-rose text-white",
      wellness: "bg-crown-gold text-royal-plum",
      employment: "bg-royal-plum text-white",
      support: "bg-sage-green text-white",
      volunteer: "bg-warm-cream text-royal-plum",
      education: "bg-muted text-muted-foreground"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const formatDate = (dateString: string) => {
    if (dateString.includes("Every")) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setIsRegistrationModalOpen(true);
  };

  const closeRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Events & Workshops"
        subtitle="Join our community for empowering events, educational workshops, and meaningful connections. Together, we rise stronger."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
            View Upcoming Events
          </Button>
          <Button size="lg" className="bg-royal-plum border-2 border-crown-gold text-crown-gold hover:bg-crown-gold hover:text-royal-plum font-bold">
            Host an Event
          </Button>
        </div>
      </Hero>

      {/* Featured Events */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Featured Events"
            subtitle="Don't miss these special events that make a lasting impact in our community"
          />
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-soft transition-shadow">
                <div className="aspect-video bg-warm-cream overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </Badge>
                    <Badge className="bg-crown-gold text-royal-plum">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
                    {event.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.registered}/{event.capacity} registered</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-royal-plum">Event Highlights:</h4>
                    <ul className="space-y-1">
                      {event.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-crown-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-royal-plum text-lg">{event.price}</span>
                    <Button 
                      className="bg-royal-plum hover:bg-royal-plum/90 text-white"
                      onClick={() => handleRegisterClick(event)}
                      disabled={event.registered >= event.capacity}
                    >
                      {event.registered >= event.capacity ? 'Event Full' : 'Register Now'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="All Events"
            subtitle="Explore our full calendar of empowering events and workshops"
          />

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-royal-plum mb-2">
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-royal-plum mb-2">
                    Month
                  </label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.id} value={month.id}>
                          {month.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedMonth("all");
                    }}
                    className="w-full flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-soft transition-shadow">
                <div className="aspect-video bg-warm-cream overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </Badge>
                    {event.featured && (
                      <Badge className="bg-crown-gold text-royal-plum">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
                    {event.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {event.description.length > 120 
                      ? `${event.description.substring(0, 120)}...` 
                      : event.description
                    }
                  </p>
                  
                  <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{event.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-royal-plum">{event.price}</span>
                    <Button 
                      size="sm" 
                      className="bg-royal-plum hover:bg-royal-plum/90 text-white"
                      onClick={() => handleRegisterClick(event)}
                      disabled={event.registered >= event.capacity}
                    >
                      {event.registered >= event.capacity ? 'Full' : 'Register'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Statistics */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Community Impact Through Events
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Our events bring the community together and create lasting connections while raising awareness and funds for our mission.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">50+</div>
              <p className="text-white/90">Events hosted annually</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">2,500+</div>
              <p className="text-white/90">Community members engaged</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">$125K</div>
              <p className="text-white/90">Raised through events last year</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">95%</div>
              <p className="text-white/90">Participant satisfaction rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-royal-plum mb-6">
            Want to Host an Event?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Partner with She Rises to create meaningful events that support our mission and empower women in our community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
              Partner With Us
            </Button>
            <Button size="lg" variant="outline">
              Event Planning Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-lotus-rose text-white">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-12 w-12 text-crown-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold mb-4">
            Stay Connected
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to be the first to know about upcoming events, workshops, and opportunities to get involved.
          </p>
          
          <Button size="lg" className="bg-white text-lotus-rose hover:bg-white/90 font-bold">
            Subscribe to Newsletter
          </Button>
        </div>
      </section>

      {/* Event Registration Modal */}
      <EventRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={closeRegistrationModal}
        event={selectedEvent}
      />
    </Layout>
  );
};

export default Events;