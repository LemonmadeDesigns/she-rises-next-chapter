import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const presetAmounts = [10, 25, 50, 100, 250, 500, 1000];

const impactMessages = {
  25: "Provides a hygiene kit",
  50: "Covers bus passes for job interviews",
  100: "Funds workshop supplies",
  250: "Sponsors one night of safe housing",
  500: "Supports a week of transitional housing",
  1000: "Funds a month of case management services"
};

const DonationWidget = () => {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [isCustom, setIsCustom] = useState(false);
  const { toast } = useToast();

  const handleAmountClick = (value: number) => {
    setAmount(value);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setIsCustom(true);
    if (value && !isNaN(Number(value))) {
      setAmount(Number(value));
    }
  };

  const handleDonate = () => {
    const finalAmount = isCustom ? Number(customAmount) : amount;
    
    if (finalAmount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Thank you for your generosity!",
      description: `Processing your ${frequency} donation of $${finalAmount}...`,
    });
    
    // Here you would integrate with Stripe/PayPal
    console.log("Processing donation:", { amount: finalAmount, frequency });
  };

  const getImpactMessage = () => {
    const closestAmount = Object.keys(impactMessages)
      .map(Number)
      .reduce((prev, curr) => {
        return Math.abs(curr - amount) < Math.abs(prev - amount) ? curr : prev;
      });
    
    return impactMessages[closestAmount as keyof typeof impactMessages];
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="mb-6">
          <h3 className="font-serif text-2xl font-bold text-royal-plum mb-2">
            Choose Your Impact
          </h3>
          <p className="text-muted-foreground">
            Your support brings dignity and hope to women rebuilding their lives.
          </p>
        </div>

        <div className="mb-6">
          <RadioGroup value={frequency} onValueChange={(v) => setFrequency(v as "one-time" | "monthly")}>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time" className="cursor-pointer">One-Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {presetAmounts.map((value) => (
            <Button
              key={value}
              variant={amount === value && !isCustom ? "default" : "outline"}
              className={amount === value && !isCustom ? "bg-crown-gold hover:bg-crown-gold/90 text-royal-plum" : ""}
              onClick={() => handleAmountClick(value)}
            >
              ${value}
            </Button>
          ))}
          <div className="relative">
            <Input
              type="number"
              placeholder="Custom"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className={isCustom ? "border-crown-gold" : ""}
            />
          </div>
        </div>

        {amount >= 25 && (
          <div className="bg-warm-cream rounded-lg p-4 mb-6">
            <p className="text-sm text-royal-plum font-medium">
              Your ${amount} donation {getImpactMessage()}
            </p>
          </div>
        )}

        <Button 
          onClick={handleDonate}
          className="w-full bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold text-lg py-6"
        >
          Donate ${isCustom ? customAmount : amount} {frequency === "monthly" ? "Monthly" : ""}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          She Rises is a 501(c)(3) nonprofit organization. 
          Your donation is tax-deductible to the extent allowed by law.
        </p>
      </CardContent>
    </Card>
  );
};

export default DonationWidget;