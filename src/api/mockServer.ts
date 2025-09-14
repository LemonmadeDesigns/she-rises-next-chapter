/**
 * Mock API Server for Development
 * This simulates backend API responses for donation processing
 * In production, replace with actual backend endpoints
 */

interface MockPaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  status: string;
}

interface MockDonation {
  id: string;
  amount: number;
  frequency: string;
  designation: string;
  donor: any;
  createdAt: Date;
  receiptUrl?: string;
}

class MockAPIServer {
  private donations: MockDonation[] = [];
  private paymentIntents: Map<string, MockPaymentIntent> = new Map();

  /**
   * Simulate creating a Stripe payment intent
   */
  async createPaymentIntent(data: any): Promise<{ clientSecret: string; donationId: string }> {
    // Simulate API delay
    await this.delay(500);

    const donationId = `don_${this.generateId()}`;
    const clientSecret = `pi_${this.generateId()}_secret_${this.generateId()}`;

    const intent: MockPaymentIntent = {
      id: donationId,
      clientSecret,
      amount: data.amount,
      status: 'requires_payment_method',
    };

    this.paymentIntents.set(donationId, intent);

    // Store donation data
    const donation: MockDonation = {
      id: donationId,
      amount: data.amount / 100, // Convert from cents
      frequency: data.frequency,
      designation: data.designation,
      donor: data.donor,
      createdAt: new Date(),
    };

    this.donations.push(donation);

    return {
      clientSecret,
      donationId,
    };
  }

  /**
   * Simulate confirming a payment
   */
  async confirmPayment(donationId: string): Promise<MockDonation> {
    await this.delay(1000);

    const donation = this.donations.find(d => d.id === donationId);
    if (!donation) {
      throw new Error('Donation not found');
    }

    // Generate mock receipt URL
    donation.receiptUrl = `https://receipt.stripe.com/mock/${donationId}`;

    return donation;
  }

  /**
   * Simulate creating a PayPal order
   */
  async createPayPalOrder(data: any): Promise<{ approvalUrl: string }> {
    await this.delay(500);

    // In production, this would create a real PayPal order
    const orderId = `PAYPAL_${this.generateId()}`;

    return {
      approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
    };
  }

  /**
   * Simulate creating a subscription
   */
  async createSubscription(data: any): Promise<{ subscriptionId: string; clientSecret: string }> {
    await this.delay(500);

    const subscriptionId = `sub_${this.generateId()}`;
    const clientSecret = `seti_${this.generateId()}_secret_${this.generateId()}`;

    return {
      subscriptionId,
      clientSecret,
    };
  }

  /**
   * Simulate sending a receipt email
   */
  async sendReceipt(donationId: string, email: string): Promise<void> {
    await this.delay(300);

    console.log(`Mock: Sending receipt for donation ${donationId} to ${email}`);

    // In production, this would send an actual email
  }

  /**
   * Get donation history
   */
  async getDonationHistory(email: string): Promise<MockDonation[]> {
    await this.delay(200);

    return this.donations.filter(d => d.donor.email === email);
  }

  /**
   * Helper to generate random IDs
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Helper to simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create singleton instance
export const mockAPI = new MockAPIServer();

// Mock API interceptor for development
export function setupMockAPI() {
  // Only use mock API in development
  if (import.meta.env.DEV) {
    // Intercept fetch calls to /api/donations
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input.toString();

      // Handle donation API endpoints
      if (url.includes('/api/donations')) {
        const body = init?.body ? JSON.parse(init.body as string) : {};

        try {
          let responseData: any;

          if (url.includes('/create-payment-intent')) {
            responseData = await mockAPI.createPaymentIntent(body);
          } else if (url.includes('/create-paypal-order')) {
            responseData = await mockAPI.createPayPalOrder(body);
          } else if (url.includes('/create-subscription')) {
            responseData = await mockAPI.createSubscription(body);
          } else if (url.includes('/send-receipt')) {
            await mockAPI.sendReceipt(body.donationId, body.email);
            responseData = { success: true };
          } else if (url.includes('/history')) {
            const params = new URLSearchParams(url.split('?')[1]);
            const email = params.get('email') || '';
            responseData = await mockAPI.getDonationHistory(email);
          } else if (url.includes('/confirm')) {
            const donationId = body.donationId;
            responseData = await mockAPI.confirmPayment(donationId);
          }

          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }

      // Pass through all other requests
      return originalFetch(input, init);
    };

    console.log('🔧 Mock API Server enabled for development');
  }
}