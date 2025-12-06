import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import EventRegistrationModal from "@/components/modals/EventRegistrationModal";
import NewsletterSubscriptionModal from "@/components/modals/NewsletterSubscriptionModal";
import GenericContactModal from "@/components/modals/GenericContactModal";
import LazyImage from "@/components/images/LazyImage";
import { Calendar, Clock, MapPin, Users, Heart, Star, Filter, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import eventsData from "@/content/events.json";

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
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [isHostEventModalOpen, setIsHostEventModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.warn('Supabase connection failed, using fallback events:', error);
        // Fallback to events.json if Supabase is unavailable
        const fallbackEvents = eventsData.events.map(event => ({
          ...event,
          registered: 0,
          capacity: 50,
          price: event.price || "Free",
          category: event.category || "general",
          type: event.type || "In-Person",
          highlights: event.highlights || []
        }));
        setEvents(fallbackEvents);
        setLoading(false);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.warn('Supabase connection error, using fallback events:', error);
      // Fallback to events.json if Supabase throws an error
      const fallbackEvents = eventsData.events.map(event => ({
        ...event,
        registered: 0,
        capacity: 50,
        price: event.price || "Free",
        category: event.category || "general",
        type: event.type || "In-Person",
        highlights: event.highlights || []
      }));
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);


  const categories = [
    { id: "all", name: "All Events" },
    { id: "fundraising", name: "Fundraising" },
    { id: "wellness", name: "Wellness" },
    { id: "employment", name: "Employment" },
    { id: "support", name: "Support Groups" },
    { id: "volunteer", name: "Volunteer" },
    { id: "education", name: "Education" },
    { id: "general", name: "General" }
  ];

  // Dynamically generate months from events
  const getMonthsFromEvents = () => {
    const monthSet = new Set<string>();
    events.forEach(event => {
      if (event.date) {
        const monthKey = event.date.substring(0, 7); // "2025-11"
        monthSet.add(monthKey);
      }
    });

    const monthsList = [{ id: "all", name: "All Months" }];
    Array.from(monthSet).sort().forEach(monthKey => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      monthsList.push({ id: monthKey, name: monthName });
    });

    return monthsList;
  };

  const months = getMonthsFromEvents();

  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === "all" || (event.category || 'general') === selectedCategory;
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

  const getCategoryImage = (category: string, eventId: string) => {
    const categoryImages: Record<string, string> = {
      fundraising: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
      wellness: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop",
      employment: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
      support: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
      volunteer: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop",
      education: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
      general: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
    };
    return categoryImages[category] || categoryImages.general;
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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading events...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Events & Workshops"
        subtitle="Join us for community outreach, reentry fairs, and empowerment activities across Southern California. New events are added regularly."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a href="#all-events">
            <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
              View Upcoming Events
            </Button>
          </a>
          <Button
            size="lg"
            className="hero-button-secondary btn-force-visible"
            onClick={() => setIsHostEventModalOpen(true)}
          >
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

          {featuredEvents.length === 0 ? (
            <Card className="mb-16">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-royal-plum mb-2">No Featured Events Yet</h3>
                <p className="text-muted-foreground">Check back soon for upcoming featured events!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden shadow-soft transition-shadow h-full flex flex-col">
                <LazyImage
                  src={event.image || getCategoryImage(event.category || 'general', event.id)}
                  alt={event.title}
                  aspectRatio="16/9"
                  className="hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getCategoryColor(event.category || 'general')}>
                      {(event.category || 'general').charAt(0).toUpperCase() + (event.category || 'general').slice(1)}
                    </Badge>
                    <Badge className="bg-crown-gold text-royal-plum">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
                    {event.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.registered || 0}/{event.capacity || 0} registered</span>
                    </div>
                  </div>
                  
                  {event.highlights && event.highlights.length > 0 && (
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
                  )}

                  <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-royal-plum text-lg">{event.price || 'Free'}</span>
                    <Button
                      className="bg-royal-plum hover:bg-royal-plum/90 text-white"
                      onClick={() => handleRegisterClick(event)}
                      disabled={(event.registered || 0) >= (event.capacity || 0)}
                    >
                      {(event.registered || 0) >= (event.capacity || 0) ? 'Event Full' : 'Register Now'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* All Events */}
      <section id="all-events" className="py-20 bg-white">
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
                  <div className="block text-sm font-medium text-royal-plum mb-2">
                    Category
                  </div>
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
                  <div className="block text-sm font-medium text-royal-plum mb-2">
                    Month
                  </div>
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
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-royal-plum mb-2">No Events Found</h3>
                <p className="text-muted-foreground mb-4">
                  {events.length === 0
                    ? "No events have been scheduled yet. Check back soon!"
                    : "No events match your current filters. Try adjusting your search criteria."}
                </p>
                {events.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedMonth("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden shadow-soft transition-shadow h-full flex flex-col">
                <LazyImage
                  src={event.image || getCategoryImage(event.category || 'general', event.id)}
                  alt={event.title}
                  aspectRatio="16/9"
                  className="hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getCategoryColor(event.category || 'general')}>
                      {(event.category || 'general').charAt(0).toUpperCase() + (event.category || 'general').slice(1)}
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
                  
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
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
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{event.type || 'In-Person'}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-royal-plum">{event.price || 'Free'}</span>
                    <Button
                      size="sm"
                      className="bg-royal-plum hover:bg-royal-plum/90 text-white"
                      onClick={() => handleRegisterClick(event)}
                      disabled={(event.registered || 0) >= (event.capacity || 0)}
                    >
                      {(event.registered || 0) >= (event.capacity || 0) ? 'Full' : 'Register'}
                    </Button>
                  </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Community Impact */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Our Community Impact
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            As a growing organization, She Rises is building strong connections through outreach, reentry partnerships, and community engagement across Southern California.
          </p>

          <div className="max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-crown-gold mb-6">2025 Highlights:</h3>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <ul className="space-y-4 text-left">
                <li className="flex items-start">
                  <span className="text-crown-gold mr-3 text-xl">•</span>
                  <span className="text-white text-lg">Participation in regional reentry fairs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crown-gold mr-3 text-xl">•</span>
                  <span className="text-white text-lg">Outreach to justice-impacted women and families</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crown-gold mr-3 text-xl">•</span>
                  <span className="text-white text-lg">Growing partnerships with community organizations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crown-gold mr-3 text-xl">•</span>
                  <span className="text-white text-lg">Increasing visibility and support for women in transition</span>
                </li>
              </ul>
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
            <Button
              size="lg"
              className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
              onClick={() => setIsPartnerModalOpen(true)}
            >
              Partner With Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsHostEventModalOpen(true)}
            >
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
          
          <Button
            size="lg"
            className="bg-white text-lotus-rose hover:bg-white/90 font-bold"
            onClick={() => setIsNewsletterModalOpen(true)}
          >
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

      {/* Newsletter Subscription Modal */}
      <NewsletterSubscriptionModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
      />

      {/* Host Event Modal */}
      <GenericContactModal
        isOpen={isHostEventModalOpen}
        onClose={() => setIsHostEventModalOpen(false)}
        title="Host an Event with She Rises"
        subtitle="Partner with us to create meaningful events that empower women in our community"
        inquiryType="Event Hosting"
        options={[
          { value: "workshop", label: "Workshop or Training Session" },
          { value: "fundraiser", label: "Fundraising Event" },
          { value: "community", label: "Community Gathering" },
          { value: "awareness", label: "Awareness Campaign" },
          { value: "volunteer", label: "Volunteer Event" },
          { value: "other", label: "Other Event Type" }
        ]}
      />

      {/* Partnership Modal */}
      <GenericContactModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        title="Partner with She Rises"
        subtitle="Let's collaborate to create impactful events that support our mission"
        inquiryType="Event Partnership"
        options={[
          { value: "venue", label: "Venue Partnership" },
          { value: "sponsor", label: "Event Sponsorship" },
          { value: "collaboration", label: "Co-Host Collaboration" },
          { value: "vendor", label: "Vendor/Service Partnership" },
          { value: "speaker", label: "Speaker/Presenter" },
          { value: "other", label: "Other Partnership" }
        ]}
      />
    </Layout>
  );
};

export default Events;