import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { FileText, CheckCircle, X } from "lucide-react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Emergency Contact
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;

  // Background Information
  currentSituation: string;
  housingSituation: string;
  employment: string;
  education: string;
  children: string;
  childrenAges: string;

  // Program Information
  programsInterested: string[];
  goals: string;
  challenges: string;
  previousServices: string;
  medicalNeeds: string;
  transportation: string;

  // Legal
  backgroundCheck: boolean;
  consent: boolean;
}

const ApplicationModal = ({ isOpen, onClose }: ApplicationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    currentSituation: "",
    housingSituation: "",
    employment: "",
    education: "",
    children: "",
    childrenAges: "",
    programsInterested: [],
    goals: "",
    challenges: "",
    previousServices: "",
    medicalNeeds: "",
    transportation: "",
    backgroundCheck: false,
    consent: false,
  });

  const totalSteps = 4;

  const handleInputChange = (field: keyof ApplicationFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProgramInterestChange = (program: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      programsInterested: checked
        ? [...prev.programsInterested, program]
        : prev.programsInterested.filter(p => p !== program)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 2:
        return !!(formData.emergencyName && formData.emergencyPhone && formData.currentSituation);
      case 3:
        return !!(formData.programsInterested.length > 0 && formData.goals);
      case 4:
        return formData.backgroundCheck && formData.consent;
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
    if (!validateStep(4)) {
      toast({
        title: "Please Complete All Required Fields",
        description: "All required fields and agreements must be completed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call to save application
      // Example: await fetch('/api/applications', { method: 'POST', body: JSON.stringify(formData) });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSubmitted(true);

      toast({
        title: "Application Submitted!",
        description: "Thank you for your application. We'll be in touch within 2-3 business days.",
      });

      // Reset form after a delay
      setTimeout(() => {
        resetForm();
        onClose();
      }, 3000);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
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
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      emergencyName: "",
      emergencyRelation: "",
      emergencyPhone: "",
      currentSituation: "",
      housingSituation: "",
      employment: "",
      education: "",
      children: "",
      childrenAges: "",
      programsInterested: [],
      goals: "",
      challenges: "",
      previousServices: "",
      medicalNeeds: "",
      transportation: "",
      backgroundCheck: false,
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
              Application Submitted Successfully!
            </h3>
            <p className="text-muted-foreground">
              Thank you for applying to our programs. Our team will review your application
              and contact you within 2-3 business days.
            </p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">Personal Information</h3>
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
            <div className="grid grid-cols-2 gap-4">
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">Emergency Contact & Background</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyName}
                  onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                  required
                />
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
            <div>
              <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="currentSituation">Current Housing/Living Situation *</Label>
              <Select value={formData.currentSituation} onValueChange={(value) => handleInputChange('currentSituation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homeless">Currently Homeless</SelectItem>
                  <SelectItem value="transitional">Transitional Housing</SelectItem>
                  <SelectItem value="temporary">Temporary Housing with Family/Friends</SelectItem>
                  <SelectItem value="shelter">Emergency Shelter</SelectItem>
                  <SelectItem value="unsafe">Unsafe Housing Situation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="employment">Employment Status</Label>
              <Select value={formData.employment} onValueChange={(value) => handleInputChange('employment', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="disabled">Unable to Work</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="children">Do you have children?</Label>
                <Select value={formData.children} onValueChange={(value) => handleInputChange('children', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="childrenAges">If yes, ages of children</Label>
                <Input
                  id="childrenAges"
                  value={formData.childrenAges}
                  onChange={(e) => handleInputChange('childrenAges', e.target.value)}
                  placeholder="e.g. 5, 8, 12"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">Program Information</h3>
            <div>
              <Label className="text-base font-medium">Which programs are you interested in? *</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {[
                  "Safe Haven Housing Program",
                  "Rise & Thrive Transition Program",
                  "Empowerment Workshops",
                  "Career Development Services",
                  "Financial Literacy Program",
                  "Childcare Support",
                  "Legal Advocacy Services",
                  "Mental Health Support"
                ].map((program) => (
                  <div key={program} className="flex items-center space-x-2">
                    <Checkbox
                      id={program}
                      checked={formData.programsInterested.includes(program)}
                      onCheckedChange={(checked) => handleProgramInterestChange(program, checked as boolean)}
                    />
                    <Label htmlFor={program} className="text-sm font-normal">{program}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="goals">What are your main goals for participating in our programs? *</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                placeholder="Please describe your goals and what you hope to achieve..."
                required
              />
            </div>
            <div>
              <Label htmlFor="challenges">What challenges are you currently facing?</Label>
              <Textarea
                id="challenges"
                value={formData.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                placeholder="This helps us better understand how to support you..."
              />
            </div>
            <div>
              <Label htmlFor="transportation">Do you have reliable transportation?</Label>
              <Select value={formData.transportation} onValueChange={(value) => handleInputChange('transportation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="sometimes">Sometimes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">Additional Information & Agreements</h3>
            <div>
              <Label htmlFor="previousServices">Have you received services from other organizations?</Label>
              <Textarea
                id="previousServices"
                value={formData.previousServices}
                onChange={(e) => handleInputChange('previousServices', e.target.value)}
                placeholder="Please list any other services or programs you've participated in..."
              />
            </div>
            <div>
              <Label htmlFor="medicalNeeds">Do you have any special medical or accessibility needs?</Label>
              <Textarea
                id="medicalNeeds"
                value={formData.medicalNeeds}
                onChange={(e) => handleInputChange('medicalNeeds', e.target.value)}
                placeholder="This information helps us provide appropriate accommodations..."
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="backgroundCheck"
                  checked={formData.backgroundCheck}
                  onCheckedChange={(checked) => handleInputChange('backgroundCheck', checked as boolean)}
                />
                <Label htmlFor="backgroundCheck" className="text-sm leading-relaxed">
                  I understand that a background check may be required for certain programs and I consent to this process. *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => handleInputChange('consent', checked as boolean)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I consent to She Rises contacting me about my application and services. I understand that my information will be kept confidential and used only for program purposes. *
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
              <FileText className="h-5 w-5 text-crown-gold" />
              Program Application
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

export default ApplicationModal;