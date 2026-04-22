import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function isString(v: unknown, max = 2000): v is string {
  return typeof v === "string" && v.length <= max;
}
function isEmail(v: unknown): v is string {
  return typeof v === "string" && v.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isPhone(v: unknown): v is string {
  return typeof v === "string" && v.length <= 20 && /^[\d\s\-\+\(\)]+$/.test(v);
}
function isDate(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 10 * 60 * 1000,
    });
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "Rate limit exceeded. Please try again in 10 minutes." 
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const formData = await req.json();
    const timestamp = new Date().toISOString();

    // Comprehensive input validation
    const errors: string[] = [];
    if (!isString(formData?.firstName, 100) || formData.firstName.trim().length < 1) errors.push("firstName invalid");
    if (!isString(formData?.lastName, 100) || formData.lastName.trim().length < 1) errors.push("lastName invalid");
    if (!isEmail(formData?.email)) errors.push("email invalid");
    if (!isPhone(formData?.phone)) errors.push("phone invalid");
    if (formData?.dateOfBirth && !isDate(formData.dateOfBirth)) errors.push("dateOfBirth invalid");
    if (formData?.expectedReleaseDate && !isDate(formData.expectedReleaseDate)) errors.push("expectedReleaseDate invalid");
    if (formData?.paroleOfficerEmail && !isEmail(formData.paroleOfficerEmail)) errors.push("paroleOfficerEmail invalid");
    if (formData?.paroleOfficerPhone && !isPhone(formData.paroleOfficerPhone)) errors.push("paroleOfficerPhone invalid");
    if (formData?.emergencyPhone && !isPhone(formData.emergencyPhone)) errors.push("emergencyPhone invalid");

    // Cap free-text fields
    const longTextFields = [
      "address","city","state","zipCode","emergencyName","emergencyRelation",
      "referralSource","paroleOfficerName","caseNumber","justiceInvolved","gender",
      "countryOfOrigin","languageNeeds","fundingSource","immediateHousing","children",
      "childrenCount","childrenAges","pastHousingSituation","currentSituation",
      "housingSituation","employment","education","physicalHealthNeeds","mentalHealthNeeds",
      "substanceRecovery","employmentJobReadiness","educationTraining","familyReunification",
      "legalAidRecovery","transportationAssistance","otherGoals","goals","previousServices","medicalNeeds"
    ];
    for (const f of longTextFields) {
      const v = formData?.[f];
      if (v != null && !isString(v, 5000)) errors.push(`${f} invalid`);
    }
    if (formData?.programsInterested && !Array.isArray(formData.programsInterested)) {
      errors.push("programsInterested invalid");
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid input" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }


    const escapeHtml = (text: string): string => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    const htmlBody = `
      <h2>New Program Application</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>PERSONAL INFORMATION</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.firstName + ' ' + formData.lastName)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.email)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.phone)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Date of Birth:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.dateOfBirth)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Age:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.age)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.address + ', ' + formData.city + ', ' + formData.state + ' ' + formData.zipCode)}</td></tr>
        
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>EMERGENCY CONTACT</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.emergencyName)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Relation:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.emergencyRelation)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.emergencyPhone)}</td></tr>
        
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>REFERRAL INFORMATION</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Referral Source:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.referralSource || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Parole Officer:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.paroleOfficerName || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Officer Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.paroleOfficerPhone || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Officer Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.paroleOfficerEmail || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Case Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.caseNumber || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Expected Release Date:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.expectedReleaseDate || 'Not provided')}</td></tr>
        
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>ELIGIBILITY & DEMOGRAPHICS</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Justice Involved:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.justiceInvolved || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Gender:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.gender || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Country of Origin:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.countryOfOrigin || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Language Needs:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.languageNeeds || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Funding Source:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.fundingSource || 'Not provided')}</td></tr>
        
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>HOUSING NEEDS</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Immediate Housing Needed:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.immediateHousing || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Children:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.children || 'Not provided')}</td></tr>
        ${formData.children === 'yes' ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Number of Children:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.childrenCount)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Children's Ages:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.childrenAges)}</td></tr>` : ''}
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Past Housing Situation:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.pastHousingSituation || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>BACKGROUND</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Current Situation:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.currentSituation || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Housing Situation:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.housingSituation || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Employment:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.employment || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Education:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.education || 'Not provided')}</td></tr>
        
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>HEALTH & SUPPORT</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Physical Health Needs:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.physicalHealthNeeds || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Mental Health Needs:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.mentalHealthNeeds || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Substance Recovery:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.substanceRecovery || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>GOALS & SERVICES</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Employment/Job Readiness:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.employmentJobReadiness || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Education/Training:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.educationTraining || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Family Reunification:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.familyReunification || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Legal Aid/ID Recovery:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.legalAidRecovery || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Transportation Assistance:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.transportationAssistance || 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Other Goals:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.otherGoals || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Programs Interested In:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${(formData.programsInterested || []).map((p: string) => escapeHtml(String(p))).join(', ')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Main Goals:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.goals || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Previous Services:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.previousServices || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Medical/Accessibility Needs:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formData.medicalNeeds || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
        
        <tr style="background-color: #f5f5f5;"><td colspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>SUBMISSION INFO</strong></td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted At:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(timestamp)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Client IP:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(clientIP)}</td></tr>
      </table>
    `;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "She Rises Program Applications <onboarding@resend.dev>",
        to: ["pransom@safehavenforempowerment.org"],
        subject: `New Program Application — ${escapeHtml(formData.firstName)} ${escapeHtml(formData.lastName)}`,
        html: htmlBody,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    console.log("Program application email sent successfully");

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-program-application function:", error);
    return new Response(
      JSON.stringify({ ok: false, error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
