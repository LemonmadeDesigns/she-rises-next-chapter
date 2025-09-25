import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/sections/SectionHeader";
import StripePaymentForm from "@/components/donation/StripePaymentForm";
import { donationService, type DonationData } from "@/services/donationService";
import { Heart, DollarSign, Calendar, Users, CheckCircle, CreditCard, AlertCircle, Loader2, Gift, TrendingUp } from "lucide-react";

const MonthlyGiving = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment'>('form');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  interface MonthlyGivingFormState extends Omit<DonationData, 'frequency' | 'paymentMethod'> {
    frequency: 'monthly';
    paymentMethod: 'credit';
  }

  const [donationForm, setDonationForm] = useState<MonthlyGivingFormState>({
    amount: "",
    frequency: "monthly",
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
    anonymous: false,
    newsletter: true,
    tribute: "",
    tributeMessage: "",
    tributeNotify: ""
  });

  const monthlyAmounts = [
    { amount: 25, impact: "Provides weekly meals for one woman", supporters: "127 supporters" },
    { amount: 50, impact: "Funds job interview preparation workshops", supporters: "89 supporters" },
    { amount: 100, impact: "Sponsors mental health counseling sessions", supporters: "64 supporters" },
    { amount: 250, impact: "Covers housing assistance for one week", supporters: "31 supporters" }
  ];

  const membershipBenefits = [
    "Quarterly impact reports with program updates",
    "Exclusive monthly giving member events",
    "Direct updates from program participants",
    "Annual recognition (unless anonymous)",
    "Special member newsletter with insider stories",
    "Priority invitations to volunteer opportunities"
  ];

  const impactTiers = [
    {
      name: "Hope Builder",
      amount: "$25/month",
      annualTotal: "$300/year",
      impact: "Provides nutritious meals and basic necessities for women in crisis",
      supporters: 127
    },
    {
      name: "Life Changer",
      amount: "$50/month",
      annualTotal: "$600/year",
      impact: "Funds job training, interview preparation, and career support services",
      supporters: 89
    },
    {
      name: "Future Maker",
      amount: "$100/month",
      annualTotal: "$1,200/year",
      impact: "Sponsors mental health counseling and therapy sessions for healing",
      supporters: 64
    },
    {
      name: "Legacy Creator",
      amount: "$250/month",
      annualTotal: "$3,000/year",
      impact: "Provides comprehensive housing assistance and family support services",
      supporters: 31
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const formData: DonationData = {
      ...donationForm,
      frequency: 'monthly' as const,
      paymentMethod: 'credit' as const
    };

    const validation = donationService.validateDonationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsProcessing(true);

    try {
      const response = await donationService.processDonation(formData);

      if (response.success && response.clientSecret) {
        setClientSecret(response.clientSecret);
        setPaymentStep('payment');
      } else {
        setErrors([response.error || 'Failed to initialize payment']);
      }
    } catch (error) {
      console.error('Monthly giving error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: { id: string }) => {
    await donationService.sendReceipt(paymentIntent.id, donationForm.email);
    navigate(`/donation-success?amount=${donationForm.amount}&frequency=monthly&donation_id=${paymentIntent.id}&designation=${donationForm.designation}&type=monthly-giving`);
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
        title="Join Our Monthly Giving Circle"
        subtitle="Make a lasting impact with a monthly commitment. Your recurring donation provides steady support that helps us plan and sustain our vital programs throughout the year."
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col items-center mt-8">
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <p className="text-white text-lg font-semibold">
              <Calendar className="inline h-5 w-5 mr-2" />
              Join {monthlyAmounts.reduce((total, tier) => total + parseInt(tier.supporters.split(' ')[0]), 0)} monthly supporters
            </p>
          </div>
          <Button
            size="lg"
            className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
            onClick={() => document.getElementById('monthly-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Heart className="mr-2 h-5 w-5" />
            Start Monthly Giving
          </Button>
        </div>
      </Hero>

      {/* Impact Tiers Section */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Choose Your Impact Level"
            subtitle="Select a monthly amount that fits your budget and see the direct impact you'll make"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {impactTiers.map((tier, index) => (
              <Card key={index} className="text-center p-6 shadow-soft hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-crown-gold"></div>
                <div className="text-2xl font-bold text-crown-gold mb-2">
                  {tier.name}
                </div>
                <div className="text-3xl font-bold text-royal-plum mb-1">
                  {tier.amount}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {tier.annualTotal}
                </div>
                <p className="text-sm text-royal-plum font-medium mb-4 min-h-[3rem]">
                  {tier.impact}
                </p>
                <div className="text-xs text-muted-foreground mb-4">
                  {tier.supporters} supporters
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectAmount(parseInt(tier.amount.replace('$', '').replace('/month', '')));
                    document.getElementById('monthly-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Select This Level
                </Button>
              </Card>
            ))}
          </div>

          {/* Why Monthly Giving */}
          <div className="bg-white rounded-2xl p-8">
            <h3 className="font-serif text-2xl font-bold text-royal-plum mb-8 text-center">
              Why Monthly Giving Makes a Difference
            </h3>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-crown-gold mx-auto mb-4" />
                <h4 className="font-semibold text-royal-plum mb-3">Predictable Impact</h4>
                <p className="text-muted-foreground">
                  Your monthly commitment allows us to plan long-term programs and make sustainable commitments to the women we serve.
                </p>
              </div>

              <div className="text-center">
                <Heart className="h-12 w-12 text-crown-gold mx-auto mb-4" />
                <h4 className="font-semibold text-royal-plum mb-3">Greater Impact</h4>
                <p className="text-muted-foreground">
                  Monthly donors typically give 42% more annually than one-time donors, maximizing your impact on women's lives.
                </p>
              </div>

              <div className="text-center">
                <Users className="h-12 w-12 text-crown-gold mx-auto mb-4" />
                <h4 className="font-semibold text-royal-plum mb-3">Community Connection</h4>
                <p className="text-muted-foreground">
                  Join a committed community of monthly supporters who receive exclusive updates and connection opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="Monthly Giving Circle Benefits"
              subtitle="As a monthly supporter, you'll receive exclusive perks and deeper connection to our mission"
            />

            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-xl font-bold text-royal-plum mb-6 flex items-center">
                    <Gift className="h-6 w-6 mr-3 text-crown-gold" />
                    Exclusive Member Perks
                  </h3>
                  <div className="space-y-3">
                    {membershipBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-crown-gold flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-soft rounded-lg p-6">
                  <h4 className="font-semibold text-royal-plum mb-4">Flexible & Convenient</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-crown-gold" />
                      <span className="text-sm">Change or cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-crown-gold" />
                      <span className="text-sm">Secure automated payments</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-crown-gold" />
                      <span className="text-sm">Annual tax receipt provided</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-crown-gold" />
                      <span className="text-sm">No long-term commitment required</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Monthly Giving Form */}
      <section id="monthly-form" className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              title="Start Your Monthly Giving"
              subtitle="Join our community of committed supporters making a lasting difference"
            />

            <Card>
              <CardContent className="p-8">
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

                {paymentStep === 'payment' && clientSecret ? (
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6">
                      Complete Your Monthly Giving Setup
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
                      Back to Form
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Monthly Amount */}
                    <div>
                      <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                        Monthly Donation Amount
                      </Label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {monthlyAmounts.map((item) => (
                          <button
                            key={item.amount}
                            type="button"
                            className={`
                              w-full h-44 p-4 rounded-xl border shadow-sm
                              flex flex-col items-center justify-center gap-2
                              text-center overflow-hidden box-border transition-colors
                              ${
                                donationForm.amount === item.amount.toString()
                                  ? "bg-crown-gold border-crown-gold/50 text-royal-plum"
                                  : "bg-white border-black/10 hover:bg-warm-cream text-black"
                              }
                            `}
                            onClick={() => selectAmount(item.amount)}
                          >
                            <div className="text-2xl font-bold mb-2">${item.amount}</div>
                            <div className="text-xs mb-1 text-muted-foreground">monthly</div>
                            <div className="text-xs leading-tight line-clamp-2 mb-2">
                              {item.impact}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.supporters}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <Label htmlFor="custom-monthly-amount">Custom Monthly Amount:</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="custom-monthly-amount"
                            type="number"
                            value={donationForm.amount}
                            onChange={(e) => updateForm('amount', e.target.value)}
                            className="pl-10 w-32"
                            placeholder="0.00"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">per month</span>
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

                      <div className="grid md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Preferences */}
                    <div>
                      <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                        Monthly Giving Preferences
                      </Label>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="newsletter"
                            checked={donationForm.newsletter}
                            onCheckedChange={(checked) => updateForm('newsletter', checked as boolean)}
                          />
                          <Label htmlFor="newsletter" className="text-sm">
                            Subscribe to our Monthly Giving Circle newsletter
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="anonymous"
                            checked={donationForm.anonymous}
                            onCheckedChange={(checked) => updateForm('anonymous', checked as boolean)}
                          />
                          <Label htmlFor="anonymous" className="text-sm">
                            Keep my monthly giving anonymous
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="border-t pt-8">
                      <div className="text-center mb-6">
                        <div className="text-2xl font-bold text-royal-plum mb-2">
                          ${donationForm.amount || '0'} <span className="text-base font-normal">monthly</span>
                        </div>
                        <div className="text-lg text-muted-foreground mb-1">
                          ${(parseFloat(donationForm.amount || '0') * 12).toFixed(0)} annual impact
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Secure payment • Cancel anytime • Tax deductible
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
                            Setting up your monthly giving...
                          </>
                        ) : (
                          <>
                            <Calendar className="mr-2 h-5 w-5" />
                            Start Monthly Giving
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about monthly giving"
            />

            <div className="space-y-6">
              <Card className="p-6">
                <h4 className="font-semibold text-royal-plum mb-2">Can I change or cancel my monthly donation?</h4>
                <p className="text-muted-foreground">Yes, you can modify your monthly donation amount or cancel at any time by contacting us or managing your account online.</p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-royal-plum mb-2">When will my card be charged?</h4>
                <p className="text-muted-foreground">Your first payment will be processed immediately, and subsequent payments will occur on the same date each month.</p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-royal-plum mb-2">Will I receive tax receipts?</h4>
                <p className="text-muted-foreground">Yes, you'll receive an annual tax receipt summarizing all your monthly donations for easy tax filing.</p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-royal-plum mb-2">How do I track my impact?</h4>
                <p className="text-muted-foreground">Monthly giving members receive quarterly impact reports showing how their consistent support is making a difference in our community.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MonthlyGiving;