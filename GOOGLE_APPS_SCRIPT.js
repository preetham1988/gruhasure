/*
=================================================================
  GOOGLE APPS SCRIPT — HomeGuard Bangalore Lead Capture
=================================================================
  Receives form data from customer-info.html and writes it as
  a new row in your Google Sheet. Optional email alert included.

  ── SETUP STEPS (one time, ~10 minutes) ──────────────────────

  STEP 1 — Create your Google Sheet
  1. Go to https://sheets.google.com → create a new blank sheet
  2. Name it "HomeGuard Leads"
  3. In Row 1 add these column headers (one per cell):
     Timestamp | First Name | Last Name | Phone | Email |
     How Found | Property Type | Config | Area sqft | Stage |
     Locality | Builder | Service | Preferred Date |
     Preferred Time | Notes

  STEP 2 — Open Apps Script
  1. In your sheet click: Extensions → Apps Script
  2. DELETE all existing code in the editor
  3. PASTE the code below (between the === lines) into the editor

  STEP 3 — Save the project
  1. Click the 💾 save icon
  2. Name the project: HomeGuard Form Handler → OK

  STEP 4 — Deploy as Web App
  1. Click "Deploy" (top right) → "New deployment"
  2. Click the ⚙️ gear → choose "Web app"
  3. Set: Execute as → Me | Who has access → Anyone
  4. Click "Deploy"
  5. Authorise when prompted (click Advanced → Go to app → Allow)
  6. COPY the URL shown — it looks like:
     https://script.google.com/macros/s/AKfycbXXXX.../exec

  STEP 5 — Paste URL into your website
  1. Open js/main.js in your project folder
  2. Find: const SHEET_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
  3. Replace the placeholder with your URL (keep the quotes)
  4. Save js/main.js and re-upload it to GitHub

  STEP 6 — Enable email alerts (optional)
  1. In the Apps Script editor find: // sendEmailAlert(data, now);
  2. Remove the // to uncomment it
  3. In sendEmailAlert() replace YOUR_EMAIL@gmail.com with yours
  4. Save and re-deploy (Deploy → Manage → pencil → New version)
=================================================================
*/


// ── PASTE THIS CODE INTO GOOGLE APPS SCRIPT ──────────────────

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    var now = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    sheet.appendRow([
      now,
      data.fname    || '',
      data.lname    || '',
      data.phone    || '',
      data.email    || '',
      data.how      || '',
      data.ptype    || '',
      data.config   || '',
      data.area     || '',
      data.stage    || '',
      data.locality || '',
      data.builder  || '',
      data.service  || '',
      data.date     || '',
      data.time     || '',
      data.notes    || ''
    ]);

    // ✏️ Uncomment the line below to get email alerts for every lead:
    // sendEmailAlert(data, now);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailAlert(data, timestamp) {
  var to = 'YOUR_EMAIL@gmail.com'; // ✏️ Replace with your email

  var subject = '🏠 New Lead: ' + (data.fname||'') + ' ' + (data.lname||'') +
                ' — ' + (data.locality||'Bangalore');

  var body =
    'New enquiry from HomeGuard website\n\n' +
    'CONTACT\n' +
    'Name:     ' + (data.fname||'') + ' ' + (data.lname||'') + '\n' +
    'Phone:    ' + (data.phone||'') + '\n' +
    'Email:    ' + (data.email||'') + '\n' +
    'Found us: ' + (data.how||'Not specified') + '\n\n' +
    'PROPERTY\n' +
    'Type:     ' + (data.ptype||'')    + '\n' +
    'Config:   ' + (data.config||'')   + '\n' +
    'Area:     ' + (data.area||'')     + ' sq ft\n' +
    'Stage:    ' + (data.stage||'')    + '\n' +
    'Locality: ' + (data.locality||'') + '\n' +
    'Builder:  ' + (data.builder||'Not specified') + '\n\n' +
    'SERVICE\n' +
    'Required: ' + (data.service||'') + '\n' +
    'Date:     ' + (data.date||'Not specified') + '\n' +
    'Time:     ' + (data.time||'Any time') + '\n\n' +
    'NOTES\n' +
    (data.notes||'None') + '\n\n' +
    'Received: ' + timestamp;

  MailApp.sendEmail(to, subject, body);
}

/*
=================================================================
  TROUBLESHOOTING
  ─────────────────
  Data not showing in sheet?
  → Confirm "Who has access" = Anyone (not "Anyone with link")
  → Always deploy as "New version" after any code changes
  → Check logs: View → Executions in Apps Script editor

  Authorisation error?
  → Delete deployment, create brand new one, re-authorise

  Want to test it worked?
  → Submit the form on your website
  → Check the Executions log in Apps Script — you should see
    a successful doPost run within a few seconds
=================================================================
*/
