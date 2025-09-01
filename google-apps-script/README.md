# Google Apps Script Web App for B3U Contact Form

Use this to send website contact submissions to info@b3unstoppable.net.

## Steps

1. Go to [script.google.com](https://script.google.com) and create a new project.
2. Name it something like "B3U Contact Form Web App".
3. Create a file named `Code.gs` and paste the contents from `google-apps-script/Code.gs` in this repo.
4. Save the project.
5. Deploy > New deployment > Select type "Web app".
   - Description: Initial deploy
   - Execute as: Me
   - Who has access: Anyone
6. Copy the "Web app" URL.
7. In this repo, open `index.html`, find the contact form element and set the `data-gas-endpoint` attribute to the copied URL.
8. Publish changes to the website. Submit the form to test.

## Notes

- The frontend submits as `multipart/form-data` via `FormData`, which Apps Script exposes on `e.parameter`.
- A honeypot field named `company` is used; if filled, the script returns early as success.
- On success, the script returns plain text `OK`. Our frontend uses `no-cors` and assumes success if no network error occurs; PHP and mailto fallback are still in place if GAS fails.
- To log submissions, uncomment the sheet code and set your Sheet ID and tab name.
