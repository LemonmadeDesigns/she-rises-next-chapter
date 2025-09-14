# Donation Payment Setup Guide

This guide will help you set up the donation functionality for the She Rises website.

## Quick Start

1. **Copy the environment template**
   ```bash
   cp .env.example .env
   ```

2. **Set up your payment processor accounts** (Choose one or both)

## Stripe Setup (Recommended)

1. **Create a Stripe account**
   - Go to [https://stripe.com](https://stripe.com)
   - Sign up for an account
   - Complete the onboarding process

2. **Get your API keys**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your **Publishable key** (starts with `pk_`)
   - Copy your **Secret key** (starts with `sk_`)

3. **Configure environment variables**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

4. **Test mode vs Live mode**
   - Use test keys (contain `_test_`) for development
   - Switch to live keys when ready for production
   - Test cards: https://stripe.com/docs/testing

## PayPal Setup (Optional)

1. **Create a PayPal Developer account**
   - Go to [https://developer.paypal.com](https://developer.paypal.com)
   - Sign up with your PayPal account

2. **Create an app**
   - Go to Dashboard > My Apps & Credentials
   - Click "Create App"
   - Choose "Accept payments" as the app type

3. **Get your credentials**
   - Copy the **Client ID**
   - Copy the **Secret**

4. **Configure environment variables**
   ```env
   VITE_PAYPAL_CLIENT_ID=your_client_id_here
   PAYPAL_SECRET=your_secret_here
   ```

## Email Receipt Setup (Optional)

To send donation receipts via email, you'll need an email service. Here's how to set up SendGrid:

1. **Create a SendGrid account**
   - Go to [https://sendgrid.com](https://sendgrid.com)
   - Sign up for a free account (100 emails/day free)

2. **Get your API key**
   - Go to Settings > API Keys
   - Create a new API key with "Mail Send" permissions

3. **Configure environment**
   ```env
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=donations@sherises.org
   ```

## Backend Setup

The donation system requires a backend server to:
- Create payment intents securely
- Process webhooks from payment providers
- Send receipt emails
- Store donation records

### Option 1: Use the Mock API (Development Only)

The project includes a mock API server that simulates payment processing for development:

```javascript
// Already configured in src/main.tsx
import { setupMockAPI } from "./api/mockServer";
setupMockAPI();
```

This allows you to test the entire donation flow without real payment processing.

### Option 2: Create Your Backend

You'll need to create API endpoints for:

1. **POST /api/donations/create-payment-intent**
   - Creates a Stripe PaymentIntent
   - Returns client secret

2. **POST /api/donations/create-paypal-order**
   - Creates a PayPal order
   - Returns approval URL

3. **POST /api/donations/create-subscription**
   - Creates recurring donation subscription
   - Returns subscription details

4. **POST /api/donations/send-receipt**
   - Sends email receipt to donor

5. **GET /api/donations/history**
   - Returns donation history for a donor

Example backend technologies:
- Node.js + Express
- Python + FastAPI
- Ruby on Rails
- PHP + Laravel

## Testing the Donation Flow

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test with Stripe test cards**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - More test cards: https://stripe.com/docs/testing

3. **Test donation flow**
   - Go to `/donate`
   - Fill in the form
   - Use a test card
   - Verify success page appears
   - Check console for mock API logs

## Production Checklist

Before going live:

- [ ] Replace test API keys with live keys
- [ ] Set up real backend server
- [ ] Configure webhook endpoints
- [ ] Set up SSL certificate (HTTPS required)
- [ ] Test with real payment methods
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure receipt email templates
- [ ] Set up database for donation records
- [ ] Implement backup payment processing
- [ ] Add terms of service and privacy policy
- [ ] Get 501(c)(3) documentation ready
- [ ] Set up recurring donation management
- [ ] Test refund process
- [ ] Configure fraud detection rules

## Security Best Practices

1. **Never expose secret keys**
   - Keep secret keys on backend only
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Use HTTPS in production**
   - Required by payment providers
   - Protects sensitive data

3. **Implement rate limiting**
   - Prevent abuse of donation endpoints

4. **Validate all inputs**
   - Server-side validation is required
   - Client-side validation for UX

5. **Log all transactions**
   - Keep audit trail
   - Monitor for suspicious activity

## Support

- Stripe Support: https://support.stripe.com
- PayPal Support: https://www.paypal.com/us/smarthelp/contact-us
- SendGrid Support: https://support.sendgrid.com

## Next Steps

1. Choose your payment processor(s)
2. Set up accounts and get API keys
3. Configure environment variables
4. Test the donation flow
5. Set up your backend server
6. Deploy to production

For questions about implementation, consult the documentation in:
- `/src/services/donationService.ts` - Core donation logic
- `/src/components/donation/StripePaymentForm.tsx` - Stripe integration
- `/src/pages/Donate.tsx` - Main donation page
- `/src/pages/DonationSuccess.tsx` - Success confirmation page