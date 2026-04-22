# She Rises - Safe Haven for Empowerment 🌸

A modern, fully-featured website for She Rises nonprofit organization, empowering women to rebuild their lives with dignity and hope. Built with React, TypeScript, and Tailwind CSS.

![She Rises Logo](src/assets/she-rises-logo-transparent.png)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env (see Payment Setup below)

# Start development server
npm run dev

# Build for production
npm run build
```

## 💳 Payment Setup - Connect in 5 Minutes!

### Step 1: Choose Your Payment Processor

#### Option A: Stripe (Recommended)
1. **Sign up** at [stripe.com](https://stripe.com)
2. **Get your keys** from [Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
3. **Add to `.env`:**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here  # Keep this on backend only!
   ```

#### Option B: PayPal
1. **Sign up** at [developer.paypal.com](https://developer.paypal.com)
2. **Create an app** in Dashboard > My Apps
3. **Add to `.env`:**
   ```env
   VITE_PAYPAL_CLIENT_ID=your_client_id_here
   PAYPAL_SECRET=your_secret_here  # Keep this on backend only!
   ```

### Step 2: Connect Your Backend

The frontend is ready to connect to ANY backend. Just implement these endpoints:

#### Required API Endpoints

```javascript
// 1. Create Payment Intent (Stripe)
POST /api/donations/create-payment-intent
Body: {
  amount: 5000,  // in cents
  currency: "usd",
  donor: { firstName, lastName, email }
}
Response: { clientSecret: "pi_xxx_secret_xxx", donationId: "don_xxx" }

// 2. Create PayPal Order (PayPal)
POST /api/donations/create-paypal-order
Body: { amount: "50.00", donationId: "don_xxx" }
Response: { approvalUrl: "https://paypal.com/checkout/xxx" }

// 3. Send Receipt Email
POST /api/donations/send-receipt
Body: { donationId: "don_xxx", email: "donor@email.com" }
Response: { success: true }
```

### Step 3: Backend Examples

<details>
<summary><b>Node.js + Express Backend</b></summary>

```javascript
// server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// Create Stripe Payment Intent
app.post('/api/donations/create-payment-intent', async (req, res) => {
  try {
    const { amount, donor } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        donor_name: `${donor.firstName} ${donor.lastName}`,
        donor_email: donor.email
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      donationId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001);
```
</details>

<details>
<summary><b>Python + FastAPI Backend</b></summary>

```python
# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/donations/create-payment-intent")
async def create_payment_intent(amount: int, donor: dict):
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            metadata={
                "donor_name": f"{donor['firstName']} {donor['lastName']}",
                "donor_email": donor["email"]
            }
        )

        return {
            "clientSecret": intent.client_secret,
            "donationId": intent.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```
</details>

<details>
<summary><b>PHP + Laravel Backend</b></summary>

```php
// routes/api.php
Route::post('/donations/create-payment-intent', function (Request $request) {
    $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));

    try {
        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => $request->input('amount'),
            'currency' => 'usd',
            'metadata' => [
                'donor_name' => $request->input('donor.firstName') . ' ' .
                                $request->input('donor.lastName'),
                'donor_email' => $request->input('donor.email')
            ]
        ]);

        return response()->json([
            'clientSecret' => $paymentIntent->client_secret,
            'donationId' => $paymentIntent->id
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
```
</details>

### Step 4: Test Your Integration

```bash
# Start your backend server
npm run backend  # or python main.py, php artisan serve, etc.

# Start the frontend
npm run dev

# Visit http://localhost:5173/donate
# Use test card: 4242 4242 4242 4242
```

## 🎨 Features

### Donation System
- ✅ **One-time & Recurring Donations** - Monthly giving options
- ✅ **Multiple Payment Methods** - Credit/Debit cards via Stripe, PayPal
- ✅ **Designation Options** - Direct funds to specific programs
- ✅ **Tribute Donations** - Honor/memorial gifts with notifications
- ✅ **Tax Receipts** - Automatic receipt generation and email
- ✅ **Donation History** - Track giving history
- ✅ **Anonymous Options** - Privacy-respecting donations
- ✅ **Real-time Validation** - Secure form validation

### E-Commerce
- 🛍️ Shopping cart functionality
- 📦 Product catalog with categories
- 💰 Secure checkout process
- 📧 Order confirmation emails

### Content Management
- 📅 Events calendar and registration
- 📝 Program information and applications
- 👥 Volunteer management
- 📰 Newsletter subscription

### User Experience
- 📱 Fully responsive design
- ♿ Accessibility compliant
- 🎨 Beautiful animations
- 🚀 Fast page loads
- 🔍 SEO optimized

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn/ui
- **Payments:** Stripe, PayPal
- **State:** React Context, TanStack Query
- **Routing:** React Router v6
- **Forms:** React Hook Form, Zod validation
- **Icons:** Lucide React

## 📁 Project Structure

```
she-rises-next-chapter/
├── src/
│   ├── components/
│   │   ├── donation/        # Payment components
│   │   ├── layout/          # Header, Footer, etc.
│   │   ├── sections/        # Page sections
│   │   └── ui/              # Reusable UI components
│   ├── pages/               # Route pages
│   ├── services/            # API services
│   │   └── donationService.ts  # Payment processing
│   ├── api/
│   │   └── mockServer.ts    # Development mock API
│   └── assets/              # Images, logos
├── .env.example             # Environment template
├── PAYMENT_SETUP.md         # Detailed payment guide
└── README.md                # This file
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Payment Processing
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_PAYPAL_CLIENT_ID=xxx

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Organization Details
VITE_ORG_NAME="She Rises - Safe Haven for Empowerment"
VITE_ORG_EIN="XX-XXXXXXX"
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Set environment variables in Netlify dashboard
```

### Traditional Hosting
```bash
# Build the project
npm run build

# Upload contents of 'dist' folder to your server
# Configure your server to serve index.html for all routes
```

## 🔒 Security

- **PCI Compliant** - No card data touches your servers
- **SSL Required** - HTTPS enforced in production
- **Input Validation** - Client and server-side validation
- **Rate Limiting** - Implement on your backend
- **Secure Tokens** - Never expose secret keys

## 📊 Analytics & Tracking

The system is ready for:
- Google Analytics 4
- Facebook Pixel
- Google Tag Manager
- Custom event tracking

## 🧪 Testing

### Test Cards (Stripe)
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

### Development Mode
The project includes a mock API server for development:
- Simulates payment processing
- No real charges
- Perfect for testing

## 📝 License

This project is proprietary software for She Rises - Safe Haven for Empowerment.

## 🤝 Support

For technical questions or issues:
- Create an issue in this repository
- Contact the development team

For donation or payment issues:
- Stripe Support: support.stripe.com
- PayPal Support: paypal.com/support

## 🙏 Acknowledgments

Built with love for She Rises and the women they serve. Together, we rise! 🌸

---

**Ready to make a difference?** Visit [/donate](http://localhost:5173/donate) to test the donation system!