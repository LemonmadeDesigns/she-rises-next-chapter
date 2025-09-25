import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

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
  console.log('Edge function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    const { name, email, phone, reason, category, message }: ContactEmailRequest = JSON.parse(requestBody);
    console.log('Parsed form data:', { name, email, phone, reason, category, message });
    
    // Use either reason or category field
    const contactReason = reason || category || 'Not specified';

    // Validate required fields
    console.log('Validating fields...');
    if (!name || !email || !message) {
      console.error('Validation failed - missing required fields:', { name: !!name, email: !!email, message: !!message });
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('Sending organization email...');
    // Send email to organization
    const orgEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "She Rises Contact Form <onboarding@resend.dev>",
        to: ["pransom@safehavenforempowerment.org"],
        subject: `New Contact Form Submission: ${contactReason}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Reason for Contact:</strong> ${contactReason}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This email was sent from the She Rises contact form at ${new Date().toLocaleString()}
          </p>
        `,
      })
    });

    console.log('Organization email response status:', orgEmailResponse.status);
    const orgEmailResult = await orgEmailResponse.json();
    console.log('Organization email result:', orgEmailResult);

    console.log('Sending user confirmation email...');
    // Send confirmation email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: "She Rises <onboarding@resend.dev>",
        to: [email],
        subject: "Thank you for contacting She Rises",
        html: `
          <h2>Thank you for reaching out, ${name}!</h2>
          <p>We have received your message and will get back to you within 24-48 hours.</p>
          <p>Your message:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
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

    console.log('User email response status:', userEmailResponse.status);
    const userEmailResult = await userEmailResponse.json();
    console.log('User email result:', userEmailResult);

    console.log("Both emails sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);