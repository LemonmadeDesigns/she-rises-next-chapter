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
 * Common US/world timezone abbreviations → UTC offset (in hours).
 * Covers the common cases found in Google Sheets exports.
 */
const TZ_OFFSETS: Record<string, number> = {
  UTC: 0, GMT: 0,
  EST: -5, EDT: -4,
  CST: -6, CDT: -5,
  MST: -7, MDT: -6,
  PST: -8, PDT: -7,
  AKST: -9, AKDT: -8,
  HST: -10,
  AST: -4, ADT: -3,
  NST: -3.5, NDT: -2.5,
  BST: 1, CET: 1, CEST: 2,
  IST: 5.5, JST: 9, AEST: 10, AEDT: 11, NZST: 12, NZDT: 13,
};

/**
 * Robustly parse a submission timestamp from a Google Sheet cell.
 * Returns an ISO string, or null if the value cannot be parsed.
 *
 * Handles:
 *  - Date objects / ISO strings / numeric Excel serials
 *  - "Thursday, October 30, 2025 at 2:35:13 AM EDT"
 *  - "October 30, 2025 2:35:13 AM EDT"
 *  - Common US/EU date formats falling through to native Date
 */
export function parseSubmissionTimestamp(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;

  // Native Date object (Apps Script returns these for date cells)
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value.toISOString();
  }

  // Excel serial number (days since 1899-12-30)
  if (typeof value === 'number' && isFinite(value)) {
    const ms = Math.round((value - 25569) * 86400 * 1000);
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  if (typeof value !== 'string') return null;
  const raw = value.trim();
  if (!raw) return null;

  // Try the natural-language "... at H:MM:SS AM TZ" format first.
  // Strip the leading weekday + comma if present, and the literal " at ".
  const cleaned = raw
    .replace(/^[A-Za-z]+,\s*/, '')      // "Thursday, " → ""
    .replace(/\s+at\s+/i, ' ')          // "... at 2:35..." → "... 2:35..."
    .replace(/\s+/g, ' ')
    .trim();

  // Detect trailing timezone abbreviation (e.g. "EDT", "PST")
  const tzMatch = cleaned.match(/\s([A-Z]{2,5})$/);
  let body = cleaned;
  let tzOffsetHours: number | null = null;
  if (tzMatch && TZ_OFFSETS[tzMatch[1]] !== undefined) {
    tzOffsetHours = TZ_OFFSETS[tzMatch[1]];
    body = cleaned.slice(0, -tzMatch[0].length).trim();
  }

  // Parse the body with the native Date parser (handles "October 30, 2025 2:35:13 AM" well).
  let parsed = new Date(body);
  if (isNaN(parsed.getTime())) {
    // Last-ditch: try the original raw string
    parsed = new Date(raw);
    if (isNaN(parsed.getTime())) return null;
    return parsed.toISOString();
  }

  // If we extracted a timezone, the body was parsed as local time — re-anchor it.
  if (tzOffsetHours !== null) {
    // Treat the parsed Y/M/D H:M:S as wall-clock time in the named timezone.
    const wall = Date.UTC(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate(),
      parsed.getHours(),
      parsed.getMinutes(),
      parsed.getSeconds(),
      parsed.getMilliseconds(),
    );
    const utcMs = wall - tzOffsetHours * 3600 * 1000;
    return new Date(utcMs).toISOString();
  }

  return parsed.toISOString();
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

    // Preserve row order from the sheet as the source of truth.
    // Use index as a tiny offset to keep created_at strictly increasing per import.
    const importStartedAt = Date.now();

    for (let i = 0; i < result.data.length; i++) {
      const row = result.data[i];
      if (!row.Name || !row.Email) {
        skipped++;
        continue;
      }

      // Parse the original timestamp from the sheet — handles formats like:
      //   "Thursday, October 30, 2025 at 2:35:13 AM EDT"
      //   "10/30/2025 2:35:13"
      //   ISO strings, Date objects, Excel serial numbers
      const originalCreatedAt = parseSubmissionTimestamp(row.Timestamp);

      // created_at: prefer original timestamp, otherwise generate a unique sequential
      // timestamp so two rows are never assigned the exact same created_at.
      const createdAt = originalCreatedAt ?? new Date(importStartedAt + i).toISOString();

      // Check if submission already exists (by name and email)
      const { data: existing } = await supabase
        .from('form_submissions')
        .select('id')
        .eq('name', row.Name)
        .eq('email', row.Email)
        .limit(1)
        .maybeSingle();

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
          created_at: createdAt,
          original_created_at: originalCreatedAt,
          // insertion_order is auto-assigned by DB trigger in true row order
        } as never);

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
