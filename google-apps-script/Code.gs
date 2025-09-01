/*
  Google Apps Script - B3U Contact Form Handler

  What it does:
  - Receives POSTs from the website contact form (as FormData)
  - Sends an email to info@b3unstoppable.net with the submission details
  - Optional: Stores submissions in a Google Sheet (commented example)

  Deployment:
  1) Open script.google.com and create a new project.
  2) Paste this code into Code.gs.
  3) File > Project Properties > Scopes will be handled automatically.
  4) Deploy > New deployment > Type: Web app
     - Execute as: Me
     - Who has access: Anyone
     - Copy the Web app URL and paste it into index.html data-gas-endpoint.
  5) Test the form.
*/

const RECIPIENT = 'info@b3unstoppable.net';
const SUBJECT_PREFIX = 'B3U Website Contact';

function doPost(e) {
  try {
    // e.parameter contains form fields for multipart/form-data
    const params = e && e.parameter ? e.parameter : {};

    const name = (params.name || '').trim();
    const email = (params.email || '').trim();
    const subject = (params.subject || '').trim();
    const message = (params.message || '').trim();
  const company = (params.company || params.extra_field || '').trim(); // honeypot; if filled, ignore

    if (company) {
      // Silently treat as success to deter bots
      return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
    }

    if (!name || !email || !subject || !message) {
      return ContentService.createTextOutput('Missing required fields').setMimeType(ContentService.MimeType.TEXT);
    }

    const mailSubject = `${SUBJECT_PREFIX}: ${subject}`;
    const body = `Hello B3U Team,\n\n` +
      `You have a new contact form submission from the website.\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}\n\n` +
      `---\nSent via Google Apps Script Web App`;

    // Send email
    MailApp.sendEmail({
      to: RECIPIENT,
      replyTo: email,
      name: 'B3U Website',
      subject: mailSubject,
      htmlBody: body.replace(/\n/g, '<br>'),
      plainBody: body
    });

    // Optional: store in a sheet
    // const ss = SpreadsheetApp.openById('PUT_SHEET_ID_HERE');
    // const sh = ss.getSheetByName('Submissions');
    // sh.appendRow([new Date(), name, email, subject, message]);

    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('ERROR').setMimeType(ContentService.MimeType.TEXT);
  }
}
