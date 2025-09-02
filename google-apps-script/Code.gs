// B3U Contact Form - Google Apps Script Web App
// Sends website submissions to Bree, with reply-to set to the info@ alias.
// Optionally send using the true Gmail alias (requires Advanced Gmail service enabled + Send-as configured).

const PRIMARY_RECIPIENT = 'breecharles@b3unstoppable.net';
const INFO_ALIAS = 'info@b3unstoppable.net';
const SUBJECT_PREFIX = 'Message From B3Unstoppable.net';
const BCC_SELF = true; // set false to disable bcc to executing account
const USE_GMAIL_ALIAS = false; // set true only if Advanced Gmail service is enabled and alias is configured

// Map the select values from the website to readable labels
const SUBJECT_LABELS = {
  speaking: 'Speaking Engagement',
  podcast: 'Podcast Collaboration',
  services: 'Professional Services',
  general: 'General Inquiry'
};

function getParams(e) {
  if (e && e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }
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
    const params = getParams(e);
    const name = (params.name || '').trim();
    const email = (params.email || '').trim();
    const subjectRaw = (params.subject || '').trim();
    const message = (params.message || '').trim();
    const honeypot = (params.company || params.extra_field || '').trim(); // accept either field

    if (honeypot) {
      return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
    }
    if (!name || !email || !subjectRaw || !message) {
      return ContentService.createTextOutput('Missing required fields').setMimeType(ContentService.MimeType.TEXT);
    }

    const subjectLabel = SUBJECT_LABELS[subjectRaw] || subjectRaw;
    Logger.log('doPost from %s <%s> subject: %s', name, email, subjectLabel);

    const mailSubject = `${SUBJECT_PREFIX}: ${subjectLabel}`;
    const body = `Message From B3Unstoppable.net\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subjectLabel}\n\n` +
      `Message:\n${message}\n\n` +
      `---\nSent via Google Apps Script Web App`;
    const htmlBody = body.replace(/\n/g, '<br>');

    if (USE_GMAIL_ALIAS) {
      sendViaGmailAlias(PRIMARY_RECIPIENT, mailSubject, htmlBody, email);
    } else {
      const options = {
        name: 'B3U Website',
        replyTo: INFO_ALIAS, // replies go to info@
        htmlBody
      };
      if (BCC_SELF) {
        const me = Session.getActiveUser().getEmail();
        if (me) options.bcc = me;
      }
      MailApp.sendEmail(PRIMARY_RECIPIENT, mailSubject, body, options);
    }

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

function doGet(e) {
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}

// Diagnostics
function ping() { Logger.log('ping'); return 'OK'; }
function whoAmI() { const me = Session.getActiveUser().getEmail(); Logger.log('Active user: ' + me); return me || '(unknown)'; }
function authorize() { const q = MailApp.getRemainingDailyQuota(); Logger.log('Remaining daily quota: ' + q); return q; }

function testMail() {
  const subject = `${SUBJECT_PREFIX}: Test Mail (Manual)`;
  const body = ['Manual test from Google Apps Script.','If you received this, MailApp is authorized and working.','','- B3U Website'].join('\n');
  const before = MailApp.getRemainingDailyQuota();
  Logger.log('Quota before send: ' + before);
  MailApp.sendEmail(PRIMARY_RECIPIENT, subject, body, { name: 'B3U Website', replyTo: INFO_ALIAS, cc: 'hligon@getsparqd.com', htmlBody: body.replace(/\n/g, '<br>') });
  const after = MailApp.getRemainingDailyQuota();
  Logger.log('Quota after send: ' + after);
}

function testMailSelf() {
  const me = Session.getActiveUser().getEmail();
  MailApp.sendEmail(me, `${SUBJECT_PREFIX}: Test Mail (Self)`, 'Self-test from Google Apps Script.');
}

// Send using Gmail alias (Advanced Gmail API must be enabled; alias configured in Gmail)
function sendViaGmailAlias(to, subject, htmlBody, replyToUserEmail) {
  // If Advanced Gmail service isn't enabled, fall back gracefully
  if (typeof Gmail === 'undefined' || !Gmail || !Gmail.Users || !Gmail.Users.Messages || !Gmail.Users.Messages.send) {
    Logger.log('Advanced Gmail service not enabled; falling back to MailApp with replyTo alias.');
    const textBody = htmlBody.replace(/<br\s*\/?>(\r?\n)?/gi, '\n').replace(/<[^>]+>/g, '');
    const opts = { name: 'B3U Website', replyTo: INFO_ALIAS, cc: 'hligon@getsparqd.com', htmlBody };
    MailApp.sendEmail(to, subject, textBody, opts);
    return;
  }
  // Build RFC 2822 raw message with From set to the alias (requires Advanced Gmail + Send-as)
  const from = INFO_ALIAS; // alias configured in Gmail "Send mail as"
  const headers = [
    `From: B3U Website <${from}>`,
    `To: ${to}`,
    `Cc: hligon@getsparqd.com`,
    `Reply-To: ${INFO_ALIAS}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    `Subject: ${subject}`,
    '',
    htmlBody
  ].join('\r\n');
  const raw = Utilities.base64EncodeWebSafe(headers);
  // @ts-ignore - Advanced Gmail service
  // eslint-disable-next-line no-undef
  const sent = Gmail.Users.Messages.send({ raw }, 'me');
  Logger.log('Gmail alias send id: ' + (sent && sent.id));
}