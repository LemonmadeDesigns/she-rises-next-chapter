import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { FileText, CheckCircle } from "lucide-react";
import { submitIntakeForm } from "@/config/contact";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationFormData {
  // Section 1: Basic Information
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  age: string;
  preferredLanguage: string;
  genderIdentity: string;
  genderIdentityOther: string;
  justiceInvolved: string;
  currentlyHomeless: string;
  currentCounty: string;

  // Section 2: Location & Program Fit
  preferredLocation: string;
  willingToParticipate: string;
  sharedHousing: string;
  referralSource: string;
  referralSourceOther: string;

  // Section 3: Housing Category
  housingCategories: string[];

  // Section 4: Pet Screening
  hasPets: string;
  petType: string;
  isServiceAnimal: string;
  hasVaccinationProof: string;

  // Section 5: Medical & Insurance
  medicalInsurance: string;
  hasMedicalConditions: string;
  medicalConditionsDetail: string;

  // Section 6: Income & Benefits
  employmentStatus: string;
  benefits: string[];
  monthlyIncome: string;
  fundingExpectation: string[];

  // Section 7: Safety & Readiness
  domesticViolence: string;
  substanceUse: string;
  willingCaseManagement: string;

  // Section 8: Case Management
  hasCaseManager: string;
  caseManagerInfo: string;
  spoken211: string;

  // Section 9: Consent
  acknowledgment: boolean;

  // Security: Honeypot field (should remain empty)
  company: string;
}

