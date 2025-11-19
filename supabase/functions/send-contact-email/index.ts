import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  reason?: string;
  category?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, reason, category, message }: ContactEmailRequest = JSON.parse(await req.text());
    
    // Use either reason or category field
    const contactReason = reason || category || 'Not specified';

    // Comprehensive validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate field lengths
    if (name.length < 2 || name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be between 2 and 100 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (email.length > 255 || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (message.length < 10 || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message must be between 10 and 2000 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (phone && (phone.length > 20 || !validatePhone(phone))) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid phone number" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs for HTML output
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = phone ? escapeHtml(phone.trim()) : '';
    const safeReason = escapeHtml(contactReason);
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>');

    // Send email to organization
    const orgEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "She Rises <empowerhavenhomes@gmail.com>",
        to: ["empowerhavenhomes@gmail.com"],
        subject: `New Contact Form Submission: ${safeReason}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
          <p><strong>Reason for Contact:</strong> ${safeReason}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${safeMessage}
          </div>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This email was sent from the She Rises contact form at ${new Date().toLocaleString()}
          </p>
        `,
      })
    });

    if (!orgEmailResponse.ok) {
      throw new Error('Failed to send organization email');
    }

    // Send confirmation email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "She Rises <empowerhavenhomes@gmail.com>",
        to: [email],
        subject: "Thank you for contacting She Rises",
        html: `
          <h2>Thank you for reaching out, ${safeName}!</h2>
          <p>We have received your message and will get back to you within 24-48 hours.</p>
          <p>Your message:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${safeMessage}
          </div>
          <p>If you need immediate assistance, please call us at <strong>(909) 547-9998</strong>.</p>
          <p>Best regards,<br>The She Rises Team</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Safe Haven for Empowerment - Every woman has a story... here we help you write the next chapter
          </p>
        `,
      })
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);