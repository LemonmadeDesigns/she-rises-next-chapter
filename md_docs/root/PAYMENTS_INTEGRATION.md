# Payments Integration — How It Works

This project's Donate page and Shop checkout are wired through **Stripe**, but
configured to **fail gracefully** when Stripe isn't set up yet. That means:

- ✅ The site builds and runs with no errors today, even without Stripe keys.
- ✅ When you're ready to accept real cards, you only need to add two secrets — no code changes.
- ✅ The "Place Order" / "Donate" buttons show a friendly notice instead of a crash.

---

## Architecture

```
┌──────────────────┐     supabase.functions.invoke      ┌────────────────────────────┐
│  Donate.tsx      │ ─────────────────────────────────▶ │  create-payment-intent     │
│  (Stripe         │                                    │  edge function             │
│   Elements)      │ ◀─────── { clientSecret } ──────── │  → Stripe API              │
└──────────────────┘                                    └────────────────────────────┘

┌──────────────────┐     supabase.functions.invoke      ┌────────────────────────────┐
│  Checkout.tsx    │ ─────────────────────────────────▶ │  create-order-intent       │
│  (Stripe         │  cart items only (no prices!)      │  edge function             │
│   Elements)      │                                    │  • Looks up real prices    │
│                  │ ◀────── { clientSecret, totals } ──│    from products table     │
└──────────────────┘                                    │  • Calls Stripe API        │
                                                        └────────────────────────────┘
```

### Why the server recalculates prices

Frontend code can be tampered with. `create-order-intent` ignores any prices
the browser sends and looks them up from the `products` table using
`SUPABASE_SERVICE_ROLE_KEY`. This prevents a malicious user from paying $1 for
a $25 item.

---

## Files involved

| File | Purpose |
|------|---------|
| `supabase/functions/create-payment-intent/index.ts` | Donations (any amount) |
| `supabase/functions/create-order-intent/index.ts` | Shop orders (server-validated cart) |
| `src/components/donation/StripePaymentForm.tsx` | Stripe Elements card form (shared by Donate + Checkout) |
| `src/services/donationService.ts` | Donate-page client helper |
| `src/pages/Donate.tsx` | Donation flow |
| `src/pages/Checkout.tsx` | Shop checkout flow |

---

## Graceful "not configured" mode

Both edge functions check for `STRIPE_SECRET_KEY` first. If missing, they
return:

```json
{ "configured": false, "message": "Stripe is not configured yet..." }
```

The frontend recognizes this and shows a friendly notice instead of an error.
**Nothing is commented out** — the code is fully built; it just no-ops cleanly.

---

## How to go live (5 steps)

### 1. Create a Stripe account
Sign up free at [stripe.com](https://stripe.com). No business verification
needed to start in test mode.

### 2. Get your two keys
At [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) you'll see:
- **Publishable key** — starts with `pk_test_...` (test) or `pk_live_...` (live)
- **Secret key** — starts with `sk_test_...` or `sk_live_...`

### 3. Add the publishable key to the frontend
Open `.env` and add:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```
(Publishable keys are safe to ship to the browser.)

### 4. Add the secret key to Supabase
In the Lovable chat, ask: **"Add a secret called `STRIPE_SECRET_KEY`"** and
paste the `sk_test_...` value when prompted. The secret becomes available to
the edge functions automatically. **Never** commit the secret key to code.

### 5. Test with Stripe's test card
Reload the site and go to `/donate` or `/checkout`:
- Card number: `4242 4242 4242 4242`
- Any future expiry, any 3-digit CVC, any ZIP

You should see the payment succeed and land on the success page.

When ready for real charges, swap both keys for their `pk_live_...` /
`sk_live_...` counterparts.

---

## Optional next steps

- **Email receipts** — Already works automatically. The edge functions pass
  the donor's email to Stripe, which sends a branded receipt for you.
- **Webhooks** — If you want order records saved in your database after
  payment, add a `stripe-webhook` edge function and configure
  [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) to
  POST to it. Listen for `payment_intent.succeeded`.
- **Recurring donations** — `setupRecurringDonation` in
  `donationService.ts` is currently a stub. To enable, build a
  `create-subscription` edge function that creates a Stripe Customer + Price +
  Subscription.
- **PayPal** — `processPayPalDonation` is a stub. Add a PayPal SDK
  integration if needed.

---

## Security notes

- ✅ `STRIPE_SECRET_KEY` lives only in Supabase secrets, never in code or `.env`.
- ✅ Cart prices are recalculated server-side from the `products` table.
- ✅ Donation amount is bounded ($1 – $999,999) on the server.
- ✅ Stripe Elements means card details never touch our servers — they go
  straight from the browser to Stripe over PCI-compliant infrastructure.
- ✅ All edge function errors return generic messages; full error detail is
  logged server-side only.

---

## Troubleshooting

**"Online card donations aren't enabled yet"**
→ `STRIPE_SECRET_KEY` is missing. Add it via the Lovable secrets tool.

**"Payment system not configured" in the card form**
→ `VITE_STRIPE_PUBLISHABLE_KEY` is missing in `.env`. Add it and rebuild.

**Stripe returns "Invalid API Key"**
→ The secret key was pasted incorrectly. Re-add the secret. Make sure you're
using the secret key (`sk_...`), not the publishable key (`pk_...`).
