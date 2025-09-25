import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, User, Mail, Phone, X, CheckCircle } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  capacity: number;
  registered: number;
  description: string;
  highlights: string[];
}

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventRegistrationModal = ({ isOpen, onClose, event }: EventRegistrationModalProps) => {
  const [registrationForm, setRegistrationForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    dietaryRestrictions: "",
    accessibility: "",
    howHeard: "",
    newsletter: true,
    attendeesCount: 1,
    specialRequests: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event registration submitted:", { event: event?.id, ...registrationForm });
    setIsSubmitted(true);
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false);
      setRegistrationForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        emergencyContact: "",
        emergencyPhone: "",
        dietaryRestrictions: "",
        accessibility: "",
        howHeard: "",
        newsletter: true,
        attendeesCount: 1,
        specialRequests: ""
      });
      onClose();
    }, 3000);
  };

  const updateForm = (field: string, value: string | number | boolean) => {
    setRegistrationForm(prev => ({
      ...prev,
      [field]: value
    }));
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

  if (!event) return null;

  const spotsRemaining = event.capacity - event.registered;
  const isPaidEvent = event.price !== "Free";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="font-serif text-2xl text-royal-plum pr-8">
                  Register for Event
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Event Details Summary */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-bold text-royal-plum mb-4">
                  {event.title}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{spotsRemaining} spots remaining</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-warm-cream rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-royal-plum">Event Cost:</span>
                    <span className="text-lg font-bold text-crown-gold">
                      {event.price}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                  Personal Information
                </Label>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={registrationForm.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={registrationForm.lastName}
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
                      value={registrationForm.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={registrationForm.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                  Emergency Contact
                </Label>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={registrationForm.emergencyContact}
                      onChange={(e) => updateForm('emergencyContact', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={registrationForm.emergencyPhone}
                      onChange={(e) => updateForm('emergencyPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Event Specific Information */}
              <div>
                <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                  Event Details
                </Label>
                
                <div className="mb-4">
                  <Label htmlFor="attendeesCount">Number of Attendees</Label>
                  <Select 
                    value={registrationForm.attendeesCount.toString()} 
                    onValueChange={(value) => updateForm('attendeesCount', parseInt(value))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions or Food Allergies</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={registrationForm.dietaryRestrictions}
                    onChange={(e) => updateForm('dietaryRestrictions', e.target.value)}
                    placeholder="Please list any dietary restrictions, food allergies, or special meal requirements..."
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="accessibility">Accessibility Needs</Label>
                  <Textarea
                    id="accessibility"
                    value={registrationForm.accessibility}
                    onChange={(e) => updateForm('accessibility', e.target.value)}
                    placeholder="Please describe any accommodations needed (wheelchair access, sign language interpretation, large print materials, etc.)"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="specialRequests">Special Requests or Comments</Label>
                  <Textarea
                    id="specialRequests"
                    value={registrationForm.specialRequests}
                    onChange={(e) => updateForm('specialRequests', e.target.value)}
                    placeholder="Any additional information or special requests..."
                  />
                </div>
              </div>

              {/* How did you hear about us */}
              <div>
                <Label htmlFor="howHeard">How did you hear about this event?</Label>
                <Select 
                  value={registrationForm.howHeard} 
                  onValueChange={(value) => updateForm('howHeard', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="friend">Friend or Family</SelectItem>
                    <SelectItem value="community-partner">Community Partner</SelectItem>
                    <SelectItem value="previous-participant">Previous Program Participant</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Newsletter Signup */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={registrationForm.newsletter}
                  onCheckedChange={(checked) => updateForm('newsletter', checked as boolean)}
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Subscribe to our newsletter for updates on programs, events, and impact stories
                </Label>
              </div>

              {/* Payment Information for Paid Events */}
              {isPaidEvent && (
                <div className="border-t pt-6">
                  <Label className="text-lg font-semibold text-royal-plum mb-4 block">
                    Payment Information
                  </Label>
                  <div className="bg-warm-cream rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span>Event Registration ({registrationForm.attendeesCount} {registrationForm.attendeesCount === 1 ? 'person' : 'people'})</span>
                      <span className="font-bold text-royal-plum">
                        ${(parseFloat(event.price.replace('$', '')) * registrationForm.attendeesCount).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Payment will be processed securely after registration confirmation. 
                      You will receive payment instructions via email.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="border-t pt-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    By registering, you agree to our event terms and conditions and 
                    understand that space is limited and confirmed on a first-come basis.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
                    disabled={spotsRemaining <= 0}
                  >
                    {spotsRemaining <= 0 ? 'Event Full' : 'Complete Registration'}
                  </Button>
                </div>
              </div>
            </form>
          </>
        ) : (
          /* Success Message */
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-crown-gold mx-auto mb-6" />
            <h2 className="font-serif text-2xl font-bold text-royal-plum mb-4">
              Registration Successful!
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Thank you for registering for "{event.title}". You will receive a confirmation 
              email shortly with event details and any additional information.
            </p>
            
            {isPaidEvent && (
              <div className="bg-warm-cream rounded-lg p-4 mb-6">
                <p className="text-sm text-royal-plum font-medium">
                  Payment instructions have been sent to your email. 
                  Please complete payment within 48 hours to secure your spot.
                </p>
              </div>
            )}
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Add the event to your calendar</p>
              <p>• Check your email for confirmation details</p>
              <p>• Contact us at (909) 547-9998 with any questions</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;