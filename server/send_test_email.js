// Temporary test script to send an email via Mailjet
// Usage (PowerShell):
// $env:MAILJET_API_KEY='your_key'; $env:MAILJET_API_SECRET='your_secret'; node send_test_email.js recipient@example.com

const Mailjet = require('node-mailjet');

async function main() {
  try {
    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    const to = process.argv[2];

    if (!apiKey || !apiSecret) {
      console.error('Missing MAILJET_API_KEY or MAILJET_API_SECRET in environment.');
      process.exit(1);
    }
    if (!to) {
      console.error('Usage: node send_test_email.js recipient@example.com');
      process.exit(1);
    }

    const mailjet = Mailjet.connect(apiKey, apiSecret);

    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_FROM_EMAIL || `no-reply@${process.env.APP_DOMAIN || 'ciphervault.example'}`,
              Name: process.env.MAILJET_FROM_NAME || 'Cyphervault'
            },
            To: [ { Email: to } ],
            Subject: 'Test Email from Cyphervault',
            HTMLPart: `<h3>Test Email</h3><p>This is a test email sent via Mailjet from the Cyphervault project.</p><p>If you received this, Mailjet is configured correctly.</p>`
          }
        ]
      });

    const result = await request;
    console.log('Mailjet response status:', result.response.status);
    console.log('Mailjet response data:', JSON.stringify(result.body));
    console.log('Test email sent successfully to', to);
  } catch (err) {
    console.error('Failed to send test email:', err.error || err);
    process.exit(1);
  }
}

main();
