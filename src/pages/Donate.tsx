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
import StripePaymentForm from "@/components/donation/StripePaymentForm";
import { donationService, type DonationData } from "@/services/donationService";
import { Heart, Home, Users, Briefcase, Shield, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";

const Donate = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment'>('form');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  interface DonationFormState extends Omit<DonationData, 'frequency' | 'paymentMethod'> {
    frequency: 'one-time' | 'monthly';
    paymentMethod: 'credit' | 'paypal';
  }

  const [donationForm, setDonationForm] = useState<DonationFormState>({
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
    anonymous: false,
    newsletter: true,
    tribute: "",
    tributeMessage: "",
    tributeNotify: ""
  });

  // Quick donate amounts with emoji icons
  const quickAmounts = [
    { amount: 25, label: "$25", impact: "Meals for a week", icon: "🍽️" },
    { amount: 50, label: "$50", impact: "Job interview prep", icon: "💼" },
    { amount: 100, label: "$100", impact: "Counseling session", icon: "💚" },
    { amount: 250, label: "$250", impact: "Housing support", icon: "🏠" },
  ];

  const designations = [
    { id: "general", name: "Greatest Need", icon: Heart },
    { id: "housing", name: "Housing", icon: Home },
    { id: "employment", name: "Employment", icon: Briefcase },
    { id: "family", name: "Family Services", icon: Users },
    { id: "crisis", name: "Emergency", icon: Shield },
  ];

  const handleQuickDonate = async (amount: number) => {
    if (!donationForm.email || !donationForm.firstName) {
      setErrors(['Please fill in your name and email first']);
      return;
    }

    setDonationForm(prev => ({ ...prev, amount: amount.toString() }));
    await handleSubmit(undefined, amount);
  };

  const handleSubmit = async (e?: React.FormEvent, quickAmount?: number) => {
    if (e) e.preventDefault();
    setErrors([]);

    const formDataForValidation: DonationData = {
      amount: quickAmount?.toString() || donationForm.amount,
      frequency: donationForm.frequency === 'monthly' ? 'monthly' : 'one-time',
      designation: donationForm.designation,
      firstName: donationForm.firstName,
      lastName: donationForm.lastName,
      email: donationForm.email,
      phone: donationForm.phone,
      address: donationForm.address,
      city: donationForm.city,
      state: donationForm.state,
      zip: donationForm.zip,
      paymentMethod: donationForm.paymentMethod,
      anonymous: donationForm.anonymous,
      newsletter: donationForm.newsletter,
      tribute: donationForm.tribute,
      tributeMessage: donationForm.tributeMessage,
      tributeNotify: donationForm.tributeNotify
    };

    const validation = donationService.validateDonationForm(formDataForValidation);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsProcessing(true);

    try {
      const response = await donationService.processDonation(formDataForValidation);

      if (response.success && response.clientSecret) {
        setClientSecret(response.clientSecret);
        setPaymentStep('payment');
      } else {
        setErrors([response.error || 'Failed to initialize payment']);
      }
    } catch (error) {
      console.error('Donation error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: { id: string }) => {
    await donationService.sendReceipt(paymentIntent.id, donationForm.email);
    navigate(`/donation-success?amount=${donationForm.amount}&frequency=${donationForm.frequency}&donation_id=${paymentIntent.id}&designation=${donationForm.designation}`);
  };

  const handlePaymentError = (error: string) => {
    setErrors([error]);
    setPaymentStep('form');
    setClientSecret(null);
  };

  const updateForm = (field: string, value: string | boolean) => {
    setDonationForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      {/* Hero Section - Modern Gradient */}
      <section className="relative bg-gradient-to-br from-royal-plum via-[#5a3a7d] to-royal-plum text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-crown-gold" />
              <span className="text-sm font-medium">Every gift creates lasting change</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              Transform Lives Today
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your generosity empowers women to rebuild their lives with dignity, hope, and endless possibilities.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-crown-gold">500+</div>
                <div className="text-sm text-white/80">Women served</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-crown-gold">85%</div>
                <div className="text-sm text-white/80">To programs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-crown-gold">$350K</div>
                <div className="text-sm text-white/80">Annual impact</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-crown-gold">100%</div>
                <div className="text-sm text-white/80">Tax deductible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Donation Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-warm-cream/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">

            {/* Error Messages */}
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

            {/* Payment Form or Donation Form */}
            {paymentStep === 'payment' && clientSecret ? (
              <Card className="shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <h3 className="font-serif text-2xl font-bold text-royal-plum mb-6">
                    Complete Your ${donationForm.amount} Donation
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
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border-2 border-crown-gold/20">
                <CardContent className="p-6 md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Quick Donate Buttons - Prominent */}
                    <div className="text-center">
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-royal-plum mb-2">
                        Choose Your Impact
                      </h2>
                      <p className="text-muted-foreground mb-6">Select an amount or enter your own</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {quickAmounts.map((item) => (
                          <button
                            key={item.amount}
                            type="button"
                            className={`
                              group relative p-6 rounded-2xl border-2 transition-all duration-200
                              ${donationForm.amount === item.amount.toString()
                                ? "bg-crown-gold border-crown-gold shadow-lg scale-105"
                                : "bg-white border-gray-200 hover:border-crown-gold hover:shadow-md hover:scale-102"
                              }
                            `}
                            onClick={() => updateForm('amount', item.amount.toString())}
                          >
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <div className={`text-2xl font-bold mb-1 ${
                              donationForm.amount === item.amount.toString() ? "text-royal-plum" : "text-royal-plum"
                            }`}>
                              {item.label}
                            </div>
                            <div className={`text-xs ${
                              donationForm.amount === item.amount.toString() ? "text-royal-plum/80" : "text-muted-foreground"
                            }`}>
                              {item.impact}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Custom Amount */}
                      <div className="flex items-center justify-center gap-3">
                        <Label htmlFor="custom-amount" className="text-base font-medium">Custom Amount:</Label>
                        <div className="relative w-40">
                          <span className="absolute left-3 top-3 text-muted-foreground font-medium">$</span>
                          <Input
                            id="custom-amount"
                            type="number"
                            value={donationForm.amount}
                            onChange={(e) => updateForm('amount', e.target.value)}
                            className="pl-7 text-lg h-12 border-2"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Frequency Toggle */}
                    <div className="bg-warm-cream/50 rounded-xl p-6">
                      <Label className="text-lg font-semibold text-royal-plum mb-4 block text-center">
                        Make it Monthly? 💝
                      </Label>
                      <RadioGroup
                        value={donationForm.frequency}
                        onValueChange={(value) => updateForm('frequency', value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          donationForm.frequency === 'one-time' ? 'border-crown-gold bg-crown-gold/10' : 'border-gray-200 bg-white'
                        }`}>
                          <RadioGroupItem value="one-time" id="one-time" className="sr-only" />
                          <Label htmlFor="one-time" className="cursor-pointer block text-center">
                            <div className="font-semibold text-royal-plum">One-Time</div>
                            <div className="text-sm text-muted-foreground">Single donation</div>
                          </Label>
                        </div>
                        <div className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          donationForm.frequency === 'monthly' ? 'border-crown-gold bg-crown-gold/10' : 'border-gray-200 bg-white'
                        }`}>
                          <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                          <Label htmlFor="monthly" className="cursor-pointer block text-center">
                            <div className="font-semibold text-royal-plum">Monthly</div>
                            <div className="text-sm text-muted-foreground">Recurring gift</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Designation - Simplified Icons */}
                    <div>
                      <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                        Where should we use your gift?
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {designations.map((des) => (
                          <button
                            key={des.id}
                            type="button"
                            className={`p-4 rounded-xl border-2 transition-all ${
                              donationForm.designation === des.id
                                ? "border-crown-gold bg-crown-gold/10"
                                : "border-gray-200 hover:border-crown-gold/50"
                            }`}
                            onClick={() => updateForm('designation', des.id)}
                          >
                            <des.icon className={`h-6 w-6 mx-auto mb-2 ${
                              donationForm.designation === des.id ? 'text-crown-gold' : 'text-royal-plum'
                            }`} />
                            <div className="text-sm font-medium text-royal-plum text-center">
                              {des.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info - Simplified */}
                    <div>
                      <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                        Your Information
                      </Label>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={donationForm.firstName}
                            onChange={(e) => updateForm('firstName', e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={donationForm.lastName}
                            onChange={(e) => updateForm('lastName', e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={donationForm.email}
                            onChange={(e) => updateForm('email', e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input
                            id="phone"
                            value={donationForm.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            className="h-12"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Options - Checkboxes */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-warm-cream/30">
                        <Checkbox
                          id="newsletter"
                          checked={donationForm.newsletter}
                          onCheckedChange={(checked) => updateForm('newsletter', checked as boolean)}
                        />
                        <Label htmlFor="newsletter" className="text-sm cursor-pointer flex-1">
                          Send me impact updates and success stories
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-warm-cream/30">
                        <Checkbox
                          id="anonymous"
                          checked={donationForm.anonymous}
                          onCheckedChange={(checked) => updateForm('anonymous', checked as boolean)}
                        />
                        <Label htmlFor="anonymous" className="text-sm cursor-pointer flex-1">
                          Make this donation anonymous
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button - Large and Prominent */}
                    <div className="pt-6">
                      <div className="text-center mb-6">
                        <div className="text-3xl md:text-4xl font-bold text-royal-plum mb-2">
                          ${donationForm.amount || '0'}
                          {donationForm.frequency === 'monthly' && (
                            <span className="text-lg font-normal text-muted-foreground">/month</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4 text-crown-gold" />
                          Secure & Tax-Deductible
                        </p>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-crown-gold to-[#d4a846] hover:from-[#d4a846] hover:to-crown-gold text-royal-plum font-bold text-lg py-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={!donationForm.amount || !donationForm.firstName || !donationForm.email || isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-6 w-6" />
                            Donate Now
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-crown-gold" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-crown-gold" />
                <span>501(c)(3) Nonprofit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-crown-gold" />
                <span>GuideStar Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories - Simplified */}
      <section className="py-16 bg-royal-plum text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Your Gift Creates Real Change
            </h2>
            <blockquote className="text-xl md:text-2xl italic text-white/90 mb-4">
              "Thanks to donors like you, I rebuilt my life and now have stable housing and a career I love."
            </blockquote>
            <p className="text-white/70">— Sarah M., Program Graduate</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
