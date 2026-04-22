/**
 * Contact Form Configuration
 *
 * Centralized configuration for the Google Apps Script contact form endpoints.
 * Update the endpoint constants here to change them across all forms.
 */

import { supabase } from '@/integrations/supabase/client';

// Google Apps Script Web App URL for general contact forms
// This endpoint handles all contact form submissions and sends emails to the admin
export const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxOC293r6OwGBHcOz4lL1pNWiYwQJ2fs1oxLbpLq7mS9czNHtGCN7aWz70r1WicTrSo/exec';

// Google Apps Script Web App URL for Housing Intake forms
// TODO: After deploying the intake form Google Apps Script, replace this URL with your deployment URL
export const INTAKE_GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwsIWJK3XiJK5F-i3XuGpi3RfcXs9oKf5sAZOAE4g563WG4xjyqDwyVlmyVlXNid4E_lQ/exec';

/**
 * Submits form data to the Google Apps Script endpoint AND Supabase database
 *
 * @param name - Submitter's full name
 * @param email - Submitter's email address
 * @param subject - Email subject line
 * @param message - Message content
 * @param company - Honeypot field (should be empty for legitimate submissions)
 * @param phone - Phone number (optional)
 * @param formType - Type of form being submitted (e.g., "Contact", "Partnership", "Volunteer")
 * @param category - Category/reason for contact (optional)
 * @param additionalData - Any additional form-specific data to store as JSON (optional)
 * @returns Promise with response data
 */
export async function submitContactForm(
  name: string,
  email: string,
  subject: string,
  message: string,
  company: string = '',
  phone: string = '',
  formType: string = 'Contact',
  category?: string,
  additionalData?: Record<string, any>
): Promise<{ ok: boolean; error?: string }> {
  // Check honeypot - if filled, it's spam
  if (company) {
    console.warn('Honeypot field filled - potential spam');
    return { ok: false, error: 'Spam detected' };
  }

  try {
    // 1. Save to Supabase database for admin access
    const { error: dbError } = await supabase
      .from('form_submissions')
      .insert({
        form_type: formType,
        name,
        email,
        phone: phone || null,
        subject,
        message,
        category: category || null,
        form_data: additionalData || null,
        status: 'unread'
      });

    if (dbError) {
      console.error('Error saving to database:', dbError);
      // Continue even if database save fails - email is more important
    }

    // 2. Send to Google Apps Script for email notification and Google Sheets
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
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to submit form'
    };
  }
}

/**
 * Submits housing intake form data to the dedicated intake Google Apps Script endpoint AND Supabase
 *
 * @param name - Applicant's full name
 * @param email - Applicant's email address
 * @param subject - Email subject line
 * @param message - Formatted intake form message content
 * @param company - Honeypot field (should be empty for legitimate submissions)
 * @param phone - Phone number
 * @param formType - Type of form being submitted (defaults to "Housing Intake Application")
 * @param additionalData - Any additional form-specific data to store as JSON (optional)
 * @returns Promise with response data
 */
export async function submitIntakeForm(
  name: string,
  email: string,
  subject: string,
  message: string,
  company: string = '',
  phone: string = '',
  formType: string = 'Housing Intake Application',
  additionalData?: Record<string, any>
): Promise<{ ok: boolean; error?: string }> {
  // Check honeypot - if filled, it's spam
  if (company) {
    console.warn('Honeypot field filled - potential spam');
    return { ok: false, error: 'Spam detected' };
  }

  try {
    // 1. Save to Supabase database for admin access
    const { error: dbError } = await supabase
      .from('form_submissions')
      .insert({
        form_type: formType,
        name,
        email,
        phone: phone || null,
        subject,
        message,
        form_data: additionalData || null,
        status: 'unread'
      });

    if (dbError) {
      console.error('Error saving to database:', dbError);
      // Continue even if database save fails - email is more important
    }

    // 2. Send to Google Apps Script for email notification and Google Sheets
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('company', company);
    formData.append('phone', phone);
    formData.append('formType', formType);

    const response = await fetch(INTAKE_GAS_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to submit form'
    };
  }
}
