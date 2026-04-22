# Google Sheets Sync Setup Instructions

This guide will help you set up the Google Sheets READ endpoint so the admin panel can sync submissions from Google Sheets to the Supabase database.

## Step 1: Add the GET Endpoint to Google Apps Script

1. **Open your Google Apps Script project:**
   - Go to https://script.google.com
   - Open your existing "SheRises Contact Router" project

2. **Add a new doGet function:**
   - Open the file `Code-GET-Endpoint.gs` from this folder
   - Copy ALL the code
   - In your Apps Script editor, paste it into your existing Code.gs file (or create a new file)
   - **Important**: If you already have a `doGet` function, you'll need to merge them or rename one

3. **Verify the Sheet ID and Name:**
   - In the code, check that these match your setup:
     ```javascript
     const SHEET_ID = '1m0Ol6A0mWYnOfKzHTi0O81Z95voE54aMN7F0h4gwa-A';
     const SHEET_NAME = 'SheRises Contact Messages';
     ```

4. **Test the function:**
   - In the Apps Script editor, select `testGetEndpoint` from the function dropdown
   - Click the Run button (▶️)
   - Check the logs (View → Logs) to see if it returns your sheet data

## Step 2: Deploy the Web App

1. **Create a new deployment:**
   - Click "Deploy" → "New deployment"
   - Click the gear icon (⚙️) → Select "Web app"
   - Configure:
     - **Description**: "Get endpoint for sheet sync"
     - **Execute as**: Me (your email)
     - **Who has access**: Anyone
   - Click "Deploy"

2. **Copy the Web App URL:**
   - After deployment, you'll see a URL like:
     `https://script.google.com/macros/s/AKfycbx.../exec`
   - **Copy this URL** - you'll need it in the next step

## Step 3: Update the Frontend Configuration

1. **Open** `src/config/contact.ts`

2. **Add the new endpoint** at the top:
   ```typescript
   // Google Apps Script Web App URL for reading Google Sheets data
   export const SHEETS_READ_ENDPOINT = 'PASTE_YOUR_WEB_APP_URL_HERE';
   ```

3. **Replace** `PASTE_YOUR_WEB_APP_URL_HERE` with the URL you copied in Step 2

4. **Save the file**

## Step 4: Test the Sync

1. **Go to the admin panel:** http://localhost:8080/admin (or your live site)

2. **Click the "Form Submissions" tab**

3. **Click "Sync from Google Sheets"** button

4. **Verify:**
   - You should see a loading indicator
   - After a few seconds, submissions from Google Sheets should appear
   - Check the toast notification for success/error messages

## Troubleshooting

### "Failed to fetch data from Google Sheets"
- Verify the Web App URL is correct in `src/config/contact.ts`
- Check that the deployment is set to "Anyone" can access
- Look at the Apps Script execution logs for errors

### "Sheet not found"
- Verify `SHEET_NAME` matches your actual sheet name exactly
- Check for typos or extra spaces

### CORS Errors
- Make sure the deployment is set to "Execute as: Me" and "Who has access: Anyone"
- Redeploy if necessary

### No Data Appearing
- Run `testGetEndpoint()` in Apps Script to verify data is being read
- Check browser console for JavaScript errors
- Verify submissions exist in your Google Sheet

## Security Note

This endpoint returns ALL submissions from your Google Sheet. It's protected by:
1. The URL is secret (hard to guess)
2. Only authenticated admins in your Supabase database can insert the synced data
3. The endpoint doesn't expose any sensitive configuration

However, **do not share the Web App URL publicly** as it would allow anyone to read your submissions.

## Data Mapping

The sync function maps Google Sheets columns to Supabase fields:

| Google Sheets Column | Supabase Field |
|---------------------|----------------|
| Timestamp           | created_at     |
| Name                | name           |
| Email               | email          |
| Subject             | subject        |
| Message             | message        |
| (form type derived) | form_type      |

The sync will:
- Skip duplicates (based on name, email, and timestamp)
- Set status to 'unread' for newly imported submissions
- Preserve the original timestamp from Google Sheets
