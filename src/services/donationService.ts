import { loadStripe } from '@stripe/stripe-js';

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
}

// Initialize Stripe - Replace with your actual publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

class DonationService {
  /**
   * Process a donation using Stripe
   */
  async processDonation(donationData: DonationData): Promise<DonationResponse> {
    try {
      // Validate donation amount
      const amount = parseFloat(donationData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid donation amount');
      }

      // Create payment intent on the backend
      const response = await fetch('/api/donations/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          frequency: donationData.frequency,
          designation: donationData.designation,
          donor: {
            firstName: donationData.firstName,
            lastName: donationData.lastName,
            email: donationData.email,
            phone: donationData.phone,
            address: donationData.address,
            city: donationData.city,
            state: donationData.state,
            zip: donationData.zip,
            anonymous: donationData.anonymous,
            newsletter: donationData.newsletter,
          },
          tribute: donationData.tribute ? {
            honoree: donationData.tribute,
            message: donationData.tributeMessage,
            notifyEmail: donationData.tributeNotify,
          } : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment intent');
      }

      const { clientSecret, donationId } = await response.json();

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // For PayPal, redirect to PayPal checkout
      if (donationData.paymentMethod === 'paypal') {
        return this.processPayPalDonation(donationData, donationId);
      }

      // For credit card, use Stripe Elements (this would be handled in the component)
      // Return the client secret for the component to complete the payment
      return {
        success: true,
        donationId,
        clientSecret,
      } as any;

    } catch (error) {
      console.error('Donation processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Process a PayPal donation
   */
  private async processPayPalDonation(donationData: DonationData, donationId: string): Promise<DonationResponse> {
    try {
      const response = await fetch('/api/donations/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId,
          amount: donationData.amount,
          frequency: donationData.frequency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const { approvalUrl } = await response.json();

      // Redirect to PayPal for payment approval
      window.location.href = approvalUrl;

      return {
        success: true,
        donationId,
      };
    } catch (error) {
      console.error('PayPal donation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal payment failed',
      };
    }
  }

  /**
   * Confirm a Stripe payment after user completes the payment form
   */
  async confirmStripePayment(
    clientSecret: string,
    paymentElement: any
  ): Promise<DonationResponse> {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements: paymentElement,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/donation-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        return {
          success: true,
          donationId: paymentIntent.id,
          receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
        };
      }

      return {
        success: false,
        error: 'Payment was not completed',
      };
    } catch (error) {
      console.error('Payment confirmation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed',
      };
    }
  }

  /**
   * Set up recurring donation subscription
   */
  async setupRecurringDonation(donationData: DonationData): Promise<DonationResponse> {
    try {
      const response = await fetch('/api/donations/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(donationData.amount) * 100),
          currency: 'usd',
          interval: 'month',
          designation: donationData.designation,
          donor: {
            firstName: donationData.firstName,
            lastName: donationData.lastName,
            email: donationData.email,
            phone: donationData.phone,
            anonymous: donationData.anonymous,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { subscriptionId, clientSecret } = await response.json();

      return {
        success: true,
        donationId: subscriptionId,
        clientSecret,
      } as any;
    } catch (error) {
      console.error('Recurring donation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to set up recurring donation',
      };
    }
  }

  /**
   * Send donation receipt via email
   */
  async sendReceipt(donationId: string, email: string): Promise<void> {
    try {
      await fetch('/api/donations/send-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId,
          email,
        }),
      });
    } catch (error) {
      console.error('Failed to send receipt:', error);
    }
  }

  /**
   * Get donation history for a donor
   */
  async getDonationHistory(email: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/donations/history?email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch donation history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get donation history:', error);
      return [];
    }
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