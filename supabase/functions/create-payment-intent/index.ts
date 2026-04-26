// Edge function: create-payment-intent
// Creates a Stripe PaymentIntent for one-time donations.
// Returns { configured: false } cleanly when STRIPE_SECRET_KEY is not set,
// so the frontend can show a friendly "coming soon" message instead of erroring.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DonationPayload {
  amount: number; // in cents
  currency?: string;
  designation?: string;
  donor?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    anonymous?: boolean;
  };
}

function isValidAmount(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 100 && n <= 99999900;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

    // Graceful no-op if Stripe is not yet configured
    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          configured: false,
          message:
            "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Supabase secrets to enable real payments.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = (await req.json()) as DonationPayload;

    if (!isValidAmount(body.amount)) {
      return new Response(
        JSON.stringify({ error: "Invalid amount. Must be between $1 and $999,999." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currency = (body.currency || "usd").toLowerCase();

    // Build form-encoded body for Stripe
    const params = new URLSearchParams();
    params.append("amount", String(Math.round(body.amount)));
    params.append("currency", currency);
    params.append("automatic_payment_methods[enabled]", "true");
    if (body.donor?.email) params.append("receipt_email", body.donor.email);
    if (body.designation) params.append("metadata[designation]", body.designation);
    if (body.donor?.firstName)
      params.append("metadata[first_name]", body.donor.firstName);
    if (body.donor?.lastName)
      params.append("metadata[last_name]", body.donor.lastName);
    params.append("metadata[type]", "donation");

    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const intent = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error("Stripe error:", intent);
      return new Response(
        JSON.stringify({ error: "Failed to create payment intent." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        configured: true,
        clientSecret: intent.client_secret,
        donationId: intent.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-payment-intent error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
