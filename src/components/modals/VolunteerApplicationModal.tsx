import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, CheckCircle, X } from "lucide-react";

interface VolunteerApplication {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;

  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // Volunteer Information
  roleAppliedFor: string;
  availability: string;
  startDate: string;
  experience: string;
  skills: string;
  motivation: string;

  // Background & References
  education: string;
  employment: string;
  volunteerHistory: string;
  references: string;

  // Legal & Agreement
  backgroundCheck: boolean;
  commitment: boolean;
  consent: boolean;
}

interface VolunteerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleTitle: string;
}

const VolunteerApplicationModal = ({ isOpen, onClose, roleTitle }: VolunteerApplicationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<VolunteerApplication>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    roleAppliedFor: roleTitle,
    availability: "",
    startDate: "",
    experience: "",
    skills: "",
    motivation: "",
    education: "",
    employment: "",
    volunteerHistory: "",
    references: "",
    backgroundCheck: false,
    commitment: false,
    consent: false,
  });

  const totalSteps = 3;

  const handleInputChange = (field: keyof VolunteerApplication, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 2:
        return !!(formData.emergencyName && formData.emergencyPhone && formData.availability && formData.motivation);
      case 3:
        return formData.backgroundCheck && formData.commitment && formData.consent;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Please Complete Required Fields",
        description: "All required fields must be filled before continuing.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Please Complete All Required Fields",
        description: "All required fields and agreements must be completed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call to save volunteer application
      // Example: await fetch('/api/volunteer-applications', { method: 'POST', body: JSON.stringify(formData) });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSubmitted(true);

      toast({
        title: "Application Submitted!",
        description: `Thank you for applying to volunteer as a ${roleTitle}. We'll contact you within 5-7 business days.`,
      });

      // Reset form after a delay
      setTimeout(() => {
        resetForm();
        onClose();
      }, 3000);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your volunteer application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setIsSubmitted(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      dateOfBirth: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
      roleAppliedFor: roleTitle,
      availability: "",
      startDate: "",
      experience: "",
      skills: "",
      motivation: "",
      education: "",
      employment: "",
      volunteerHistory: "",
      references: "",
      backgroundCheck: false,
      commitment: false,
      consent: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderStepContent = () => {
    if (isSubmitted) {
      return (
        <div className="text-center space-y-4 py-8">
          <div className="w-16 h-16 bg-crown-gold rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-royal-plum" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-royal-plum mb-2">
              Volunteer Application Submitted!
            </h3>
            <p className="text-muted-foreground">
              Thank you for your interest in volunteering as a <strong>{roleTitle}</strong>.
              Our volunteer coordinator will review your application and contact you within 5-7 business days.
            </p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">
              Personal Information
            </h3>
            <div className="bg-crown-gold/10 p-4 rounded-lg mb-4">
              <p className="text-sm text-royal-plum font-medium">
                Applying for: <span className="font-bold">{roleTitle}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t pt-4 mt-6">
              <h4 className="font-semibold text-royal-plum mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyName}
                    onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyRelation">Relationship</Label>
                <Input
                  id="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">
              Volunteer Experience & Availability
            </h3>

            <div>
              <Label htmlFor="availability">Availability *</Label>
              <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="evenings">Evenings</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="once-week">Once per week</SelectItem>
                  <SelectItem value="twice-week">Twice per week</SelectItem>
                  <SelectItem value="full-time">Full-time commitment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Preferred Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="motivation">Why do you want to volunteer with She Rises? *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                placeholder="Please share your motivation for volunteering with us..."
                required
              />
            </div>

            <div>
              <Label htmlFor="experience">Relevant Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Please describe any relevant volunteer or professional experience..."
              />
            </div>

            <div>
              <Label htmlFor="skills">Special Skills or Qualifications</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="Languages, certifications, special training, etc..."
              />
            </div>

            <div>
              <Label htmlFor="education">Education Background</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="Highest level completed"
              />
            </div>

            <div>
              <Label htmlFor="employment">Current Employment Status</Label>
              <Select value={formData.employment} onValueChange={(value) => handleInputChange('employment', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed Full-time</SelectItem>
                  <SelectItem value="part-time">Employed Part-time</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">
              Additional Information & Agreements
            </h3>

            <div>
              <Label htmlFor="volunteerHistory">Previous Volunteer Experience</Label>
              <Textarea
                id="volunteerHistory"
                value={formData.volunteerHistory}
                onChange={(e) => handleInputChange('volunteerHistory', e.target.value)}
                placeholder="Please describe any previous volunteer work you've done..."
              />
            </div>

            <div>
              <Label htmlFor="references">References</Label>
              <Textarea
                id="references"
                value={formData.references}
                onChange={(e) => handleInputChange('references', e.target.value)}
                placeholder="Please provide names and contact information for 2 references..."
              />
            </div>

            <div className="space-y-4 border-t pt-6 mt-6">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="backgroundCheck"
                  checked={formData.backgroundCheck}
                  onCheckedChange={(checked) => handleInputChange('backgroundCheck', checked as boolean)}
                />
                <Label htmlFor="backgroundCheck" className="text-sm leading-relaxed">
                  I understand that a background check will be required and I consent to this process. I understand that certain findings may disqualify me from volunteering. *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="commitment"
                  checked={formData.commitment}
                  onCheckedChange={(checked) => handleInputChange('commitment', checked as boolean)}
                />
                <Label htmlFor="commitment" className="text-sm leading-relaxed">
                  I understand the volunteer requirements for this role and am committed to fulfilling my obligations. I will provide advance notice if I cannot fulfill my volunteer commitment. *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => handleInputChange('consent', checked as boolean)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I consent to She Rises contacting me about my volunteer application and scheduling. I understand that my information will be kept confidential and used only for volunteer coordination purposes. *
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-royal-plum">
              <UserPlus className="h-5 w-5 text-crown-gold" />
              Volunteer Application
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

        {!isSubmitted && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-crown-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {renderStepContent()}

        {!isSubmitted && (
          <div className="flex justify-between gap-2 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-royal-plum border-t-transparent mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerApplicationModal;