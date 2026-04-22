/**
 * GET Endpoint for She Rises Contact Form Submissions
 *
 * This endpoint allows the admin panel to fetch all submissions from Google Sheets
 * for syncing to the Supabase database.
 *
 * Setup Instructions:
 * 1. Add this code to your existing Google Apps Script project
 * 2. Deploy as Web App with "Execute as: Me" and "Who has access: Anyone"
 * 3. Copy the Web App URL and add it to src/config/contact.ts as SHEETS_READ_ENDPOINT
 */

const SHEET_ID = '1m0Ol6A0mWYnOfKzHTi0O81Z95voE54aMN7F0h4gwa-A';
const SHEET_NAME = 'SheRises Contact Messages';

/**
 * Handle GET requests to fetch all submissions from Google Sheets
 */
function doGet(e) {
  try {
    // Get the spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'Sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get all data from the sheet
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    // First row contains headers
    const headers = values[0];
    const data = [];

    // Convert rows to objects
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowData = {};

      for (let j = 0; j < headers.length; j++) {
        rowData[headers[j]] = row[j];
      }

      data.push(rowData);
    }

    // Return the data
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      data: data,
      count: data.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error fetching data: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify the endpoint works
 * Run this from the Apps Script editor to test
 */
function testGetEndpoint() {
  const result = doGet({});
  const json = JSON.parse(result.getContent());
  Logger.log('Result: ' + JSON.stringify(json, null, 2));
  Logger.log('Total submissions: ' + json.count);
}
