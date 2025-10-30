/**
 * SheRises Contact Form Router - Google Apps Script
 *
 * This script handles contact form submissions from the She Rises website.
 * It validates input, sends admin notifications, optional user acknowledgements,
 * and logs all submissions to a Google Sheet.
 */

// ============================================================================
// CONFIGURATION HELPERS
// ============================================================================

/**
 * Sets the admin email address that will receive contact form notifications.
 * Run this function once after deployment to configure your admin email.
 *
 * @param {string} email - The email address to receive notifications
 *
 * Example usage in Apps Script editor:
 *   setAdminEmail("LemonsTerrell43@gmail.com")
 */
function setAdminEmail(email) {
  PropertiesService.getScriptProperties().setProperty('ADMIN_EMAIL', email);
  Logger.log('Admin email set to: ' + email);
}

/**
 * Enables or disables automatic reply emails sent to form submitters.
 *
 * @param {boolean|string} enabled - true/"true" to enable, false/"false" to disable
 *
 * Example usage:
 *   setAutoReply(true)   // Enable auto-replies
 *   setAutoReply(false)  // Disable auto-replies
 */
function setAutoReply(enabled) {
  var value = String(enabled).toLowerCase();
  PropertiesService.getScriptProperties().setProperty('AUTO_REPLY', value);
  Logger.log('Auto-reply set to: ' + value);
}

/**
 * Initialize script properties with default values if not already set.
 * Run this once after creating the script.
 */
function initializeProperties() {
  var props = PropertiesService.getScriptProperties();

  // Set default admin email if not already configured
  if (!props.getProperty('ADMIN_EMAIL')) {
    props.setProperty('ADMIN_EMAIL', 'LemonsTerrell43@gmail.com');
    Logger.log('Initialized ADMIN_EMAIL to: LemonsTerrell43@gmail.com');
  }

  // Set default auto-reply to enabled if not already configured
  if (!props.getProperty('AUTO_REPLY')) {
    props.setProperty('AUTO_REPLY', 'true');
    Logger.log('Initialized AUTO_REPLY to: true');
  }

  Logger.log('Initialization complete');
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

/**
 * Handles POST requests from contact forms.
 * This is the main entry point when forms are submitted.
 *
 * @param {Object} e - Event object containing POST parameters
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response
 */
function doPost(e) {
  try {
    // Extract form parameters
    var params = e.parameter;
    var name = params.name || '';
    var email = params.email || '';
    var subject = params.subject || '';
    var message = params.message || '';
    var company = params.company || ''; // Honeypot field

    // Honeypot check: if "company" field is filled, treat as spam
    if (company) {
      Logger.log('Spam detected via honeypot field');
      // Return success to avoid revealing spam detection
      return jsonResponse({ ok: true });
    }

    // Validate required fields
    if (!name.trim()) {
      return jsonResponse({ ok: false, error: 'Name is required' });
    }
    if (!email.trim()) {
      return jsonResponse({ ok: false, error: 'Email is required' });
    }
    if (!subject.trim()) {
      return jsonResponse({ ok: false, error: 'Subject is required' });
    }
    if (!message.trim()) {
      return jsonResponse({ ok: false, error: 'Message is required' });
    }

    // Basic email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse({ ok: false, error: 'Invalid email address' });
    }

    // Get configuration from Script Properties
    var props = PropertiesService.getScriptProperties();
    var adminEmail = props.getProperty('ADMIN_EMAIL') || 'LemonsTerrell43@gmail.com';
    var autoReplyEnabled = props.getProperty('AUTO_REPLY') !== 'false';

    // Create timestamp
    var timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // Send admin notification email
    sendAdminNotification(adminEmail, name, email, subject, message, timestamp);

    // Send optional user acknowledgement
    if (autoReplyEnabled) {
      sendUserAcknowledgement(email, name);
    }

    // Log to Google Sheet
    logToSheet(timestamp, name, email, subject, message);

    // Return success response
    return jsonResponse({ ok: true });

  } catch (error) {
    // Log error and return failure response
    Logger.log('Error processing form: ' + error.toString());
    return jsonResponse({
      ok: false,
      error: 'An error occurred processing your request. Please try again.'
    });
  }
}

// ============================================================================
// EMAIL FUNCTIONS
// ============================================================================

/**
 * Sends an email notification to the admin with the form submission details.
 *
 * @param {string} adminEmail - Destination email address
 * @param {string} name - Submitter's name
 * @param {string} email - Submitter's email
 * @param {string} subject - Message subject
 * @param {string} message - Message content
 * @param {string} timestamp - Submission timestamp
 */
