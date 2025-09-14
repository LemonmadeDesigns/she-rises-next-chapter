import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, CheckCircle, X } from "lucide-react";

interface NewsletterSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterSubscriptionModal = ({ isOpen, onClose }: NewsletterSubscriptionModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call to your newsletter service
      // Example: await fetch('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubscribed(true);

      toast({
        title: "Successfully Subscribed!",
        description: `Welcome to our newsletter! We've sent a confirmation to ${email}.`,
      });

      // Reset form after a delay
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
        onClose();
      }, 2000);

    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsSubscribed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-royal-plum">
              <Mail className="h-5 w-5 text-crown-gold" />
              Subscribe to Our Newsletter
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {!isSubscribed ? (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-muted-foreground">
                Stay updated with our latest events, programs, and ways to get involved
                in empowering women in our community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-royal-plum">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-crown-gold focus:border-crown-gold"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-royal-plum border-t-transparent mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-crown-gold rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-royal-plum" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-royal-plum mb-2">
                Welcome to She Rises!
              </h3>
              <p className="text-muted-foreground">
                Thank you for subscribing to our newsletter. You'll receive updates
                about our programs, events, and ways to make a difference.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterSubscriptionModal;