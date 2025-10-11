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
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const volunteerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  cityState: z.string().optional(),
  interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
  availability: z.string().min(1, "Please select your availability"),
  skills: z.string().max(1000, "Skills must be less than 1000 characters").optional(),
  referral: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted",
  }),
  honeypot: z.string().max(0, "Invalid submission"),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

interface BecomeVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTEREST_OPTIONS = [
  "Mentoring",
  "Events",
  "Outreach",
  "Admin Support",
  "Fundraising",
  "Other",
];

const AVAILABILITY_OPTIONS = [
  "Weekdays",
  "Evenings",
  "Weekends",
  "Flexible",
];

const REFERRAL_OPTIONS = [
  "Friend/Family",
  "Social Media",
  "School/Org",
  "Event",
  "Other",
];

export default function BecomeVolunteerModal({
  isOpen,
  onClose,
}: BecomeVolunteerModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      honeypot: "",
      consent: false,
      interests: [],
    },
  });

  const handleInterestChange = (interest: string, checked: boolean) => {
    const newInterests = checked
      ? [...selectedInterests, interest]
      : selectedInterests.filter((i) => i !== interest);
    setSelectedInterests(newInterests);
    setValue("interests", newInterests, { shouldValidate: true });
  };

  const onSubmit = async (data: VolunteerFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke("submit-volunteer-form", {
        body: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || "",
          cityState: data.cityState || "",
          interests: data.interests.join(", "),
          availability: data.availability,
          skills: data.skills || "",
          referral: data.referral || "",
          honeypot: data.honeypot,
        },
      });

      if (error) throw error;

      if (result?.ok) {
        setIsSubmitted(true);
        reset();
        setSelectedInterests([]);
        
        toast({
          title: "Application Submitted!",
          description: "Thank you for stepping up to volunteer! Our team will contact you soon.",
        });
      } else {
        throw new Error(result?.error || "Submission failed");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    reset();
    setSelectedInterests([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-royal-plum">
            Become a Volunteer
          </DialogTitle>
          <DialogDescription>
            Join our mission to empower women and transform lives. Fill out the form below to apply.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-royal-plum">
              Thank You for Applying!
            </h3>
            <p className="text-muted-foreground">
              Thank you for stepping up to volunteer! Our team will contact you soon.
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-sm text-destructive mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
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
                <Label htmlFor="phone">Mobile Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                />
              </div>

              <div>
                <Label htmlFor="cityState">City, State</Label>
                <Input
                  id="cityState"
                  {...register("cityState")}
                />
              </div>
            </div>

            <div>
              <Label>
                Areas of Interest <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest-${interest}`}
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={(checked) =>
                        handleInterestChange(interest, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`interest-${interest}`}
                      className="font-normal cursor-pointer"
                    >
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.interests && (
                <p className="text-sm text-destructive mt-1">
                  {errors.interests.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="availability">
                Availability <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("availability", value, { shouldValidate: true })}>
                <SelectTrigger id="availability" aria-invalid={!!errors.availability}>
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.availability && (
                <p className="text-sm text-destructive mt-1">
                  {errors.availability.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="skills">Skills / Experience</Label>
              <Textarea
                id="skills"
                {...register("skills")}
                placeholder="Tell us about your relevant skills and experience..."
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {watch("skills")?.length || 0} / 1000 characters
              </p>
            </div>

            <div>
              <Label htmlFor="referral">How did you hear about us?</Label>
              <Select onValueChange={(value) => setValue("referral", value)}>
                <SelectTrigger id="referral">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {REFERRAL_OPTIONS.map((option) => (
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
                  "Submit Application"
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
