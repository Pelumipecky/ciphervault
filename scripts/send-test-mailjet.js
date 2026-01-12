import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.MAILJET_API_KEY;
const apiSecret = process.env.MAILJET_API_SECRET;
const fromEmail = process.env.MAILJET_FROM_EMAIL || process.env.MAIL_FROM || 'no-reply@ciphervault.online';
const fromName = process.env.MAIL_FROM_NAME || 'Cypher Vault';
const toEmail = process.env.TEST_EMAIL_TO || 'cyphervault6@gmail.com';

if (!apiKey || !apiSecret) {
  console.error('Missing MAILJET_API_KEY or MAILJET_API_SECRET');
  process.exit(1);
}

// node-mailjet v6 uses connect() instead of apiConnect()
const mailjet = Mailjet.connect(apiKey, apiSecret);

async function sendTest() {
  console.log('Sending test email via Mailjet...');
  try {
    const { body } = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: toEmail,
                Name: 'Test Recipient',
              },
            ],
            Subject: 'Mailjet Test - Cypher Vault',
            TextPart: 'This is a test email from Cypher Vault via Mailjet.',
            HTMLPart: '<h3>Mailjet Test</h3><p>This is a test email from Cypher Vault via Mailjet.</p>',
          },
        ],
      });
    console.log('✅ Sent. Response:', body.Messages?.[0]?.Status || 'ok');
  } catch (err) {
    console.error('❌ Failed to send test email:', err);
  }
}

sendTest();
