/**
 * SHE RISES - Housing Intake Form Handler
 * Google Apps Script for processing intake form submissions
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet named "SHE RISES - Housing Intake Forms"
 * 2. Open Extensions > Apps Script
 * 3. Copy this entire code into the script editor
 * 4. Click Deploy > New Deployment
 * 5. Select "Web app" as deployment type
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click Deploy and copy the Web App URL
 * 9. Update the INTAKE_GAS_ENDPOINT in src/config/contact.ts with this URL
 */

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the form data
    const params = e.parameter;
    const timestamp = new Date();

    // Check if this is the first submission (initialize headers)
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Full Name',
        'Phone Number',
        'Email Address',
        'Age',
        'Preferred Language',
        'Gender Identity',
        'Gender Identity Other',
        'Justice-Involved',
        'Currently Homeless',
        'Current County',
        'Preferred Location',
        'Willing to Participate',
        'Shared Housing',
        'Referral Source',
        'Referral Source Other',
        'Housing Categories',
        'Has Pets',
        'Pet Type',
        'Is Service Animal',
        'Has Vaccination Proof',
        'Medical Insurance',
        'Has Medical Conditions',
        'Medical Conditions Detail',
        'Employment Status',
        'Benefits',
        'Monthly Income',
        'Funding Expectation',
        'Domestic Violence',
        'Substance Use',
        'Willing Case Management',
        'Has Case Manager',
        'Case Manager Info',
        'Spoken with 211',
        'Acknowledgment',
        'Form Type',
        'Full Message'
      ];
      sheet.appendRow(headers);
    }

    // Extract all form data
    const name = params.name || '';
    const email = params.email || '';
    const phone = params.phone || '';
    const message = params.message || '';
    const formType = params.formType || 'Housing Intake Application';

    // Append the new row with all data
    const row = [
      timestamp,
      name,
      phone,
      email,
      '', // These will be extracted from the message
      '', // We'll parse the formatted message to extract individual fields
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      formType,
      message // Store the full formatted message
    ];

    sheet.appendRow(row);

    // Send email notification to admin
    const adminEmail = 'pransom@safehavenforempowerment.org';
    const subject = `New Housing Intake Submission - ${name}`;
    const emailBody = `
New Housing Intake & Eligibility Screening Form Submission

Submitted: ${timestamp.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}

Applicant Name: ${name}
Email: ${email}
Phone: ${phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULL APPLICATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View all submissions in your Google Sheet:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

---
This is an automated message from your SHE RISES website intake form.
    `.trim();

    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      body: emailBody
    });

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error and return error response
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'SHE RISES Housing Intake Form Handler is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
