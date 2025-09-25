import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import AuthRequired from "@/components/auth/AuthRequired";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Lock, CreditCard, Truck, ShieldCheck, CheckCircle } from "lucide-react";

const Checkout = () => {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });

  const [billingForm, setBillingForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [orderNotes, setOrderNotes] = useState("");

  // Calculate totals
  const subtotal = state.total;
  const shipping = subtotal >= 50 ? 0 : 8.99;
  const tax = subtotal * 0.0875;
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-royal-plum mb-4">Your cart is empty</h1>
          <Link to="/shop">
            <Button className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingForm({ ...billingForm, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingForm[field as keyof typeof shippingForm].trim() !== '');
  };

  const validateStep2 = () => {
    if (paymentMethod === 'credit-card') {
      return paymentForm.cardNumber && paymentForm.expiryDate && paymentForm.cvv && paymentForm.nameOnCard;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2 && !validateStep2()) {
      toast({
        title: "Missing payment information",
        description: "Please complete your payment details.",
        variant: "destructive"
      });
      return;
    }
    
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      setStep(3);
      setIsProcessing(false);
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length > 1 ? parts.join(' ') : v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm({ ...paymentForm, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setPaymentForm({ ...paymentForm, expiryDate: value });
  };

  if (step === 3) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-royal-plum mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase! Your order has been received and is being processed.
              You'll receive a confirmation email with tracking information shortly.
            </p>
            <div className="bg-gradient-soft rounded-lg p-6 mb-8">
              <p className="text-royal-plum font-medium">
                Your purchase directly supports She Rises programs that help women rebuild their lives.
                Thank you for being part of our mission!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AuthRequired message="Please sign in to complete your purchase">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-royal-plum mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
            <h1 className="font-serif text-3xl font-bold text-royal-plum">
              Secure Checkout
            </h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Secure SSL Encryption</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${step >= 1 ? 'text-royal-plum' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'bg-royal-plum text-white border-royal-plum' : 'border-muted-foreground'
              }`}>
                1
              </div>
              <span className="ml-2 hidden sm:inline">Shipping</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-royal-plum' : 'bg-muted-foreground'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-royal-plum' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'bg-royal-plum text-white border-royal-plum' : 'border-muted-foreground'
              }`}>
                2
              </div>
              <span className="ml-2 hidden sm:inline">Payment</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-royal-plum' : 'bg-muted-foreground'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-royal-plum' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 3 ? 'bg-royal-plum text-white border-royal-plum' : 'border-muted-foreground'
              }`}>
                3
              </div>
              <span className="ml-2 hidden sm:inline">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-8">
                {/* Contact Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold text-royal-plum mb-6">
                      Contact Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingForm.email}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={shippingForm.phone}
                          onChange={handleShippingChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold text-royal-plum mb-6">
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={shippingForm.firstName}
                            onChange={handleShippingChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={shippingForm.lastName}
                            onChange={handleShippingChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={shippingForm.address}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                        <Input
                          id="apartment"
                          name="apartment"
                          value={shippingForm.apartment}
                          onChange={handleShippingChange}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={shippingForm.city}
                            onChange={handleShippingChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            name="state"
                            value={shippingForm.state}
                            onChange={handleShippingChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={shippingForm.zipCode}
                            onChange={handleShippingChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                {/* Payment Method */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold text-royal-plum mb-6">
                      Payment Method
                    </h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit Card
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Credit Card Details */}
                {paymentMethod === 'credit-card' && (
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-royal-plum mb-4">Card Information</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nameOnCard">Name on Card *</Label>
                          <Input
                            id="nameOnCard"
                            name="nameOnCard"
                            value={paymentForm.nameOnCard}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentForm.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              value={paymentForm.expiryDate}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              value={paymentForm.cvv}
                              onChange={handlePaymentChange}
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Billing Address */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                      />
                      <Label htmlFor="sameAsShipping">
                        Billing address same as shipping address
                      </Label>
                    </div>

                    {!sameAsShipping && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-royal-plum">Billing Address</h4>
                        {/* Billing form fields would go here */}
                        <p className="text-sm text-muted-foreground">
                          Billing address form fields would be rendered here when different from shipping.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              
              <div className="ml-auto">
                {step < 2 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
                  >
                    Continue to Payment
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
                  >
                    {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-bold text-royal-plum mb-6">
                  Order Summary
                </h3>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-warm-cream rounded overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-royal-plum line-clamp-2">
                          {item.name}
                        </h4>
                        <div className="text-xs text-muted-foreground">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-bold text-royal-plum">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-6" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-royal-plum">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>SSL secured checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Free shipping on orders $50+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>100% of profits support our mission</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </AuthRequired>
    </Layout>
  );
};

export default Checkout;