function sendAdminNotification(adminEmail, name, email, subject, message, timestamp) {
  var emailSubject = 'Contact: ' + subject + ' — from ' + name;

  // Build HTML email body with escaped content
  var htmlBody = '<div style="font-family: Arial, sans-serif; max-width: 600px;">';
  htmlBody += '<h2 style="color: #333;">New Contact Form Submission</h2>';
  htmlBody += '<div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">';
  htmlBody += '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>';
  htmlBody += '<p><strong>Email:</strong> ' + escapeHtml(email) + '</p>';
  htmlBody += '<p><strong>Subject:</strong> ' + escapeHtml(subject) + '</p>';
  htmlBody += '<p><strong>Message:</strong></p>';
  htmlBody += '<div style="background: white; padding: 15px; border-left: 4px solid #4A90E2;">';
  htmlBody += escapeHtml(message).replace(/\n/g, '<br>');
  htmlBody += '</div>';
  htmlBody += '</div>';
  htmlBody += '<p style="color: #666; font-size: 12px;"><strong>Submitted:</strong> ' + timestamp + '</p>';
  htmlBody += '<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">';
  htmlBody += '<p style="color: #999; font-size: 11px;">This message was sent via the She Rises contact form.</p>';
  htmlBody += '</div>';

  // Send email with reply-to set to the submitter's email
  GmailApp.sendEmail(adminEmail, emailSubject, '', {
    htmlBody: htmlBody,
    replyTo: email,
    name: 'She Rises Contact Form'
  });

  Logger.log('Admin notification sent to: ' + adminEmail);
}

/**
 * Sends an acknowledgement email to the user who submitted the form.
 *
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name
 */
function sendUserAcknowledgement(userEmail, userName) {
  var emailSubject = 'We received your message - She Rises';

  // Build warm, professional acknowledgement email
  var htmlBody = '<div style="font-family: Arial, sans-serif; max-width: 600px;">';
  htmlBody += '<h2 style="color: #4A90E2;">Thank you for reaching out!</h2>';
  htmlBody += '<p>Dear ' + escapeHtml(userName) + ',</p>';
  htmlBody += '<p>We have received your message and appreciate you taking the time to contact She Rises.</p>';
  htmlBody += '<p>Our team typically responds within one business day. We look forward to connecting with you soon.</p>';
  htmlBody += '<p style="margin-top: 30px;">With gratitude,<br><strong>The She Rises Team</strong></p>';
  htmlBody += '<hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">';
  htmlBody += '<p style="color: #999; font-size: 11px;">This is an automated acknowledgement. Please do not reply to this email.</p>';
  htmlBody += '</div>';

  // Send acknowledgement email
  GmailApp.sendEmail(userEmail, emailSubject, '', {
    htmlBody: htmlBody,
    name: 'She Rises'
  });

  Logger.log('User acknowledgement sent to: ' + userEmail);
}

// ============================================================================
// LOGGING FUNCTION
// ============================================================================

/**
 * Logs the form submission to the Google Sheet for record keeping.
 * Sheet URL: https://docs.google.com/spreadsheets/d/1m0Ol6A0mWYnOfKzHTi0O81Z95voE54aMN7F0h4gwa-A/
 *
 * @param {string} timestamp - Submission timestamp
 * @param {string} name - Submitter's name
 * @param {string} email - Submitter's email
 * @param {string} subject - Message subject
 * @param {string} message - Message content
 */
function logToSheet(timestamp, name, email, subject, message) {
  try {
    // Open the existing Google Sheet by ID
    var sheetId = '1m0Ol6A0mWYnOfKzHTi0O81Z95voE54aMN7F0h4gwa-A';
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName('SheRises Contact Messages');

    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = spreadsheet.insertSheet('SheRises Contact Messages');
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'IP', 'User Agent']);
      // Format header row
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#4A90E2').setFontColor('#FFFFFF');
    }

    // Note: IP and User Agent are not reliably available in Google Apps Script web apps
    // These fields are left empty but can be populated if running through a proxy
    var ip = '';
    var userAgent = '';

    // Append the new submission
    sheet.appendRow([timestamp, name, email, subject, message, ip, userAgent]);

    Logger.log('Submission logged to sheet');

  } catch (error) {
    // Log error but don't fail the entire request
    Logger.log('Error logging to sheet: ' + error.toString());
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a JSON response for the web app.
 *
 * @param {Object} data - Object to serialize as JSON
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response with proper CORS headers
 */
function jsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  // Add CORS headers to allow requests from any domain
  return output;
}

/**
 * Escapes HTML special characters to prevent injection attacks.
 *
 * @param {string} text - Text to escape
 * @returns {string} HTML-safe text
 */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// TESTING FUNCTION (Optional - for development only)
// ============================================================================

/**
 * Test function to simulate a form submission.
 * Run this in the Apps Script editor to test your setup.
 */
function testFormSubmission() {
  var testEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message to verify the contact form is working correctly.'
    }
  };

  var result = doPost(testEvent);
  Logger.log('Test result: ' + result.getContent());
}
