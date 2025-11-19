/**
 * Contact Form Configuration
 *
 * Centralized configuration for the contact form endpoint.
 * All front-end forms should use the Supabase Edge Function
 * instead of the legacy Google Apps Script.
 */

// Public URL of the Supabase Edge Function that handles contact emails
export const CONTACT_FUNCTION_URL =
  'https://ktaleplbvgicjugcwthj.functions.supabase.co/send-contact-email';

export interface SubmitContactResult {
  ok: boolean;
  error?: string;
}

/**
 * Submits form data to the Supabase `send-contact-email` edge function.
 * Keeps the existing function signature so all callers continue to work.
 */
export async function submitContactForm(
  name: string,
  email: string,
  subject: string,
  message: string,
  company: string = '', // honeypot (ignored server-side for now)
  phone: string = '',
  formType: string = 'Contact'
): Promise<SubmitContactResult> {
  const response = await fetch(CONTACT_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      reason: subject,
      category: formType,
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok || data?.error) {
    return { ok: false, error: data?.error || 'Failed to submit contact form' };
  }

  // Edge function currently returns `{ success: true }` on success
  return { ok: Boolean(data?.success ?? true) };
}

