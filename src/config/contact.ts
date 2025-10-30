/**
 * Contact Form Configuration
 *
 * Centralized configuration for the Google Apps Script contact form endpoint.
 * Update the GAS_ENDPOINT constant here to change it across all forms.
 */

// Google Apps Script Web App URL
// This endpoint handles all contact form submissions and sends emails to the admin
export const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycby-6KQ3eQKcbr2-f3fX9TBX8ggDduBvcjfr6teL9hB-BHHHDkIq_9gWjelzodTfUemw/exec';

/**
 * Submits form data to the Google Apps Script endpoint
 *
 * @param name - Submitter's full name
 * @param email - Submitter's email address
 * @param subject - Email subject line
 * @param message - Message content
 * @param company - Honeypot field (should be empty for legitimate submissions)
 * @param phone - Phone number (optional)
 * @param formType - Type of form being submitted (e.g., "Contact", "Partnership", "Volunteer")
 * @returns Promise with response data
 */
export async function submitContactForm(
  name: string,
  email: string,
  subject: string,
  message: string,
  company: string = '',
  phone: string = '',
  formType: string = 'Contact'
): Promise<{ ok: boolean; error?: string }> {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('subject', subject);
  formData.append('message', message);
  formData.append('company', company);
  formData.append('phone', phone);
  formData.append('formType', formType);

  const response = await fetch(GAS_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return result;
}
