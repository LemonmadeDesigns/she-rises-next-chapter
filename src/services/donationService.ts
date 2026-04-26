import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';

export interface DonationData {
  amount: string;
  frequency: 'one-time' | 'monthly';
  designation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  paymentMethod: 'credit' | 'paypal';
  anonymous: boolean;
  newsletter: boolean;
  tribute?: string;
  tributeMessage?: string;
  tributeNotify?: string;
}

export interface DonationResponse {
  success: boolean;
  donationId?: string;
  receiptUrl?: string;
  error?: string;
  clientSecret?: string;
  /** True when the backend reports Stripe is not yet configured. */
  notConfigured?: boolean;
}

// Initialize Stripe — falls back to a placeholder so the app never crashes
// when VITE_STRIPE_PUBLISHABLE_KEY is missing. Real charges require both
// the publishable key here AND STRIPE_SECRET_KEY in the edge function.
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK) : Promise.resolve(null);

class DonationService {
  /**
   * Process a donation — calls the create-payment-intent edge function.
   * If Stripe is not configured server-side, returns notConfigured: true.
   */
  async processDonation(donationData: DonationData): Promise<DonationResponse> {
    try {
      const amount = parseFloat(donationData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid donation amount');
      }

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: Math.round(amount * 100),
          currency: 'usd',
          frequency: donationData.frequency,
          designation: donationData.designation,
          donor: {
            firstName: donationData.firstName,
            lastName: donationData.lastName,
            email: donationData.email,
            phone: donationData.phone,
            anonymous: donationData.anonymous,
          },
        },
      });

      if (error) throw new Error(error.message || 'Failed to reach payment service');

      if (data?.configured === false) {
        return {
          success: false,
          notConfigured: true,
          error:
            "Online card donations aren't enabled yet. Please check back soon — or contact us directly to give.",
        };
      }

      if (!data?.clientSecret) {
        return { success: false, error: 'Payment service did not return a client secret.' };
      }

      return {
        success: true,
        donationId: data.donationId,
        clientSecret: data.clientSecret,
      };
    } catch (error) {
      console.error('Donation processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * PayPal flow — not yet implemented. Returns notConfigured so callers
   * can show a friendly message instead of erroring.
   */
  private async processPayPalDonation(_donationData: DonationData, donationId: string): Promise<DonationResponse> {
    return {
      success: false,
      notConfigured: true,
      donationId,
      error: 'PayPal donations are not enabled yet.',
    };
  }

  /**
   * Confirm a Stripe payment after user completes the payment form.
   */
  async confirmStripePayment(
    clientSecret: string,
    paymentElement: any
  ): Promise<DonationResponse> {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        return { success: false, notConfigured: true, error: 'Stripe is not configured.' };
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements: paymentElement,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/donation-success`,
        },
        redirect: 'if_required',
      });

      if (error) throw new Error(error.message);

      if (paymentIntent?.status === 'succeeded') {
        return { success: true, donationId: paymentIntent.id };
      }
      return { success: false, error: 'Payment was not completed' };
    } catch (error) {
      console.error('Payment confirmation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed',
      };
    }
  }

  /**
   * Recurring donations — backend not implemented yet. Returns notConfigured.
   */
  async setupRecurringDonation(_donationData: DonationData): Promise<DonationResponse> {
    return {
      success: false,
      notConfigured: true,
      error: 'Recurring donations are not enabled yet.',
    };
  }

  /**
   * Send donation receipt via email — no-op until a receipt edge function exists.
   */
  async sendReceipt(_donationId: string, _email: string): Promise<void> {
    // Stripe sends its own receipts when receipt_email is set on the PaymentIntent.
    return;
  }

  /**
   * Donation history — not implemented yet.
   */
  async getDonationHistory(_email: string): Promise<any[]> {
    return [];
  }

  /**
   * Validate donation form data
   */
  validateDonationForm(data: DonationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate amount
    const amount = parseFloat(data.amount);
    if (!data.amount || isNaN(amount) || amount <= 0) {
      errors.push('Please enter a valid donation amount');
    }
    if (amount < 1) {
      errors.push('Minimum donation amount is $1');
    }
    if (amount > 999999) {
      errors.push('Maximum online donation amount is $999,999');
    }

    // Validate required fields
    if (!data.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!data.lastName?.trim()) {
      errors.push('Last name is required');
    }
    if (!data.email?.trim()) {
      errors.push('Email address is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone if provided
    if (data.phone) {
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      if (!phoneRegex.test(data.phone)) {
        errors.push('Please enter a valid phone number');
      }
    }

    // Validate ZIP code if provided
    if (data.zip) {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(data.zip)) {
        errors.push('Please enter a valid ZIP code');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate tax deduction estimate
   */
  calculateTaxDeduction(amount: number): number {
    // This is a simplified calculation - actual tax benefits depend on individual circumstances
    // Assuming standard 24% tax bracket for demonstration
    return amount * 0.24;
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}

export const donationService = new DonationService();