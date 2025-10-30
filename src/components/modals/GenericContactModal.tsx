import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";
import { submitContactForm } from "@/config/contact";

interface GenericContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  inquiryType: string;
  options?: { value: string; label: string }[];
}

const GenericContactModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  inquiryType,
  options
}: GenericContactModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    selection: "",
    message: "",
    company: "" // Honeypot field
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullMessage = `
Inquiry Type: ${inquiryType}
${formData.organization ? `Organization: ${formData.organization}` : ''}
${formData.selection && options ? `${options[0]?.label || 'Selection'}: ${formData.selection}` : ''}

Message:
${formData.message}
      `;

      // Submit to Google Apps Script
      const result = await submitContactForm(
        formData.name,
        formData.email,
        inquiryType, // Use inquiry type as subject
        `${fullMessage.trim()}\n\nPhone: ${formData.phone || 'Not provided'}`,
        formData.company
      );

      if (!result.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setTimeout(() => {
        setFormData({
          name: "",
          organization: "",
          email: "",
          phone: "",
          selection: "",
          message: "",
          company: ""
        });
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      organization: "",
      email: "",
      phone: "",
      selection: "",
      message: "",
      company: ""
    });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Mail className="h-6 w-6 text-royal-plum" />
            {title}
          </DialogTitle>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="sherises-contact space-y-4">
            {/* Honeypot field for spam protection */}
            <input
              type="text"
              name="company"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="organization">Organization/Company</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              {options && options.length > 0 && (
                <div className="col-span-2">
                  <Label htmlFor="selection">Interested In</Label>
                  <Select value={formData.selection} onValueChange={(value) => handleInputChange('selection', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="col-span-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={5}
                  required
                  placeholder="Tell us more about your interest..."
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-royal-plum hover:bg-royal-plum/90"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-royal-plum mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Your message has been sent successfully. We'll be in touch soon!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenericContactModal;
