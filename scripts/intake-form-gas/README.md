# SHE RISES - Housing Intake Form Google Apps Script Setup

This directory contains the Google Apps Script code for handling housing intake form submissions to a separate spreadsheet.

## Setup Instructions

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: **"SHE RISES - Housing Intake Forms"** (or your preferred name)

### Step 2: Set Up the Script

1. In your new Google Sheet, click **Extensions > Apps Script**
2. Delete any default code in the editor
3. Copy the entire contents of `Code.gs` from this folder
4. Paste it into the Apps Script editor
5. Click the **💾 Save** button (or Ctrl/Cmd + S)
6. Name your project: "Housing Intake Form Handler"

### Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the **⚙️ gear icon** next to "Select type"
3. Choose **"Web app"**
4. Configure the deployment:
   - **Description:** "Housing Intake Form Handler v1"
   - **Execute as:** Me (your Google account email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Authorize** the script (Google will ask for permissions)
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
7. **Copy the Web App URL** (it will look like: `https://script.google.com/macros/s/...../exec`)

### Step 4: Update Your Website Code

1. Open the file: `src/config/contact.ts`
2. Find the line with `INTAKE_GAS_ENDPOINT`
3. Replace `'YOUR_INTAKE_FORM_DEPLOYMENT_URL_HERE'` with the URL you copied
4. Save the file

Example:

```typescript
export const INTAKE_GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

### Step 5: Test the Form

1. Deploy your website changes
2. Go to your Programs page
3. Click "Contact Us About Programs"
4. Fill out and submit the intake form
5. Check your new Google Sheet - you should see the submission appear
6. Check your email (<pransom@safehavenforempowerment.org>) for the notification

## How It Works

- **Separate Tracking:** Intake forms are now stored in their own dedicated Google Sheet
- **Email Notifications:** You'll still receive email notifications for each intake submission
- **Fallback:** If the intake endpoint isn't configured, forms will automatically fall back to the general contact form endpoint

## Spreadsheet Columns

The script automatically creates the following columns:

- Timestamp
- Full Name, Phone, Email, Age
- Demographics (Gender, Language, Justice-Involved status)
- Location preferences
- Housing category and situation
- Pet information
- Medical & Insurance details
- Income & Benefits
- Safety & Readiness
- Case Management info
- Full formatted message

## Updating the Script

If you need to make changes:

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Make your changes
4. Save
5. Deploy > Manage Deployments
6. Click ✏️ Edit on your active deployment
7. Update version (e.g., "v2")
8. Deploy

The URL stays the same, so you don't need to update your website code.

## Troubleshooting

**Forms not appearing in the sheet?**

- Check that the Web App is deployed with "Execute as: Me" and "Anyone" access
- Verify the URL in `src/config/contact.ts` matches your deployment URL
- Check your browser console for errors

**Not receiving emails?**

- Verify the email address in the script: `pransom@safehavenforempowerment.org`
- Check your spam folder
- Make sure you authorized the script to send emails

**Getting permission errors?**

- Re-deploy the script and go through the authorization process again
- Make sure you're using your Google account that owns the spreadsheet

## Support

For issues or questions, refer to the [Google Apps Script documentation](https://developers.google.com/apps-script).

---

New deployment

Deployment successfully updated.
Version 1 on Dec 16, 2025, 8:19 AM

> Deployment ID:

AKfycbwsIWJK3XiJK5F-i3XuGpi3RfcXs9oKf5sAZOAE4g563WG4xjyqDwyVlmyVlXNid4E_lQ

> Web app URL:

<https://script.google.com/macros/s/AKfycbwsIWJK3XiJK5F-i3XuGpi3RfcXs9oKf5sAZOAE4g563WG4xjyqDwyVlmyVlXNid4E_lQ/exec>