const ApplicationModal = ({ isOpen, onClose }: ApplicationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ApplicationFormData>({
    // Section 1: Basic Information
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    age: "",
    preferredLanguage: "",
    genderIdentity: "",
    genderIdentityOther: "",
    justiceInvolved: "",
    currentlyHomeless: "",
    currentCounty: "",
    // Section 2: Location & Program Fit
    preferredLocation: "",
    willingToParticipate: "",
    sharedHousing: "",
    referralSource: "",
    referralSourceOther: "",
    // Section 3: Housing Category
    housingCategories: [],
    // Section 4: Pet Screening
    hasPets: "",
    petType: "",
    isServiceAnimal: "",
    hasVaccinationProof: "",
    // Section 5: Medical & Insurance
    medicalInsurance: "",
    hasMedicalConditions: "",
    medicalConditionsDetail: "",
    // Section 6: Income & Benefits
    employmentStatus: "",
    benefits: [],
    monthlyIncome: "",
    fundingExpectation: [],
    // Section 7: Safety & Readiness
    domesticViolence: "",
    substanceUse: "",
    willingCaseManagement: "",
    // Section 8: Case Management
    hasCaseManager: "",
    caseManagerInfo: "",
    spoken211: "",
    // Section 9: Consent
    acknowledgment: false,
    // Security: Honeypot field
    company: "",
  });

  const totalSteps = 9;

  const handleInputChange = (field: keyof ApplicationFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'housingCategories' | 'benefits' | 'fundingExpectation', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item: string) => item !== value)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.phoneNumber && formData.emailAddress && formData.age && formData.currentlyHomeless && formData.currentCounty);
      case 2:
        return !!(formData.preferredLocation && formData.willingToParticipate && formData.sharedHousing);
      case 3:
        return formData.housingCategories.length > 0;
      case 4:
        return !!formData.hasPets;
      case 5:
        return !!formData.medicalInsurance;
      case 6:
        return !!formData.employmentStatus;
      case 7:
        return !!(formData.domesticViolence && formData.willingCaseManagement);
      case 8:
        return !!formData.hasCaseManager;
      case 9:
        return formData.acknowledgment;
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
    // Check honeypot field - if filled, it's likely a bot
    if (formData.company) {
      console.warn('Suspected bot submission blocked');
      toast({
        title: "Submission Error",
        description: "There was an error processing your submission. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!validateStep(9)) {
      toast({
        title: "Please Complete All Required Fields",
        description: "All required fields and agreements must be completed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format application message with new structure
      const applicationMessage = `
═══════════════════════════════════════════
SHE RISES - HOUSING INTAKE & ELIGIBILITY SCREENING
═══════════════════════════════════════════

SECTION 1: BASIC INFORMATION
═══════════════════════════════════════════
Full Name: ${formData.fullName}
Phone Number: ${formData.phoneNumber}
Email Address: ${formData.emailAddress}
Age: ${formData.age}
Preferred Language: ${formData.preferredLanguage || 'Not specified'}
Gender Identity: ${formData.genderIdentity}${formData.genderIdentityOther ? ` - ${formData.genderIdentityOther}` : ''}
Justice-Involved: ${formData.justiceInvolved}
Currently Homeless/Unstably Housed: ${formData.currentlyHomeless}
Current County: ${formData.currentCounty}

SECTION 2: LOCATION & PROGRAM FIT
═══════════════════════════════════════════
Preferred Location: ${formData.preferredLocation}
Willing to Participate in Structured Program: ${formData.willingToParticipate}
Able to Live in Shared Housing: ${formData.sharedHousing}
Referral Source: ${formData.referralSource}${formData.referralSourceOther ? ` - ${formData.referralSourceOther}` : ''}

SECTION 3: HOUSING CATEGORY
═══════════════════════════════════════════
Current Situation: ${formData.housingCategories.join(', ')}

SECTION 4: PET SCREENING
═══════════════════════════════════════════
Has Pets: ${formData.hasPets}
${formData.hasPets === 'Yes' ? `Pet Type: ${formData.petType || 'Not specified'}
Is Service Animal: ${formData.isServiceAnimal || 'Not specified'}
Has Vaccination Proof: ${formData.hasVaccinationProof || 'Not specified'}` : ''}

SECTION 5: MEDICAL & INSURANCE
═══════════════════════════════════════════
Medical Insurance: ${formData.medicalInsurance}
Has Medical Conditions: ${formData.hasMedicalConditions}
${formData.hasMedicalConditions === 'YES' ? `Medical Conditions Detail: ${formData.medicalConditionsDetail}` : ''}

SECTION 6: INCOME & BENEFITS
═══════════════════════════════════════════
Employment Status: ${formData.employmentStatus}
Benefits Received: ${formData.benefits.length > 0 ? formData.benefits.join(', ') : 'None'}
Approximate Monthly Income: ${formData.monthlyIncome || 'Not specified'}
Expected Funding: ${formData.fundingExpectation.length > 0 ? formData.fundingExpectation.join(', ') : 'Not specified'}

SECTION 7: SAFETY & READINESS
═══════════════════════════════════════════
Active Domestic Violence/Safety Concerns: ${formData.domesticViolence}
Currently Using Substances: ${formData.substanceUse}
Willing to Participate in Case Management: ${formData.willingCaseManagement}

SECTION 8: CASE MANAGEMENT
═══════════════════════════════════════════
Has Case Manager: ${formData.hasCaseManager}
${formData.hasCaseManager === 'Yes' ? `Case Manager Info: ${formData.caseManagerInfo}` : ''}
Spoken with 211/Homeless Outreach: ${formData.spoken211}

SECTION 9: CONSENT
═══════════════════════════════════════════
Acknowledgment: ${formData.acknowledgment ? 'Yes - I understand that submitting this form does not guarantee placement and is used for eligibility screening and referrals.' : 'No'}
      `.trim();

      // Submit to Google Apps Script (dedicated intake form endpoint)
      const result = await submitIntakeForm(
        formData.fullName,
        formData.emailAddress,
        'Housing Intake & Eligibility Screening',
        applicationMessage,
        formData.company, // honeypot - should be empty for legitimate submissions
        formData.phoneNumber,
        'Housing Intake Application'
      );

      if (!result.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setIsSubmitted(true);

      toast({
        title: "Application Submitted!",
        description: "Thank you for submitting your intake to SHE RISES. Our team will review your information and contact you regarding next steps or appropriate referrals. We aim to acknowledge referrals within 3-5 business days.",
      });

      // Reset form after a delay
      setTimeout(() => {
        resetForm();
        onClose();
      }, 4000);

    } catch (error) {
      console.error("Error submitting application:", error);
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
      // Section 1: Basic Information
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      age: "",
      preferredLanguage: "",
      genderIdentity: "",
      genderIdentityOther: "",
      justiceInvolved: "",
      currentlyHomeless: "",
      currentCounty: "",
      // Section 2: Location & Program Fit
      preferredLocation: "",
      willingToParticipate: "",
      sharedHousing: "",
      referralSource: "",
      referralSourceOther: "",
      // Section 3: Housing Category
      housingCategories: [],
      // Section 4: Pet Screening
      hasPets: "",
      petType: "",
      isServiceAnimal: "",
      hasVaccinationProof: "",
      // Section 5: Medical & Insurance
      medicalInsurance: "",
      hasMedicalConditions: "",
      medicalConditionsDetail: "",
      // Section 6: Income & Benefits
      employmentStatus: "",
      benefits: [],
      monthlyIncome: "",
      fundingExpectation: [],
      // Section 7: Safety & Readiness
      domesticViolence: "",
      substanceUse: "",
      willingCaseManagement: "",
      // Section 8: Case Management
      hasCaseManager: "",
      caseManagerInfo: "",
      spoken211: "",
      // Section 9: Consent
      acknowledgment: false,
      // Security: Honeypot field
      company: "",
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
              Intake Submitted Successfully!
            </h3>
            <p className="text-muted-foreground">
              Thank you for submitting your intake to SHE RISES. Our team will review your information
              and contact you regarding next steps or appropriate referrals. We aim to acknowledge referrals
              within 3-5 business days. Submission does not guarantee placement.
            </p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 1: BASIC INFORMATION</h3>
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emailAddress">Email Address *</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Input
                  id="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                  placeholder="e.g., English, Spanish"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="genderIdentity">Gender Identity</Label>
              <Select value={formData.genderIdentity} onValueChange={(value) => handleInputChange('genderIdentity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Transgender Woman">Transgender Woman</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.genderIdentity === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
                  value={formData.genderIdentityOther}
                  onChange={(e) => handleInputChange('genderIdentityOther', e.target.value)}
                />
              )}
            </div>
            <div>
              <Label htmlFor="justiceInvolved">Justice-Involved?</Label>
              <Select value={formData.justiceInvolved} onValueChange={(value) => handleInputChange('justiceInvolved', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currentlyHomeless">Are you currently homeless or unstably housed? *</Label>
              <Select value={formData.currentlyHomeless} onValueChange={(value) => handleInputChange('currentlyHomeless', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currentCounty">County you are currently in *</Label>
              <Select value={formData.currentCounty} onValueChange={(value) => handleInputChange('currentCounty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="San Bernardino County">San Bernardino County</SelectItem>
                  <SelectItem value="Riverside County">Riverside County</SelectItem>
                  <SelectItem value="Los Angeles County">Los Angeles County</SelectItem>
                  <SelectItem value="Orange County">Orange County</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 2: LOCATION & PROGRAM FIT</h3>
            <div>
              <Label htmlFor="preferredLocation">Preferred city or county for housing *</Label>
              <Select value={formData.preferredLocation} onValueChange={(value) => handleInputChange('preferredLocation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fontana / San Bernardino County">Fontana / San Bernardino County</SelectItem>
                  <SelectItem value="Riverside County">Riverside County</SelectItem>
                  <SelectItem value="Los Angeles County">Los Angeles County</SelectItem>
                  <SelectItem value="Orange County">Orange County</SelectItem>
                  <SelectItem value="No preference">No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="willingToParticipate">Are you willing to participate in a structured transitional housing program with house rules and case management? *</Label>
              <Select value={formData.willingToParticipate} onValueChange={(value) => handleInputChange('willingToParticipate', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sharedHousing">Are you able to live in a shared housing environment? *</Label>
              <Select value={formData.sharedHousing} onValueChange={(value) => handleInputChange('sharedHousing', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="referralSource">Referral Source (check one)</Label>
              <Select value={formData.referralSource} onValueChange={(value) => handleInputChange('referralSource', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Self">Self</SelectItem>
                  <SelectItem value="Outreach Team">Outreach Team</SelectItem>
                  <SelectItem value="County / CES">County / CES</SelectItem>
                  <SelectItem value="Probation / Parole">Probation / Parole</SelectItem>
                  <SelectItem value="Hospital / Medical">Hospital / Medical</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.referralSource === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
                  value={formData.referralSourceOther}
                  onChange={(e) => handleInputChange('referralSourceOther', e.target.value)}
                />
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 3: HOUSING CATEGORY</h3>
            <div>
              <Label className="text-base font-medium">Which best describes your current situation? (select all that apply) *</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {[
                  "Experiencing homelessness",
                  "Fleeing domestic violence",
                  "Justice-involved / reentry",
                  "Medical vulnerability",
                  "Recently released from an institution"
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={formData.housingCategories.includes(category)}
                      onCheckedChange={(checked) => handleArrayChange('housingCategories', category, checked as boolean)}
                    />
                    <Label htmlFor={category} className="text-sm font-normal">{category}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 4: PET SCREENING</h3>
            <div>
              <Label htmlFor="hasPets">Do you have any pets or animals? *</Label>
              <Select value={formData.hasPets} onValueChange={(value) => handleInputChange('hasPets', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.hasPets === "Yes" && (
              <>
                <div>
                  <Label htmlFor="petType">Type of animal</Label>
                  <Select value={formData.petType} onValueChange={(value) => handleInputChange('petType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="isServiceAnimal">Is the animal a trained service animal (ADA-defined)?</Label>
                  <Select value={formData.isServiceAnimal} onValueChange={(value) => handleInputChange('isServiceAnimal', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hasVaccinationProof">Do you have documentation and proof of current vaccinations?</Label>
                  <Select value={formData.hasVaccinationProof} onValueChange={(value) => handleInputChange('hasVaccinationProof', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground italic">
                    Internal note: SHE RISES does not accommodate pets at this time. Only verified service animals may be considered.
                  </p>
                </div>
              </>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 5: MEDICAL & INSURANCE</h3>
            <div>
              <Label htmlFor="medicalInsurance">Do you have medical insurance? *</Label>
              <Select value={formData.medicalInsurance} onValueChange={(value) => handleInputChange('medicalInsurance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medi-Cal">Medi-Cal</SelectItem>
                  <SelectItem value="Medicaid">Medicaid</SelectItem>
                  <SelectItem value="Medicare">Medicare</SelectItem>
                  <SelectItem value="Private insurance">Private insurance</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hasMedicalConditions">Do you have any medical conditions that require ongoing care or accommodations?</Label>
              <Select value={formData.hasMedicalConditions} onValueChange={(value) => handleInputChange('hasMedicalConditions', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">YES</SelectItem>
                  <SelectItem value="NO">NO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.hasMedicalConditions === "YES" && (
              <div>
                <Label htmlFor="medicalConditionsDetail">Please explain</Label>
                <Textarea
                  id="medicalConditionsDetail"
                  value={formData.medicalConditionsDetail}
                  onChange={(e) => handleInputChange('medicalConditionsDetail', e.target.value)}
                  placeholder="Please describe your medical conditions..."
                  rows={4}
                />
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 6: INCOME & BENEFITS</h3>
            <div>
              <Label htmlFor="employmentStatus">Are you currently employed? *</Label>
              <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base font-medium">Do you receive any of the following benefits?</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {[
                  "SSI",
                  "SSDI",
                  "EBT / CalFresh",
                  "General Relief",
                  "IHSS",
                  "None"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Checkbox
                      id={benefit}
                      checked={formData.benefits.includes(benefit)}
                      onCheckedChange={(checked) => handleArrayChange('benefits', benefit, checked as boolean)}
                    />
                    <Label htmlFor={benefit} className="text-sm font-normal">{benefit}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="monthlyIncome">Approximate monthly income</Label>
              <Select value={formData.monthlyIncome} onValueChange={(value) => handleInputChange('monthlyIncome', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$0">$0</SelectItem>
                  <SelectItem value="$1–500">$1–500</SelectItem>
                  <SelectItem value="$501–1,000">$501–1,000</SelectItem>
                  <SelectItem value="$1,000+">$1,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base font-medium">How do you expect your stay to be funded? (check all that apply)</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {[
                  "County or agency referral",
                  "Probation / Parole support",
                  "Self-pay",
                  "Family / third-party support",
                  "Unsure at this time"
                ].map((funding) => (
                  <div key={funding} className="flex items-center space-x-2">
                    <Checkbox
                      id={funding}
                      checked={formData.fundingExpectation.includes(funding)}
                      onCheckedChange={(checked) => handleArrayChange('fundingExpectation', funding, checked as boolean)}
                    />
                    <Label htmlFor={funding} className="text-sm font-normal">{funding}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 7: SAFETY & READINESS</h3>
            <div>
              <Label htmlFor="domesticViolence">Are you currently experiencing active domestic violence or immediate safety concerns? *</Label>
              <Select value={formData.domesticViolence} onValueChange={(value) => handleInputChange('domesticViolence', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="substanceUse">Are you currently using substances?</Label>
              <Select value={formData.substanceUse} onValueChange={(value) => handleInputChange('substanceUse', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Prefer not to answer">Prefer not to answer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="willingCaseManagement">Are you willing to participate in case management, goal planning, and house meetings? *</Label>
              <Select value={formData.willingCaseManagement} onValueChange={(value) => handleInputChange('willingCaseManagement', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 8: CASE MANAGEMENT</h3>
            <div>
              <Label htmlFor="hasCaseManager">Do you currently have a case manager or outreach worker? *</Label>
              <Select value={formData.hasCaseManager} onValueChange={(value) => handleInputChange('hasCaseManager', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.hasCaseManager === "Yes" && (
              <div>
                <Label htmlFor="caseManagerInfo">If yes, please list name and agency</Label>
                <Input
                  id="caseManagerInfo"
                  value={formData.caseManagerInfo}
                  onChange={(e) => handleInputChange('caseManagerInfo', e.target.value)}
                  placeholder="Name and agency"
                />
              </div>
            )}
            <div>
              <Label htmlFor="spoken211">Have you spoken with 211 or a homeless outreach worker about housing services?</Label>
              <Select value={formData.spoken211} onValueChange={(value) => handleInputChange('spoken211', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Not sure">Not sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-royal-plum mb-4">SECTION 9: CONSENT</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Thank you for your interest in SHE RISES – Safe Haven for Empowerment.
                This intake helps us determine program eligibility and appropriate referrals.
                Submitting this form does not guarantee placement.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acknowledgment"
                checked={formData.acknowledgment}
                onCheckedChange={(checked) => handleInputChange('acknowledgment', checked as boolean)}
              />
              <Label htmlFor="acknowledgment" className="text-sm font-normal leading-relaxed">
                I understand that submitting this form does not guarantee placement and is used for eligibility screening and referrals. *
              </Label>
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
          <DialogTitle className="flex items-center gap-2 text-royal-plum">
            <FileText className="h-5 w-5 text-crown-gold" />
            SHE RISES – Housing Intake & Eligibility Screening
          </DialogTitle>
        </DialogHeader>

        {/* Honeypot field - hidden from users, should remain empty */}
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

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