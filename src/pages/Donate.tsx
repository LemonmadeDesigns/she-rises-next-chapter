import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import StripePaymentForm from "@/components/donation/StripePaymentForm";
import { donationService } from "@/services/donationService";
import { Heart, DollarSign, Home, Users, Briefcase, GraduationCap, Shield, CheckCircle, CreditCard, Calendar, AlertCircle, Loader2 } from "lucide-react";

const Donate = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment'>('form');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [donationForm, setDonationForm] = useState({
    amount: "",
    frequency: "one-time",
    designation: "general",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "credit",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    anonymous: false,
    newsletter: true,
    tribute: "",
    tributeMessage: "",
    tributeNotify: ""
  });

  const donationAmounts = [
    { amount: 25, impact: "Provides a week of meals for one woman" },
    { amount: 50, impact: "Covers transportation for job interviews for a month" },
    { amount: 100, impact: "Funds childcare for program participation" },
    { amount: 250, impact: "Sponsors a woman's mental health counseling sessions" },
    { amount: 500, impact: "Covers housing assistance for one week" },
    { amount: 1000, impact: "Funds a complete job training program" }
  ];

  const designations = [
    {
      id: "general",
      name: "Greatest Need",
      description: "Allows us to direct funds where they're needed most",
      icon: Heart
    },
    {
      id: "housing",
      name: "Housing Program",
      description: "Supports transitional housing and emergency shelter services",
      icon: Home
    },
    {
      id: "employment",
      name: "Workforce Development",
      description: "Funds job training, placement services, and career support",
      icon: Briefcase
    },
    {
      id: "family",
      name: "Family Services", 
      description: "Supports parenting programs and family reunification efforts",
      icon: Users
    },
    {
      id: "education",
      name: "Education Programs",
      description: "Funds GED classes, college prep, and educational support",
      icon: GraduationCap
    },
    {
      id: "crisis",
      name: "Crisis Response",
      description: "Supports 24/7 hotline and emergency intervention services",
      icon: Shield
    }
  ];

  const impactStats = [
    {
      amount: "$25",
      provides: "One week of nutritious meals",
      frequency: "monthly"
    },
    {
      amount: "$50", 
      provides: "Job interview preparation workshop",
      frequency: "monthly"
    },
    {
      amount: "$100",
      provides: "Mental health counseling session",
      frequency: "monthly"
    },
    {
      amount: "$250",
      provides: "Complete legal advocacy package",
      frequency: "monthly"
    }
  ];

  const testimonials = [
    {
      quote: "Thanks to generous donors like you, I was able to rebuild my life and now have stable housing and a career I love.",
      name: "Sarah M.",
      program: "Housing & Employment Program Graduate"
    },
    {
      quote: "The support I received helped me reunite with my children and build the family we all deserved.",
      name: "Maria L.",
      program: "Family Services Program Participant"
    },
    {
      quote: "Every donation, no matter the size, represents hope and a chance for women like me to rise again.",
      name: "Jennifer K.", 
      program: "Program Alumna & Current Mentor"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate form
    const validation = donationService.validateDonationForm(donationForm as any);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsProcessing(true);

    try {
      // For credit card payments, create payment intent and show Stripe form
      if (donationForm.paymentMethod === 'credit') {
        const response = await donationService.processDonation(donationForm as any);

        if (response.success && response.clientSecret) {
          setClientSecret(response.clientSecret);
          setPaymentStep('payment');
        } else {
          setErrors([response.error || 'Failed to initialize payment']);
        }
      } else {
        // For PayPal, process directly
        const response = await donationService.processDonation(donationForm as any);

        if (!response.success) {
          setErrors([response.error || 'Payment processing failed']);
        }
      }
    } catch (error) {
      console.error('Donation error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    // Send receipt email
    await donationService.sendReceipt(paymentIntent.id, donationForm.email);

    // Navigate to success page with donation details
    navigate(`/donation-success?amount=${donationForm.amount}&frequency=${donationForm.frequency}&donation_id=${paymentIntent.id}&designation=${donationForm.designation}`);
  };

  const handlePaymentError = (error: string) => {
    setErrors([error]);
    setPaymentStep('form');
    setClientSecret(null);
  };

  const updateForm = (field: string, value: string | boolean) => {
    setDonationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectAmount = (amount: number) => {
    setDonationForm(prev => ({
      ...prev,
      amount: amount.toString()
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Make a Difference Today"
        subtitle="Your donation creates lasting change in the lives of women and families in our community. Every contribution helps women rebuild their lives with dignity and hope."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
            Donate Now
          </Button>
          <Button size="lg" className="hero-button-secondary btn-force-visible">
            Monthly Giving
          </Button>
        </div>
      </Hero>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Your Impact"
            subtitle="See how your donation directly transforms lives in our community"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center p-6 shadow-soft transition-shadow">
                <div className="text-3xl font-bold text-crown-gold mb-2">
                  {stat.amount}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {stat.frequency}
                </div>
                <p className="text-royal-plum font-medium">
                  {stat.provides}
                </p>
              </Card>
            ))}
          </div>

          {/* Donation Impact Stories */}
          <div className="bg-white rounded-2xl p-8">
            <h3 className="font-serif text-2xl font-bold text-royal-plum mb-8 text-center">
              Stories of Impact
            </h3>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-l-4 border-l-crown-gold">
                  <CardContent className="p-6">
                    <blockquote className="text-muted-foreground mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-semibold text-royal-plum">{testimonial.name}</div>
                      <div className="text-muted-foreground">{testimonial.program}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="Make Your Donation"
              subtitle="Choose your donation amount and help us continue our vital work"
            />
            
            <Card>
              <CardContent className="p-8">
                {/* Show error messages */}
                {errors.length > 0 && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc pl-4">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Show payment form or donation form based on step */}
                {paymentStep === 'payment' && clientSecret ? (
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6">
                      Complete Your Payment
                    </h3>
                    <StripePaymentForm
                      clientSecret={clientSecret}
                      amount={parseFloat(donationForm.amount)}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPaymentStep('form');
                        setClientSecret(null);
                      }}
                      className="mt-4 w-full"
                    >
                      Back to Donation Form
                    </Button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Donation Amount */}
                  <div>
                    <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                      Donation Amount
                    </Label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {donationAmounts.map((item) => (
                        <button
                          key={item.amount}
                          type="button"
                          className={`
                            w-full h-44
                            p-4
                            rounded-xl border
                            shadow-sm
                            flex flex-col items-center justify-center gap-2
                            text-center
                            overflow-hidden
                            box-border
                            transition-colors
                            ${
                              donationForm.amount === item.amount.toString()
                                ? "bg-crown-gold border-crown-gold/50 text-royal-plum"
                                : "bg-white border-black/10 hover:bg-warm-cream text-black"
                            }
                          `}
                          onClick={() => selectAmount(item.amount)}
                          aria-pressed={donationForm.amount === item.amount.toString()}
                        >
                          <span className="text-3xl font-bold leading-none">
                            ${item.amount}
                          </span>
                          <span className="text-sm text-black/80 leading-snug break-words hyphens-auto">
                            {item.impact}
                          </span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Label htmlFor="custom-amount">Other Amount:</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="custom-amount"
                          type="number"
                          value={donationForm.amount}
                          onChange={(e) => updateForm('amount', e.target.value)}
                          className="pl-10 w-32"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div>
                    <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                      Donation Frequency
                    </Label>
                    <RadioGroup 
                      value={donationForm.frequency} 
                      onValueChange={(value) => updateForm('frequency', value)}
                      className="flex gap-8"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time">One-time donation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly giving</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Designation */}
                  <div>
                    <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                      Designate Your Gift
                    </Label>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {designations.map((designation) => (
                        <Card 
                          key={designation.id}
                          className={`cursor-pointer transition-all ${
                            donationForm.designation === designation.id 
                              ? "ring-2 ring-crown-gold bg-crown-gold/5" 
                              : "hover:shadow-md"
                          }`}
                          onClick={() => updateForm('designation', designation.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <designation.icon className="h-5 w-5 text-crown-gold" />
                              <h4 className="font-semibold text-royal-plum text-sm">
                                {designation.name}
                              </h4>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {designation.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                      Contact Information
                    </Label>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={donationForm.firstName}
                          onChange={(e) => updateForm('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={donationForm.lastName}
                          onChange={(e) => updateForm('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={donationForm.email}
                          onChange={(e) => updateForm('email', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={donationForm.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={donationForm.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={donationForm.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={donationForm.state}
                          onChange={(e) => updateForm('state', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={donationForm.zip}
                          onChange={(e) => updateForm('zip', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                      Payment Information
                    </Label>
                    
                    <RadioGroup 
                      value={donationForm.paymentMethod} 
                      onValueChange={(value) => updateForm('paymentMethod', value)}
                      className="flex gap-8 mb-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                    </RadioGroup>

                    {donationForm.paymentMethod === 'credit' && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="nameOnCard">Name on Card *</Label>
                          <Input
                            id="nameOnCard"
                            value={donationForm.nameOnCard}
                            onChange={(e) => updateForm('nameOnCard', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={donationForm.cardNumber}
                            onChange={(e) => updateForm('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              value={donationForm.expiryDate}
                              onChange={(e) => updateForm('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={donationForm.cvv}
                              onChange={(e) => updateForm('cvv', e.target.value)}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Options */}
                  <div>
                    <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                      Additional Options
                    </Label>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="anonymous"
                          checked={donationForm.anonymous}
                          onCheckedChange={(checked) => updateForm('anonymous', checked as boolean)}
                        />
                        <Label htmlFor="anonymous" className="text-sm">
                          Make this donation anonymous
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={donationForm.newsletter}
                          onCheckedChange={(checked) => updateForm('newsletter', checked as boolean)}
                        />
                        <Label htmlFor="newsletter" className="text-sm">
                          Subscribe to our newsletter for impact updates
                        </Label>
                      </div>
                    </div>
                    
                    {/* Memorial/Tribute */}
                    <div className="mt-6 p-4 bg-warm-cream rounded-lg">
                      <h4 className="font-semibold text-royal-plum mb-2">Honor or Memorial Gift</h4>
                      <div className="mb-4">
                        <Label htmlFor="tribute">Make this gift in honor/memory of:</Label>
                        <Input
                          id="tribute"
                          value={donationForm.tribute}
                          onChange={(e) => updateForm('tribute', e.target.value)}
                          placeholder="Optional: Person's name"
                        />
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="tributeMessage">Special message:</Label>
                        <Textarea
                          id="tributeMessage"
                          value={donationForm.tributeMessage}
                          onChange={(e) => updateForm('tributeMessage', e.target.value)}
                          placeholder="Optional: Add a personal message"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tributeNotify">Notify family at email address:</Label>
                        <Input
                          id="tributeNotify"
                          type="email"
                          value={donationForm.tributeNotify}
                          onChange={(e) => updateForm('tributeNotify', e.target.value)}
                          placeholder="Optional: family@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t pt-8">
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-royal-plum mb-2">
                        Total: ${donationForm.amount || '0'}
                        {donationForm.frequency === 'monthly' && (
                          <span className="text-sm font-normal text-muted-foreground"> monthly</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your donation is secure and tax-deductible
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold text-lg py-6"
                      disabled={!donationForm.amount || !donationForm.firstName || !donationForm.email}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-5 w-5" />
                          Complete Donation
                        </>
                      )}
                    </Button>
                  </div>
                </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Other Ways to Give"
            subtitle="Explore additional giving opportunities that fit your preferences"
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <Calendar className="h-12 w-12 text-crown-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
                Planned Giving
              </h3>
              <p className="text-muted-foreground mb-4">
                Include She Rises in your estate planning for lasting impact through bequests, trusts, or beneficiary designations.
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Card>
            
            <Card className="text-center p-6">
              <Users className="h-12 w-12 text-crown-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
                Corporate Giving
              </h3>
              <p className="text-muted-foreground mb-4">
                Partner with us through corporate sponsorships, employee giving programs, or cause marketing initiatives.
              </p>
              <Button variant="outline" size="sm">
                Partner With Us
              </Button>
            </Card>
            
            <Card className="text-center p-6">
              <Heart className="h-12 w-12 text-crown-gold mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
                In-Kind Donations
              </h3>
              <p className="text-muted-foreground mb-4">
                Donate goods, services, or professional expertise to directly support our programs and operations.
              </p>
              <Button variant="outline" size="sm">
                View Wish List
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Donor Recognition */}
      <section className="py-20 bg-royal-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Your Generosity Matters
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join hundreds of generous donors who believe in empowering women and transforming lives in our community.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">500+</div>
              <p className="text-white/90">Individual donors annually</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">25+</div>
              <p className="text-white/90">Corporate partners</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">$350K</div>
              <p className="text-white/90">Raised annually</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-crown-gold mb-2">100%</div>
              <p className="text-white/90">Goes to programs</p>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-serif text-xl font-bold mb-4">Monthly Giving Circle</h3>
            <p className="text-white/90 mb-6">
              Join our Monthly Giving Circle for as little as $25/month and receive quarterly impact reports, 
              exclusive event invitations, and direct updates from program participants.
            </p>
            <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
              Join Monthly Giving
            </Button>
          </div>
        </div>
      </section>

      {/* Financial Transparency */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Financial Transparency"
            subtitle="We're committed to responsible stewardship of your donations"
          />
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6">
                  How Your Donation is Used
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lotus-rose rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">85%</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-royal-plum">Direct Programs</h4>
                      <p className="text-sm text-muted-foreground">Housing, employment, counseling, and family services</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-crown-gold rounded-full flex items-center justify-center">
                      <span className="text-royal-plum font-bold">10%</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-royal-plum">Administrative</h4>
                      <p className="text-sm text-muted-foreground">Operations, facilities, and essential support services</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sage-green rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">5%</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-royal-plum">Fundraising</h4>
                      <p className="text-sm text-muted-foreground">Donor stewardship and sustainable funding efforts</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button variant="outline">
                    View Annual Report
                  </Button>
                </div>
              </div>
              
              <div className="bg-gradient-soft rounded-2xl p-8">
                <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                  Your Donation is Secure
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-crown-gold" />
                    <span className="text-sm">SSL encrypted payment processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-crown-gold" />
                    <span className="text-sm">PCI DSS compliant security standards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-crown-gold" />
                    <span className="text-sm">501(c)(3) tax-deductible status</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-crown-gold" />
                    <span className="text-sm">GuideStar Gold Seal of Transparency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;