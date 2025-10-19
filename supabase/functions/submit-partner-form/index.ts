import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new entry
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 10 * 60 * 1000, // 10 minutes
    });
    return true;
  }

  if (limit.count >= 3) {
    return false; // Rate limit exceeded
  }

  limit.count++;
  return true;
}

interface PartnerFormData {
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  partnershipTypes: string;
  proposal: string;
  timeline?: string;
  honeypot?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
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

    const formData: PartnerFormData = await req.json();

    // Honeypot check - reject if filled
    if (formData.honeypot && formData.honeypot.length > 0) {
      console.log("Honeypot triggered - possible spam submission");
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid submission" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Server-side validation
    if (!formData.organizationName) {
      throw new Error("Organization name is required");
    }

    if (!formData.contactName || formData.contactName.length < 2) {
      throw new Error("Contact name is required and must be at least 2 characters");
    }

    if (!formData.email || !formData.email.includes("@")) {
      throw new Error("Valid email is required");
    }

    if (!formData.partnershipTypes || formData.partnershipTypes.length === 0) {
      throw new Error("At least one partnership type is required");
    }

    if (!formData.proposal || formData.proposal.length < 20) {
      throw new Error("Proposal must be at least 20 characters");
    }

    if (formData.proposal && formData.proposal.length > 1500) {
      throw new Error("Proposal must be less than 1500 characters");
    }

    const timestamp = new Date().toISOString();

    // Sanitize inputs for HTML output
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

    const safeOrgName = escapeHtml(formData.organizationName);
    const safeContactName = escapeHtml(formData.contactName);
    const safeEmail = escapeHtml(formData.email);
    const safePhone = formData.phone ? escapeHtml(formData.phone) : "Not provided";
    const safeWebsite = formData.website ? escapeHtml(formData.website) : "Not provided";
    const safePartnershipTypes = escapeHtml(formData.partnershipTypes);
    const safeProposal = escapeHtml(formData.proposal).replace(/\n/g, "<br>");
    const safeTimeline = formData.timeline ? escapeHtml(formData.timeline) : "Not specified";

    // Compose email body
    const emailBody = `
New Partner Inquiry

Organization: ${formData.organizationName}
Contact: ${formData.contactName}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Website: ${formData.website || "Not provided"}
Partnership Type(s): ${formData.partnershipTypes}
Proposal/Goals: ${formData.proposal}
Timeline: ${formData.timeline || "Not specified"}
Submitted At: ${timestamp}
Client IP: ${clientIP}
    `.trim();

    const htmlBody = `
      <h2>New Partner Inquiry</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Organization:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeOrgName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Contact:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeContactName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safePhone}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Website:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeWebsite}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Partnership Type(s):</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safePartnershipTypes}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Proposal/Goals:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeProposal}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Timeline:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeTimeline}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted At:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(timestamp)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Client IP:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(clientIP)}</td></tr>
      </table>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Safe Haven <no-reply@safehavenforempowerment.org>",
      to: ["pransom@safehavenforempowerment.org"],
      // Uncomment to add BCC for ops team
      // bcc: ["ops@safehavenforempowerment.org"],
      subject: "New Partner Inquiry — Safe Haven",
      text: emailBody,
      html: htmlBody,
    });

    console.log("Partner form email sent successfully:", emailResponse);

    // Log submission to console
    console.log("Partner form submission:", {
      ...formData,
      timestamp,
      ip: clientIP,
    });

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
    console.error("Error in submit-partner-form function:", error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
