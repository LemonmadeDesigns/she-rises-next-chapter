import { useState } from "react";
import VisitSchedulingModal from '@/components/modals/VisitSchedulingModal';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import { Phone, Mail, MapPin, Clock, Heart, MessageCircle, AlertTriangle, Users, QrCode } from "lucide-react";
import SendMessageButton from "@/components/ui/send-message-button";
import CallCrisisHotlineButton from "@/components/ui/call-crisis-hotline-button";
import { submitContactForm } from "@/config/contact";

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
    urgent: false,
    company: "" // Honeypot field
  });

  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  // Category mapping to convert values to full labels
  const categoryLabels: { [key: string]: string } = {
    services: "Program Services & Support",
    volunteer: "Volunteer Opportunities",
    donate: "Donations & Partnerships",
    media: "Media & Press Inquiries",
    feedback: "Feedback & Suggestions",
    other: "Other"
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Main Office",
      details: "(909) 547-9998",
      description: "Monday - Friday, 9:00 AM - 5:00 PM PST",
      color: "bg-royal-plum"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "pransom@safehavenforempowerment.org",
      description: "We respond within 1-2 business days",
      color: "bg-crown-gold"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "San Bernardino County",
      description: "Serving Southern California",
      color: "bg-lotus-rose"
    },
    {
      icon: QrCode,
      title: "Quick Connect",
      details: "",
      description: "Scan to save our contact info",
      color: "bg-royal-plum",
      isQrCode: true
    }
  ];

  const departments = [
    {
      name: "Program Services",
      email: "pransom@safehavenforempowerment.org",
      phone: "(909) 547-9998",
      description: "Questions about our housing, employment, and support programs"
    },
    {
      name: "Volunteer Coordination",
      email: "pransom@safehavenforempowerment.org", 
      phone: "(909) 547-9998",
      description: "Volunteer opportunities and training information"
    },
    {
      name: "Donations & Fundraising",
      email: "pransom@safehavenforempowerment.org",
      phone: "(909) 547-9998", 
      description: "Corporate partnerships, sponsorships, and major gifts"
    },
    {
      name: "Media & Communications",
      email: "pransom@safehavenforempowerment.org",
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
      // Get the full category label
      const categoryLabel = contactForm.category ? categoryLabels[contactForm.category] : 'Not specified';

      // Submit to Google Apps Script
      const result = await submitContactForm(
        contactForm.name,
        contactForm.email,
        contactForm.subject || contactForm.category || 'Contact Form Submission',
        `${contactForm.message}\n\nCategory: ${categoryLabel}${contactForm.urgent ? '\n\n**URGENT REQUEST**' : ''}`,
        contactForm.company,
        contactForm.phone,
        'Contact'
      );

      console.log('Response:', result);

      if (!result.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      // Reset form
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
        urgent: false,
        company: ""
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
                {info.isQrCode ? (
                  <>
                    <div className={`w-12 h-12 ${info.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-royal-plum mb-3">
                      {info.title}
                    </h3>
                    <div className="flex justify-center mb-2">
                      <img
                        src="/images/sherises_qr_code.png"
                        alt="She Rises Zelle QR Code"
                        className="w-40 h-40 object-contain rounded-lg border-2 border-crown-gold"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {info.description}
                    </p>
                  </>
                ) : (
                  <>
                    <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-royal-plum mb-2">
                      {info.title}
                    </h3>
                    <div className="text-sm font-semibold text-crown-gold mb-2 break-all">
                      {info.details}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </>
                )}
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
                
                <form onSubmit={handleSubmit} className="sherises-contact space-y-6">
                  {/* Honeypot field for spam protection */}
                  <input
                    type="text"
                    name="company"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={(e) => updateForm('company', e.target.value)}
                  />

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
                          If you're in immediate danger, dial 911. For crisis support, call 988 (Suicide & Crisis Lifeline) or 211 (Homeless Outreach).
                          She Rises is not a 24-hour crisis shelter.
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
              <Card key={index} className="shadow-soft transition-shadow h-full flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                    {dept.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-grow">
                    {dept.description}
                  </p>
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-crown-gold flex-shrink-0" />
                      <a href={`mailto:${dept.email}`} className="text-royal-plum font-medium hover:text-lotus-rose transition-colors">
                        {dept.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-crown-gold flex-shrink-0" />
                      <a href={`tel:${dept.phone}`} className="text-royal-plum font-medium hover:text-lotus-rose transition-colors">
                        {dept.phone}
                      </a>
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
            <Card className="p-6 h-full flex flex-col">
              <h3 className="font-serif text-lg font-bold text-royal-plum mb-4">
                How do I apply for housing assistance?
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Contact our Program Services team at (909) 547-9998 or visit our Programs page for detailed application information and eligibility requirements.
              </p>
              <div className="mt-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const programsSection = document.querySelector('[data-section="programs"]');
                    if (programsSection) {
                      programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.location.href = '/programs';
                    }
                  }}
                  className="w-full"
                >
                  Learn More About Programs
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 h-full flex flex-col">
              <h3 className="font-serif text-lg font-bold text-royal-plum mb-4">
                What volunteer opportunities are available?
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                We offer various volunteer roles including direct support, administrative help, and event assistance. Training is provided for all positions.
              </p>
              <div className="mt-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const volunteerSection = document.querySelector('[data-section="volunteer"]');
                    if (volunteerSection) {
                      volunteerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.location.href = '/get-involved';
                    }
                  }}
                  className="w-full"
                >
                  View Volunteer Opportunities
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 h-full flex flex-col">
              <h3 className="font-serif text-lg font-bold text-royal-plum mb-4">
                How can my organization partner with She Rises?
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                We welcome corporate partnerships and sponsorships. Contact our Development team at (909) 547-9998 to discuss partnership opportunities.
              </p>
              <div className="mt-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const partnershipSection = document.querySelector('[data-section="partnerships"]');
                    if (partnershipSection) {
                      partnershipSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.location.href = '/get-involved';
                    }
                  }}
                  className="w-full"
                >
                  Explore Partnerships
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 h-full flex flex-col">
              <h3 className="font-serif text-lg font-bold text-royal-plum mb-4">
                Is there a cost for your services?
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                All our support services are provided free of charge to participants. We believe that financial barriers should never prevent someone from getting help.
              </p>
              <div className="mt-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const servicesSection = document.querySelector('[data-section="services"]');
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.location.href = '/programs';
                    }
                  }}
                  className="w-full"
                >
                  Learn About Our Services
                </Button>
              </div>
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
            <Button 
              size="lg" 
              className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
              onClick={() => {
                const contactFormSection = document.querySelector('[data-section="contact-form"]');
                if (contactFormSection) {
                  contactFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Get Support Today
            </Button>
            <Button 
              size="lg" 
              className="hero-button-tertiary btn-force-visible"
              onClick={() => setIsVisitModalOpen(true)}
            >
              Schedule a Visit
            </Button>
          </div>
        </div>
      </section>
      
      <VisitSchedulingModal 
        open={isVisitModalOpen} 
        onOpenChange={setIsVisitModalOpen} 
      />
    </Layout>
  );
};

export default Contact;