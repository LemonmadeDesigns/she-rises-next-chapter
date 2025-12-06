# She Rises Contact Form Setup Guide

This guide walks you through deploying the Google Apps Script backend and integrating it with your existing contact forms.

---

## Prerequisites

- Google account with Gmail enabled
- Access to the existing Google Sheet: [SheRises Contact Messages](https://docs.google.com/spreadsheets/d/1m0Ol6A0mWYnOfKzHTi0O81Z95voE54aMN7F0h4gwa-A/edit?gid=0#gid=0)
- Contact forms on your website with the required fields

---

## Step 1: Create the Google Apps Script

1. Open a new browser tab and navigate to **[script.google.com/create](https://script.google.com/create)** (or visit [script.new](https://script.new))
2. Delete any default code in the editor
3. Copy the entire contents of `Code.gs` and paste it into the editor
4. Click **File > Save** (or press `Ctrl+S` / `Cmd+S`)
5. Name your project: **"SheRises Contact Router"**

---

## Step 2: Configure Admin Email

1. In the Apps Script editor, locate the function dropdown at the top (it shows "Select function")
2. Select `initializeProperties` from the dropdown
3. Click the **Run** button (▶️ play icon)
4. If prompted for authorization:
   - Click **Review Permissions**
   - Select your Google account
   - Click **Advanced** → **Go to SheRises Contact Router (unsafe)**
   - Click **Allow**
5. Check the **Execution log** at the bottom to confirm initialization

**To change the admin email later:**

1. Select `setAdminEmail` from the function dropdown
2. Modify the function call in the editor temporarily:

   ```javascript
   function setAdminEmail(email) {
     // Add this line at the top temporarily:
     email = "your-new-email@example.com";
     // ... rest of function
   ```

3. Run the function
4. Remove the temporary line

---

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment** in the top-right corner
2. Click the **gear icon** (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure deployment settings:
   - **Description**: "She Rises Contact Form Handler" (optional)
   - **Execute as**: **Me** (<your-email@gmail.com>)
   - **Who has access**: **Anyone** (required for public form submissions)
5. Click **Deploy**
6. If prompted, click **Authorize access** and complete the authorization flow
7. **IMPORTANT**: Copy the **Web app URL** (it looks like `https://script.google.com/macros/s/AKfyc.../exec`)
   - Save this URL - you'll need it in Step 5

---

## Step 4: Prepare Your Contact Forms

Ensure each contact form on your website has:

### Required Elements

1. **CSS Class**: Add `class="sherises-contact"` to the `<form>` tag
2. **Input Fields** with these exact `name` attributes:
   - `name="name"` - Submitter's name
   - `name="email"` - Submitter's email
   - `name="subject"` - Message subject
   - `name="message"` - Message content

### Optional Honeypot (Spam Protection)

Add a hidden field to catch bots:

```html
<input type="text" name="company" style="display:none;" tabindex="-1" autocomplete="off">
```

### Example Form Structure

```html
<form class="sherises-contact">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="text" name="subject" placeholder="Subject" required>
  <textarea name="message" placeholder="Your Message" required></textarea>

  <!-- Honeypot (optional but recommended) -->
  <input type="text" name="company" style="display:none;" tabindex="-1" autocomplete="off">

  <button type="submit">Send Message</button>
</form>
```

---

## Step 5: Add Frontend Integration

1. Open `sherises-contact-snippet.js`
2. Find the line:

   ```javascript
   const SHERISES_CONTACT_ENDPOINT = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```

3. Replace `"PASTE_APPS_SCRIPT_WEB_APP_URL_HERE"` with the Web App URL from Step 3:

   ```javascript
   const SHERISES_CONTACT_ENDPOINT = "https://script.google.com/macros/s/AKfyc.../exec";
   ```

4. Add the script to your website:

   **Option A - Per Page:**

   ```html
   <script src="/path/to/sherises-contact-snippet.js"></script>
   ```

   **Option B - Inline (at bottom of page before `</body>`):**

   ```html
   <script>
     // Paste entire contents of sherises-contact-snippet.js here
   </script>
   ```

   **Option C - Global Bundle:**
   Add the snippet to your main JavaScript bundle if using a build system

---

## Step 6: Test the Integration

1. Navigate to a page with a contact form
2. Fill out the form with test data:
   - Use a real email address you can check
   - Enter valid information in all fields
3. Click **Submit**
4. Verify the following:

   ✅ **Success message appears** on the page
   ✅ **Admin notification email** arrives at `LemonsTerrell43@gmail.com` (or your configured admin email)
   ✅ **Reply-To header** is set to the submitter's email (test by clicking Reply)
   ✅ **User acknowledgement email** arrives at the submitter's email
   ✅ **New row appears** in the [SheRises Contact Messages](https://docs.google.com/spreadsheets/d/1m0Ol6A0mWYnOfKzHTi0O81Z95voE54aMN7F0h4gwa-A/edit?gid=0#gid=0) sheet

5. **Test the honeypot** (optional):
   - Open browser DevTools console
   - Type: `document.querySelector('input[name="company"]').value = 'spam'`
   - Submit the form
   - Confirm: form shows success but NO email is sent (spam blocked silently)

---

## Advanced Configuration

### Change Admin Email (Post-Deployment)

1. Open your Apps Script project
2. Select `setAdminEmail` from the function dropdown
3. In the editor, find the function and temporarily add:

   ```javascript
   function setAdminEmail(email) {
     email = "new-admin@example.com"; // Change this
     PropertiesService.getScriptProperties().setProperty('ADMIN_EMAIL', email);
     Logger.log('Admin email set to: ' + email);
   }
   ```

4. Click **Run** (▶️)
5. Remove the temporary line after execution

### Disable Auto-Reply to Users

1. Select `setAutoReply` from the function dropdown
2. Temporarily modify:

   ```javascript
   function setAutoReply(enabled) {
     enabled = false; // Change to false
     // ... rest of function
   }
   ```

3. Click **Run**
4. Remove the temporary line

### View Submission Logs

1. In Apps Script editor: **View > Logs** (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Check execution logs after each form submission

### Redeploy After Code Changes

1. Make code changes in the editor
2. Click **Deploy** → **Manage deployments**
3. Click the **edit icon** (pencil) next to your active deployment
4. Update the **Version**: Select **New version**
5. Click **Deploy**
6. **Web App URL remains the same** - no frontend changes needed

---

## Troubleshooting

### Form submits but nothing happens

- Check browser console for errors (F12 → Console tab)
- Verify the Web App URL in `sherises-contact-snippet.js` is correct
- Confirm the form has `class="sherises-contact"`

### Emails not arriving

- Check spam/junk folders
- Verify admin email is set: Run `initializeProperties` again
- Check Apps Script execution logs for errors

### "Authorization required" errors

- Redeploy with **Execute as: Me** and **Who has access: Anyone**
- Complete the authorization flow again

### Sheet not logging submissions

- Verify you have edit access to the Google Sheet
- Check the sheet ID in `Code.gs` matches the actual sheet
- Review execution logs for sheet-related errors

---

## Security Notes

- The honeypot field (`company`) silently blocks spam without alerting bots
- All user input is HTML-escaped before being included in emails
- The Apps Script only accepts POST requests with form data
- Consider adding rate limiting if you experience abuse (requires additional Apps Script code)

---

## Support

For issues specific to this integration:

1. Check the **Execution log** in Apps Script editor
2. Review browser console for client-side errors
3. Verify all deployment steps were completed

For general She Rises website questions:

- Contact: <LemonsTerrell43@gmail.com>
