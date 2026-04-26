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

// Google Apps Script Web App URL for reading Google Sheets data
// TODO: After deploying the GET endpoint, add your Web App URL here
// See scripts/contact-form-gas/SYNC-SETUP.md for instructions
export const SHEETS_READ_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxuPS41An4EL5_DBd06nbKS8rcPT2mJ8qb9Bokzhrnr_fnsBT6gz1gNG7xq8T7ubR-uUA/exec';

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
  additionalData?: Record<string, unknown>
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
      .insert([{
        form_type: formType,
        name,
        email,
        phone: phone || null,
        subject,
        message,
        category: category || null,
        form_data: (additionalData || null) as never,
        status: 'unread'
      }]);

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
  additionalData?: Record<string, unknown>
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
      .insert([{
        form_type: formType,
        name,
        email,
        phone: phone || null,
        subject,
        message,
        form_data: (additionalData || null) as never,
        status: 'unread'
      }]);

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

/**
 * Fetches all submissions from Google Sheets and syncs them to Supabase
 */
export async function syncFromGoogleSheets(): Promise<{
  ok: boolean;
  imported: number;
  skipped: number;
  error?: string;
}> {
  if (!SHEETS_READ_ENDPOINT) {
    return {
      ok: false,
      imported: 0,
      skipped: 0,
      error: 'Google Sheets endpoint not configured. See scripts/contact-form-gas/SYNC-SETUP.md'
    };
  }

  try {
    const response = await fetch(SHEETS_READ_ENDPOINT);
    const result = await response.json();

    if (!result.ok || !result.data) {
      throw new Error(result.error || 'Failed to fetch data from Google Sheets');
    }

    let imported = 0;
    let skipped = 0;

    for (const row of result.data) {
      if (!row.Name || !row.Email) {
        skipped++;
        continue;
      }

      // Parse timestamp - handle various formats
      let timestamp: string;
      try {
        // Try parsing the timestamp
        const date = new Date(row.Timestamp);
        if (isNaN(date.getTime())) {
          // If invalid, use current time
          timestamp = new Date().toISOString();
        } else {
          timestamp = date.toISOString();
        }
      } catch {
        // Fallback to current time if parsing fails
        timestamp = new Date().toISOString();
      }

      // Check if submission already exists (by name and email only, since timestamp might vary)
      const { data: existing } = await supabase
        .from('form_submissions')
        .select('id')
        .eq('name', row.Name)
        .eq('email', row.Email)
        .limit(1)
        .single();

      if (existing) {
        skipped++;
        continue;
      }

      const { error: insertError } = await supabase
        .from('form_submissions')
        .insert({
          form_type: row.Subject?.includes('Housing') ? 'Housing Intake' :
                     row.Subject?.includes('Volunteer') ? 'Volunteer' :
                     row.Subject?.includes('Partnership') ? 'Partnership' :
                     'Contact',
          name: row.Name,
          email: row.Email,
          phone: row.Phone || null,
          subject: row.Subject || null,
          message: row.Message || null,
          status: 'unread',
          created_at: timestamp
        });

      if (insertError) {
        console.error('Error inserting row:', insertError);
        skipped++;
      } else {
        imported++;
      }
    }

    return { ok: true, imported, skipped };
  } catch (error) {
    console.error('Error syncing from Google Sheets:', error);
    return {
      ok: false,
      imported: 0,
      skipped: 0,
      error: error instanceof Error ? error.message : 'Failed to sync from Google Sheets'
    };
  }
}
