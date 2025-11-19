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

interface VolunteerFormData {
  fullName: string;
  email: string;
  phone?: string;
  cityState?: string;
  interests: string;
  availability: string;
  skills?: string;
  referral?: string;
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

    const formData: VolunteerFormData = await req.json();

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
    if (!formData.fullName || formData.fullName.length < 2) {
      throw new Error("Full name is required and must be at least 2 characters");
    }

    if (!formData.email || !formData.email.includes("@")) {
      throw new Error("Valid email is required");
    }

    if (!formData.interests || formData.interests.length === 0) {
      throw new Error("At least one area of interest is required");
    }

    if (!formData.availability) {
      throw new Error("Availability is required");
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

    const safeName = escapeHtml(formData.fullName);
    const safeEmail = escapeHtml(formData.email);
    const safePhone = formData.phone ? escapeHtml(formData.phone) : "Not provided";
    const safeLocation = formData.cityState ? escapeHtml(formData.cityState) : "Not provided";
    const safeInterests = escapeHtml(formData.interests);
    const safeAvailability = escapeHtml(formData.availability);
    const safeSkills = formData.skills ? escapeHtml(formData.skills) : "Not provided";
    const safeReferral = formData.referral ? escapeHtml(formData.referral) : "Not provided";

    // Compose email body
    const emailBody = `
New Volunteer Signup

Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Location: ${formData.cityState || "Not provided"}
Interests: ${formData.interests}
Availability: ${formData.availability}
Skills/Experience: ${formData.skills || "Not provided"}
Referral Source: ${formData.referral || "Not provided"}
Submitted At: ${timestamp}
Client IP: ${clientIP}
    `.trim();

    const htmlBody = `
      <h2>New Volunteer Signup</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safePhone}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Location:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeLocation}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Interests:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeInterests}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Availability:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeAvailability}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Skills/Experience:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeSkills}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Referral Source:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeReferral}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted At:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(timestamp)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Client IP:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(clientIP)}</td></tr>
      </table>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Safe Haven <no-reply@safehavenforempowerment.org>",
      to: ["empowerhavenhomes@gmail.com"],
      // Uncomment to add BCC for ops team
      // bcc: ["ops@safehavenforempowerment.org"],
      subject: "New Volunteer Signup — Safe Haven",
      text: emailBody,
      html: htmlBody,
    });

    console.log("Volunteer form email sent successfully:", emailResponse);

    // Log submission to console
    console.log("Volunteer form submission:", {
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
    console.error("Error in submit-volunteer-form function:", error);
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
