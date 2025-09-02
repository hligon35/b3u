const RECIPIENT = 'info@b3unstoppable.net';
const SUBJECT_PREFIX = 'Message From B3Unstoppable.net';

// Map the select values from the website to readable labels
const SUBJECT_LABELS = {
  speaking: 'Speaking Engagement',
  podcast: 'Podcast Collaboration',
  services: 'Professional Services',
  general: 'General Inquiry'
};

function getParams(e) {
  // Prefer form fields (multipart/form-data or urlencoded)
  if (e && e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }
  // Fallback: JSON body (if someone posts JSON)
  try {
    if (e && e.postData && e.postData.type && e.postData.contents) {
      if ((e.postData.type + '').indexOf('application/json') !== -1) {
        return JSON.parse(e.postData.contents || '{}');
      }
    }
  } catch (err) {
    Logger.log('getParams JSON parse error: ' + err);
  }
  return {};
}

function doPost(e) {
  try {
  // Collect params from form-data or JSON
  const params = getParams(e);

  const name = (params.name || '').trim();
  const email = (params.email || '').trim();
  const subjectRaw = (params.subject || '').trim();
  const message = (params.message || '').trim();
  // Honeypot: accept either 'company' (legacy) or 'extra_field' (current)
  const honeypot = (params.company || params.extra_field || '').trim();

    if (honeypot) {
      // Silently treat as success to deter bots
      return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
    }

    if (!name || !email || !subjectRaw || !message) {
      return ContentService.createTextOutput('Missing required fields').setMimeType(ContentService.MimeType.TEXT);
    }

    const subjectLabel = SUBJECT_LABELS[subjectRaw] || subjectRaw;
    const mailSubject = `${SUBJECT_PREFIX}: ${subjectLabel}`;
    const body = `Message From B3Unstoppable.net\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subjectLabel}\n\n` +
      `Message:\n${message}\n\n` +
      `---\nSent via Google Apps Script Web App`;

    // Send email
    MailApp.sendEmail(
      RECIPIENT,
      mailSubject,
      body,
      {
        name: 'B3U Website',
        replyTo: email,
        cc: 'hligon@getsparqd.com',
        htmlBody: body.replace(/\n/g, '<br>')
      }
    );

    // Optional: store in a sheet
  // const ss = SpreadsheetApp.openById('PUT_SHEET_ID_HERE');
  // const sh = ss.getSheetByName('Submissions');
  // sh.appendRow([new Date(), name, email, subjectLabel, message]);

    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    Logger.log('doPost error: ' + (err && err.stack ? err.stack : err));
    return ContentService
      .createTextOutput('ERROR: ' + (err && err.message ? err.message : err))
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// Simple health check for the Web App URL (optional but handy)
function doGet(e) {
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}

// Minimal diagnostic (no scopes required)
function ping() {
  Logger.log('ping');
  return 'OK';
}

// Identify which account executes this script
function whoAmI() {
  const me = Session.getActiveUser().getEmail();
  Logger.log('Active user: ' + me);
  return me || '(unknown)';
}

// Explicit authorization helper (does not send email)
function authorize() {
  // Touch MailApp to trigger the permission prompt on first run
  const quota = MailApp.getRemainingDailyQuota();
  Logger.log('Remaining daily quota: ' + quota);
  return quota;
}

// Manual test to authorize MailApp and verify delivery
function testMail() {
  const subject = `${SUBJECT_PREFIX}: Test Mail (Manual)`;
  const body = [
    'Manual test from Google Apps Script.',
    'If you received this, MailApp is authorized and working.',
    '',
  '- B3U Website'
  ].join('\n');

  const before = MailApp.getRemainingDailyQuota();
  Logger.log('Quota before send: ' + before);

  MailApp.sendEmail(
    RECIPIENT,
    subject,
    body,
    {
      name: 'B3U Website',
      replyTo: 'no-reply@b3unstoppable.net',
      cc: 'hligon@getsparqd.com',
      htmlBody: body.replace(/\n/g, '<br>')
    }
  );

  const after = MailApp.getRemainingDailyQuota();
  Logger.log('Quota after send: ' + after);
  Logger.log('Sent testMail to: ' + RECIPIENT);
}

// Send a test email to the executing account's inbox
function testMailSelf() {
  const me = Session.getActiveUser().getEmail();
  const subject = `${SUBJECT_PREFIX}: Test Mail (Self)`;
  const body = 'Self-test from Google Apps Script.';
  const before = MailApp.getRemainingDailyQuota();
  Logger.log('Quota before send: ' + before + ', sending to self: ' + me);
  MailApp.sendEmail(me, subject, body);
  const after = MailApp.getRemainingDailyQuota();
  Logger.log('Quota after send: ' + after);
}

// Simulate a doPost submission inside the Script Editor
function testDoPost() {
  const fakeEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
  subject: 'general',
      message: 'This is a simulated submission to verify end-to-end flow.',
      extra_field: '' // honeypot must be empty
    }
  };
  const out = doPost(fakeEvent);
  try {
    Logger.log(out && out.getContent ? out.getContent() : out);
  } catch (e) {
    Logger.log(out);
  }
}

// Build email content without sending (no MailApp scopes)
function testNoMail() {
  const name = 'Test User';
  const email = 'test@example.com';
  const subjectRaw = 'general';
  const subjectLabel = SUBJECT_LABELS[subjectRaw] || subjectRaw;
  const message = 'This is a content-only test.';
  const mailSubject = `${SUBJECT_PREFIX}: ${subjectLabel}`;
  const body = `Message From B3Unstoppable.net\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Subject: ${subjectLabel}\n\n` +
    `Message:\n${message}\n\n` +
    `---\nSent via Google Apps Script Web App`;
  Logger.log(mailSubject + "\n\n" + body);
  return mailSubject;
}