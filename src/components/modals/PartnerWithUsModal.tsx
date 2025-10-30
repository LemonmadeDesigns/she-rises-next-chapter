import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { submitContactForm } from "@/config/contact";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const partnerSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  partnershipTypes: z.array(z.string()).min(1, "Please select at least one partnership type"),
  proposal: z.string()
    .min(20, "Proposal must be at least 20 characters")
    .max(1500, "Proposal must be less than 1500 characters"),
  timeline: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted",
  }),
  honeypot: z.string().max(0, "Invalid submission"),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

interface PartnerWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PARTNERSHIP_TYPES = [
  "Corporate Sponsorship",
  "Program Collaboration",
  "In-Kind Donation",
  "Venue/Logistics",
  "Volunteer Engagement",
  "Other",
];

const TIMELINE_OPTIONS = [
  "Within 1 Month",
  "1–3 Months",
  "3–6 Months",
  "Flexible",
];

export default function PartnerWithUsModal({
  isOpen,
  onClose,
}: PartnerWithUsModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      honeypot: "",
      consent: false,
      partnershipTypes: [],
    },
  });

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...selectedTypes, type]
      : selectedTypes.filter((t) => t !== type);
    setSelectedTypes(newTypes);
    setValue("partnershipTypes", newTypes, { shouldValidate: true });
  };

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);

    try {
      // Format the partnership details for the message
      const partnershipMessage = `
Organization: ${data.organizationName}
Website: ${data.website || 'Not provided'}
Partnership Types: ${data.partnershipTypes.join(", ")}
Timeline: ${data.timeline || 'Not specified'}

Proposal:
${data.proposal}
      `.trim();

      // Submit to Google Apps Script
      const result = await submitContactForm(
        data.contactName,
        data.email,
        `Partnership Inquiry - ${data.organizationName}`,
        partnershipMessage,
        data.honeypot,
        data.phone || '',
        'Partnership'
      );

      if (result.ok) {
        setIsSubmitted(true);
        reset();
        setSelectedTypes([]);

        toast({
          title: "Inquiry Submitted!",
          description: "Thank you for reaching out to partner with us. We'll follow up shortly.",
        });
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was a problem submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    reset();
    setSelectedTypes([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-royal-plum">
            Partner With Us
          </DialogTitle>
          <DialogDescription>
            Let's create meaningful impact together. Tell us about your organization and partnership goals.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-royal-plum">
              Thank You for Reaching Out!
            </h3>
            <p className="text-muted-foreground">
              Thank you for reaching out to partner with us. We'll follow up shortly.
            </p>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-destructive/10 border border-destructive rounded-md p-4">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <p className="font-semibold">Please fix the following errors:</p>
                </div>
                <ul className="list-disc list-inside text-sm text-destructive space-y-1">
                  {Object.entries(errors).map(([key, error]) => (
                    <li key={key}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              {...register("honeypot")}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <Label htmlFor="organizationName">
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="organizationName"
                {...register("organizationName")}
                aria-invalid={!!errors.organizationName}
                aria-describedby={errors.organizationName ? "org-error" : undefined}
              />
              {errors.organizationName && (
                <p id="org-error" className="text-sm text-destructive mt-1">
                  {errors.organizationName.message}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">
                  Primary Contact Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactName"
                  {...register("contactName")}
                  aria-invalid={!!errors.contactName}
                  aria-describedby={errors.contactName ? "contact-error" : undefined}
                />
                {errors.contactName && (
                  <p id="contact-error" className="text-sm text-destructive mt-1">
                    {errors.contactName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  Work Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  {...register("website")}
                  aria-invalid={!!errors.website}
                />
                {errors.website && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.website.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>
                Partnership Type <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {PARTNERSHIP_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={(checked) =>
                        handleTypeChange(type, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="font-normal cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.partnershipTypes && (
                <p className="text-sm text-destructive mt-1">
                  {errors.partnershipTypes.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="proposal">
                Brief Proposal or Goals <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="proposal"
                {...register("proposal")}
                placeholder="Tell us about your partnership goals and how we can work together..."
                rows={5}
                maxLength={1500}
                aria-invalid={!!errors.proposal}
                aria-describedby={errors.proposal ? "proposal-error" : undefined}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {watch("proposal")?.length || 0} / 1500 characters (minimum 20)
              </p>
              {errors.proposal && (
                <p id="proposal-error" className="text-sm text-destructive mt-1">
                  {errors.proposal.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="timeline">Timeline / Urgency</Label>
              <Select onValueChange={(value) => setValue("timeline", value)}>
                <SelectTrigger id="timeline">
                  <SelectValue placeholder="Select a timeline" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={watch("consent")}
                onCheckedChange={(checked) => setValue("consent", checked as boolean, { shouldValidate: true })}
                aria-invalid={!!errors.consent}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="consent"
                  className="font-normal cursor-pointer"
                >
                  I agree to be contacted and my data may be stored per our{" "}
                  <a href="/privacy" className="text-primary underline" target="_blank">
                    Privacy Policy
                  </a>
                  . <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  We'll never sell your data.
                </p>
                {errors.consent && (
                  <p className="text-sm text-destructive">
                    {errors.consent.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Inquiry"
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
        )}
      </DialogContent>
    </Dialog>
  );
}
