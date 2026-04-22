import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
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
  return typeof email === 'string' && email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone: string): boolean {
  return typeof phone === 'string' && phone.length <= 20 && /^[\d\s\-\+\(\)]+$/.test(phone);
}
function validateLength(s: string, min: number, max: number): boolean {
  return typeof s === 'string' && s.length >= min && s.length <= max;
}
function validateDate(s: string): boolean {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VisitRequest {
  name: string;
  email: string;
  phone?: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { name, email, phone, preferred_date, preferred_time, message }: VisitRequest = JSON.parse(await req.text());

    if (!name || !email || !preferred_date || !preferred_time) {
      return new Response(
        JSON.stringify({ error: "Name, email, preferred date, and preferred time are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateLength(name.trim(), 2, 100)) {
      return new Response(JSON.stringify({ error: "Name must be 2-100 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (!validateEmail(email.trim())) {
      return new Response(JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (phone && !validatePhone(phone.trim())) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (!validateDate(preferred_date)) {
      return new Response(JSON.stringify({ error: "Invalid preferred date format (YYYY-MM-DD)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (!validateLength(preferred_time, 1, 50)) {
      return new Response(JSON.stringify({ error: "Invalid preferred time" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (message && message.length > 2000) {
      return new Response(JSON.stringify({ error: "Message must be under 2000 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = phone ? escapeHtml(phone.trim()) : 'Not provided';
    const safeDate = escapeHtml(preferred_date);
    const safeTime = escapeHtml(preferred_time);
    const safeMessage = message ? escapeHtml(message.trim()).replace(/\n/g, '<br>') : 'No additional message';

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "She Rises Visit Requests <onboarding@resend.dev>",
        to: ["empowerhavenhomes@gmail.com"],
        subject: `New Visit Request — ${safeName} on ${safeDate}`,
        html: `
          <h2>New Visit Request</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safePhone}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Preferred Date:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeDate}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Preferred Time:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeTime}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${safeMessage}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted At:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td></tr>
          </table>
        `,
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in submit-visit-request function:", error);
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
