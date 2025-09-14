import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import { Heart, Users, Clock, Calendar, HandHeart, Building2, DollarSign, Gift, ArrowRight, CheckCircle } from "lucide-react";

const GetInvolved = () => {
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    interests: [] as string[],
    availability: "",
    experience: "",
    background: false
  });

  const [sponsorForm, setSponsorForm] = useState({
    organization: "",
    contact: "",
    email: "",
    sponsorship: "",
    amount: "",
    message: ""
  });

  const opportunities = [
    {
      id: "direct-support",
      title: "Direct Support Volunteer",
      category: "Direct Service",
      commitment: "4-8 hours/week",
      description: "Work directly with women in our programs, providing mentorship, life skills support, and companionship.",
      requirements: [
        "Background check required",
        "Training provided",
        "6-month minimum commitment",
        "Trauma-informed care training"
      ],
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: "administrative",
      title: "Administrative Support",
      category: "Office Support",
      commitment: "2-4 hours/week",
      description: "Help with data entry, filing, phone calls, and general office tasks that keep our programs running smoothly.",
      requirements: [
        "Basic computer skills",
        "Reliable schedule",
        "Detail-oriented",
        "Professional communication"
      ],
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "events",
      title: "Event Support Team",
      category: "Events",
      commitment: "Flexible",
      description: "Help plan and execute fundraising events, community workshops, and awareness campaigns.",
      requirements: [
        "Enthusiasm for event planning",
        "Good communication skills",
        "Team player attitude",
        "Weekend availability preferred"
      ],
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: "professional",
      title: "Professional Skills Volunteer",
      category: "Professional Services",
      commitment: "1-3 hours/week",
      description: "Share your professional expertise in areas like legal aid, financial counseling, healthcare, or career coaching.",
      requirements: [
        "Professional certification/license",
        "Relevant experience",
        "Cultural sensitivity training",
        "Flexible schedule"
      ],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "childcare",
      title: "Childcare Support",
      category: "Family Services",
      commitment: "3-6 hours/week",
      description: "Provide childcare during program sessions, workshops, and events to support mothers in our programs.",
      requirements: [
        "Experience with children",
        "Background check required",
        "CPR certification preferred",
        "Patience and creativity"
      ],
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "transportation",
      title: "Transportation Assistance",
      category: "Support Services",
      commitment: "2-4 hours/week",
      description: "Help women get to appointments, job interviews, court dates, and program activities.",
      requirements: [
        "Valid driver's license",
        "Clean driving record",
        "Reliable vehicle",
        "Flexible schedule"
      ],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center",
      featured: false
    }
  ];

  const sponsorshipLevels = [
    {
      id: "platinum",
      name: "Platinum Partner",
      amount: "$10,000+",
      benefits: [
        "Logo on all marketing materials",
        "Dedicated program naming opportunity",
        "Quarterly impact reports",
        "VIP event access for 10 people",
        "Board presentation opportunity"
      ],
      color: "bg-gradient-to-r from-gray-400 to-gray-600"
    },
    {
      id: "gold",
      name: "Gold Supporter", 
      amount: "$5,000+",
      benefits: [
        "Logo on website and newsletter",
        "Annual impact report",
        "VIP event access for 6 people",
        "Social media recognition",
        "Tour of facilities"
      ],
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600"
    },
    {
      id: "silver",
      name: "Silver Champion",
      amount: "$2,500+",
      benefits: [
        "Website recognition",
        "Event tickets for 4 people",
        "Quarterly newsletter",
        "Certificate of appreciation",
        "Impact updates"
      ],
      color: "bg-gradient-to-r from-gray-300 to-gray-500"
    },
    {
      id: "bronze",
      name: "Bronze Ally",
      amount: "$1,000+",
      benefits: [
        "Website listing",
        "Event tickets for 2 people",
        "Thank you certificate",
        "Annual impact summary"
      ],
      color: "bg-gradient-to-r from-yellow-600 to-yellow-800"
    }
  ];

  const featuredOpportunities = opportunities.filter(opp => opp.featured);

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Volunteer form submitted:", volunteerForm);
  };

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sponsor form submitted:", sponsorForm);
  };

  const updateVolunteerInterests = (interest: string, checked: boolean) => {
    setVolunteerForm(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Get Involved"
        subtitle="Join our mission to empower women and transform lives. Whether through volunteering, partnerships, or sponsorship, your support creates lasting change in our community."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
            Become a Volunteer
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-royal-plum">
            Partner With Us
          </Button>
        </div>
      </Hero>

      {/* Ways to Help */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Ways to Make a Difference"
            subtitle="Every contribution, big or small, helps create positive change in the lives of women and families"
          />
          
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center p-6 hover:shadow-soft transition-shadow">
              <div className="w-16 h-16 bg-royal-plum rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">Volunteer</h3>
              <p className="text-muted-foreground mb-4">Share your time and skills to directly support women in our programs.</p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-soft transition-shadow">
              <div className="w-16 h-16 bg-lotus-rose rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">Corporate Partnership</h3>
              <p className="text-muted-foreground mb-4">Partner with us to create meaningful employee engagement opportunities.</p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-soft transition-shadow">
              <div className="w-16 h-16 bg-crown-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-royal-plum" />
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">Sponsorship</h3>
              <p className="text-muted-foreground mb-4">Sponsor programs, events, or facilities to maximize your community impact.</p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-soft transition-shadow">
              <div className="w-16 h-16 bg-sage-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">In-Kind Donations</h3>
              <p className="text-muted-foreground mb-4">Donate goods, services, or expertise to support our daily operations.</p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Volunteer Opportunities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Featured Volunteer Opportunities"
            subtitle="High-impact roles where your contribution makes the biggest difference"
          />
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden hover:shadow-soft transition-shadow">
                <div className="aspect-video bg-warm-cream overflow-hidden">
                  <img
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">
                      {opportunity.category}
                    </Badge>
                    <Badge className="bg-crown-gold text-royal-plum">
                      Featured
                    </Badge>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
                    {opportunity.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {opportunity.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Commitment: {opportunity.commitment}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-royal-plum">Requirements:</h4>
                    <ul className="space-y-1">
                      {opportunity.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-crown-gold mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-royal-plum hover:bg-royal-plum/90 text-white">
                    Apply for This Role
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Volunteer Opportunities */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="All Volunteer Opportunities"
            subtitle="Find the perfect way to contribute your time and talents"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden hover:shadow-soft transition-shadow">
                <div className="aspect-video bg-warm-cream overflow-hidden">
                  <img
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">
                      {opportunity.category}
                    </Badge>
                    {opportunity.featured && (
                      <Badge className="bg-crown-gold text-royal-plum">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
                    {opportunity.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {opportunity.description.length > 120 
                      ? `${opportunity.description.substring(0, 120)}...` 
                      : opportunity.description
                    }
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{opportunity.commitment}</span>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Volunteer Application Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6 text-center">
                Volunteer Application
              </h3>
              
              <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={volunteerForm.name}
                      onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={volunteerForm.email}
                      onChange={(e) => setVolunteerForm({...volunteerForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={volunteerForm.phone}
                    onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Areas of Interest (select all that apply):</Label>
                  <div className="grid md:grid-cols-2 gap-2 mt-2">
                    {["Direct Support", "Administrative", "Events", "Professional Services", "Childcare", "Transportation"].map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={volunteerForm.interests.includes(interest)}
                          onCheckedChange={(checked) => updateVolunteerInterests(interest, checked as boolean)}
                        />
                        <Label htmlFor={interest} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={volunteerForm.availability} onValueChange={(value) => setVolunteerForm({...volunteerForm, availability: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    value={volunteerForm.experience}
                    onChange={(e) => setVolunteerForm({...volunteerForm, experience: e.target.value})}
                    placeholder="Tell us about any relevant experience, skills, or why you want to volunteer with us..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="background"
                    checked={volunteerForm.background}
                    onCheckedChange={(checked) => setVolunteerForm({...volunteerForm, background: checked as boolean})}
                  />
                  <Label htmlFor="background" className="text-sm">
                    I understand that a background check may be required for certain volunteer positions
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sponsorship Levels */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Corporate Sponsorship Opportunities"
            subtitle="Partner with us to amplify your community impact and brand visibility"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sponsorshipLevels.map((level) => (
              <Card key={level.id} className="overflow-hidden hover:shadow-soft transition-shadow">
                <div className={`h-4 ${level.color}`}></div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-bold text-royal-plum mb-2">
                    {level.name}
                  </h3>
                  <div className="text-2xl font-bold text-crown-gold mb-4">
                    {level.amount}
                  </div>
                  
                  <ul className="space-y-2">
                    {level.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-crown-gold mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full mt-6 bg-royal-plum hover:bg-royal-plum/90 text-white">
                    Choose This Level
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sponsor Inquiry Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6 text-center">
                Partnership Inquiry
              </h3>
              
              <form onSubmit={handleSponsorSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organization">Organization Name</Label>
                    <Input
                      id="organization"
                      value={sponsorForm.organization}
                      onChange={(e) => setSponsorForm({...sponsorForm, organization: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input
                      id="contact"
                      value={sponsorForm.contact}
                      onChange={(e) => setSponsorForm({...sponsorForm, contact: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sponsor-email">Email Address</Label>
                  <Input
                    id="sponsor-email"
                    type="email"
                    value={sponsorForm.email}
                    onChange={(e) => setSponsorForm({...sponsorForm, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sponsorship">Sponsorship Interest</Label>
                  <Select value={sponsorForm.sponsorship} onValueChange={(value) => setSponsorForm({...sponsorForm, sponsorship: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sponsorship type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum Partner ($10,000+)</SelectItem>
                      <SelectItem value="gold">Gold Supporter ($5,000+)</SelectItem>
                      <SelectItem value="silver">Silver Champion ($2,500+)</SelectItem>
                      <SelectItem value="bronze">Bronze Ally ($1,000+)</SelectItem>
                      <SelectItem value="event">Event Sponsorship</SelectItem>
                      <SelectItem value="program">Program Sponsorship</SelectItem>
                      <SelectItem value="custom">Custom Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Proposed Investment Amount</Label>
                  <Input
                    id="amount"
                    value={sponsorForm.amount}
                    onChange={(e) => setSponsorForm({...sponsorForm, amount: e.target.value})}
                    placeholder="e.g., $5,000"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    value={sponsorForm.message}
                    onChange={(e) => setSponsorForm({...sponsorForm, message: e.target.value})}
                    placeholder="Tell us about your organization's goals, preferred partnership structure, or any questions..."
                  />
                </div>

                <Button type="submit" className="w-full bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
                  Submit Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Your Support Creates Real Impact
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            See how volunteer and sponsor contributions directly translate into positive outcomes for women in our community.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">150+</div>
              <p className="text-white/90">Active volunteers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">5,000</div>
              <p className="text-white/90">Volunteer hours annually</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">25+</div>
              <p className="text-white/90">Corporate partners</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">$200K</div>
              <p className="text-white/90">Sponsor contributions annually</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-lotus-rose text-white">
        <div className="container mx-auto px-4 text-center">
          <HandHeart className="h-12 w-12 text-crown-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of supporters and be part of transforming lives. Every contribution matters, and every volunteer makes a difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-lotus-rose hover:bg-white/90 font-bold">
              Start Volunteering Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-lotus-rose">
              Explore Partnerships
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;