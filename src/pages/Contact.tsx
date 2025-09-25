import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import { Phone, Mail, MapPin, Clock, Heart, MessageCircle, AlertTriangle, Users } from "lucide-react";
import SendMessageButton from "@/components/ui/send-message-button";
import CallCrisisHotlineButton from "@/components/ui/call-crisis-hotline-button";

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
    urgent: false
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Main Office",
      details: "(909) 547-9998",
      description: "Monday - Friday, 9:00 AM - 5:00 PM",
      color: "bg-royal-plum"
    },
    {
      icon: Phone,
      title: "24/7 Crisis Hotline",
      details: "(909) 547-9998",
      description: "Available 24 hours a day, 7 days a week",
      color: "bg-lotus-rose"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "info@sherises.org",
      description: "We respond within 24 hours",
      color: "bg-crown-gold"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Hope Street",
      description: "Your City, State 12345",
      color: "bg-sage-green"
    }
  ];

  const departments = [
    {
      name: "Program Services",
      email: "programs@sherises.org",
      phone: "(909) 547-9998",
      description: "Questions about our housing, employment, and support programs"
    },
    {
      name: "Volunteer Coordination",
      email: "volunteer@sherises.org", 
      phone: "(909) 547-9998",
      description: "Volunteer opportunities and training information"
    },
    {
      name: "Donations & Fundraising",
      email: "development@sherises.org",
      phone: "(909) 547-9998", 
      description: "Corporate partnerships, sponsorships, and major gifts"
    },
    {
      name: "Media & Communications",
      email: "media@sherises.org",
      phone: "(909) 547-9998",
      description: "Press inquiries, interviews, and media requests"
    }
  ];

  const emergencyContacts = [
    {
      service: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      available: "24/7"
    },
    {
      service: "National Suicide Prevention Lifeline", 
      number: "988",
      available: "24/7"
    },
    {
      service: "Crisis Text Line",
      number: "Text HOME to 741741",
      available: "24/7"
    },
    {
      service: "Local Emergency Services",
      number: "911",
      available: "24/7"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    
    try {
      console.log('Sending email with form data:', contactForm);
      
      const response = await fetch(`https://ktaleplbvgicjugcwthj.supabase.co/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0YWxlcGxidmdpY2p1Z2N3dGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjMzMTUsImV4cCI6MjA3MzQzOTMxNX0.imvT4rK3amfJm6KZRywwksQF4KSu-aLxpSP4Rt_wsOw`
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          reason: contactForm.category,
          message: `Subject: ${contactForm.subject}\n\n${contactForm.message}${contactForm.urgent ? '\n\n**URGENT REQUEST**' : ''}`
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to send message: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
      
      // Reset form
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
        urgent: false
      });
      
      alert('Thank you for contacting She Rises! We have received your message and will respond within 24-48 hours. Your voice matters to us.');
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('There was an error sending your message. Please try again or call us at (909) 547-9998.');
    }
  };

  const updateForm = (field: string, value: string | boolean) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Contact Us"
        subtitle="We're here to help. Reach out to us for support, questions, or to learn more about how you can get involved with our mission."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <SendMessageButton />
          <CallCrisisHotlineButton />
        </div>
      </Hero>

      {/* Quick Contact Info */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Get in Touch"
            subtitle="Multiple ways to connect with us for support, questions, or collaboration"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6 shadow-soft transition-shadow">
                <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-royal-plum mb-2">
                  {info.title}
                </h3>
                <div className="text-lg font-semibold text-crown-gold mb-2">
                  {info.details}
                </div>
                <p className="text-sm text-muted-foreground">
                  {info.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Office Hours */}
      <section className="py-20 bg-white" data-section="contact-form">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6">
                  Send Us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => updateForm('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={contactForm.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">How can we help? *</Label>
                    <Select 
                      value={contactForm.category} 
                      onValueChange={(value) => updateForm('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="services">Program Services & Support</SelectItem>
                        <SelectItem value="volunteer">Volunteer Opportunities</SelectItem>
                        <SelectItem value="donate">Donations & Partnerships</SelectItem>
                        <SelectItem value="media">Media & Press Inquiries</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => updateForm('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => updateForm('message', e.target.value)}
                      placeholder="Please provide details about your inquiry..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="bg-warm-cream rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-lotus-rose mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-royal-plum font-medium mb-1">
                          Crisis or Emergency?
                        </p>
                        <p className="text-sm text-muted-foreground">
                          If you're in immediate danger or experiencing a crisis, please call our 24/7 hotline at 
                          <span className="font-bold text-lotus-rose"> (909) 547-9998</span> or dial 911.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Info and Hours */}
            <div className="space-y-8">
              {/* Office Hours */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="h-6 w-6 text-crown-gold" />
                    <h3 className="font-serif text-2xl font-bold text-royal-plum">
                      Office Hours
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-royal-plum">Monday - Friday</span>
                      <span className="text-muted-foreground">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-royal-plum">Saturday</span>
                      <span className="text-muted-foreground">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-royal-plum">Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-royal-plum">24/7 Crisis Line</span>
                      <span className="text-lotus-rose font-bold">(909) 547-9998</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-6 w-6 text-crown-gold" />
                    <h3 className="font-serif text-2xl font-bold text-royal-plum">
                      Our Location
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-royal-plum">She Rises - Safe Haven for Empowerment</p>
                      <p className="text-muted-foreground">123 Hope Street</p>
                      <p className="text-muted-foreground">Your City, State 12345</p>
                    </div>
                    
                    <div className="bg-gradient-soft rounded-lg p-4">
                      <p className="text-sm text-royal-plum font-medium mb-2">Getting Here:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Free parking available on-site</li>
                        <li>• Public transit: Bus routes 15, 23, 45</li>
                        <li>• Wheelchair accessible entrance</li>
                        <li>• Childcare available during appointments</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Department Directory"
            subtitle="Connect directly with the right team for faster assistance"
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="shadow-soft transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
                    {dept.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {dept.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-crown-gold" />
                      <span className="text-royal-plum font-medium">{dept.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-crown-gold" />
                      <span className="text-royal-plum font-medium">{dept.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="py-20 bg-lotus-rose text-white" data-section="emergency-resources">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AlertTriangle className="h-12 w-12 text-crown-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold mb-4">
              Emergency Resources
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              If you're in crisis or need immediate assistance, these resources are available 24/7
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white shadow-soft">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{contact.service}</h3>
                  <div className="text-2xl font-bold text-crown-gold mb-2">{contact.number}</div>
                  <p className="text-sm text-white/90">Available {contact.available}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-white text-lotus-rose hover:bg-white/90 font-bold">
              Call Our Crisis Line Now
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions about our services and support"
          />
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-royal-plum mb-3">
                How do I apply for housing assistance?
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact our Program Services team at (909) 547-9998 or visit our Programs page for detailed application information and eligibility requirements.
              </p>
              <Button variant="outline" size="sm">
                Learn More About Programs
              </Button>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-royal-plum mb-3">
                What volunteer opportunities are available?
              </h3>
              <p className="text-muted-foreground mb-4">
                We offer various volunteer roles including direct support, administrative help, and event assistance. Training is provided for all positions.
              </p>
              <Button variant="outline" size="sm">
                View Volunteer Opportunities
              </Button>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-royal-plum mb-3">
                How can my organization partner with She Rises?
              </h3>
              <p className="text-muted-foreground mb-4">
                We welcome corporate partnerships and sponsorships. Contact our Development team at (909) 547-9998 to discuss partnership opportunities.
              </p>
              <Button variant="outline" size="sm">
                Explore Partnerships
              </Button>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-royal-plum mb-3">
                Is there a cost for your services?
              </h3>
              <p className="text-muted-foreground mb-4">
                All our support services are provided free of charge to participants. We believe that financial barriers should never prevent someone from getting help.
              </p>
              <Button variant="outline" size="sm">
                Learn About Our Services
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Connect With Us */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-12 w-12 text-crown-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold mb-4">
            We're Here for You
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            No matter what brings you to us, know that you're not alone. Our team is dedicated to providing compassionate support and connecting you with the resources you need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
              Get Support Today
            </Button>
            <Button size="lg" className="hero-button-tertiary btn-force-visible">
              Schedule a Visit
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;