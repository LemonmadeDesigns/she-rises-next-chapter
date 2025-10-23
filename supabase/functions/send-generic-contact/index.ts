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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GenericContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
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

    const { name, email, phone, message }: GenericContactRequest = JSON.parse(await req.text());

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = phone ? escapeHtml(phone.trim()) : '';
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>');

    const orgEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "She Rises Contact <onboarding@resend.dev>",
        to: ["pransom@safehavenforempowerment.org"],
        subject: `New Contact Submission from ${safeName}`,
        html: `
          <h2>New Contact Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
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
    console.error("Error in send-generic-contact function:", error);
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
