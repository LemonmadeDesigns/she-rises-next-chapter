// Edge function: create-order-intent
// Creates a Stripe PaymentIntent for shop orders.
// Recalculates total server-side from product IDs in the database
// (never trusts client-supplied prices). Returns { configured: false }
// cleanly when STRIPE_SECRET_KEY is not set.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CartLine {
  product_id: string;
  quantity: number;
  size?: string;
}

interface OrderPayload {
  items: CartLine[];
  email?: string;
  shipping?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

const TAX_RATE = 0.0875;
const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING = 8.99;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          configured: false,
          message:
            "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Supabase secrets to enable real payments.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = (await req.json()) as OrderPayload;
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cart is empty." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (body.items.length > 100) {
      return new Response(
        JSON.stringify({ error: "Too many items in cart." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Server-side price lookup — never trust the client
    const ids = [...new Set(body.items.map((i) => i.product_id))];
    const { data: products, error: prodErr } = await admin
      .from("products")
      .select("id, name, price, sale_price, in_stock")
      .in("id", ids);

    if (prodErr || !products) {
      console.error("Product lookup failed:", prodErr);
      return new Response(
        JSON.stringify({ error: "Could not load products." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subtotal = 0;
    const lineDescriptions: string[] = [];
    for (const line of body.items) {
      const p = products.find((x) => x.id === line.product_id);
      if (!p) {
        return new Response(
          JSON.stringify({ error: `Unknown product: ${line.product_id}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (p.in_stock === false) {
        return new Response(
          JSON.stringify({ error: `Out of stock: ${p.name}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const qty = Math.max(1, Math.min(99, Math.floor(line.quantity || 1)));
      const unit = Number(p.sale_price ?? p.price);
      if (!Number.isFinite(unit) || unit < 0) {
        return new Response(
          JSON.stringify({ error: `Invalid price for: ${p.name}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      subtotal += unit * qty;
      lineDescriptions.push(`${p.name} x${qty}`);
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    const amountCents = Math.round(total * 100);

    const params = new URLSearchParams();
    params.append("amount", String(amountCents));
    params.append("currency", "usd");
    params.append("automatic_payment_methods[enabled]", "true");
    if (body.email) params.append("receipt_email", body.email);
    params.append("metadata[type]", "shop_order");
    params.append(
      "metadata[items]",
      lineDescriptions.join(", ").substring(0, 480)
    );
    params.append("metadata[subtotal]", subtotal.toFixed(2));
    params.append("metadata[shipping]", shipping.toFixed(2));
    params.append("metadata[tax]", tax.toFixed(2));

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
        orderId: intent.id,
        totals: {
          subtotal: Number(subtotal.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          total: Number(total.toFixed(2)),
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-order-intent error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
