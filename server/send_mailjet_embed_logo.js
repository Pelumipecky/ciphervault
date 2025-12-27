// Sends a test email to show embedded inline logo using data URI
const Mailjet = require('node-mailjet');
const fs = require('fs');
const path = require('path');

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
      console.error('Usage: node send_mailjet_embed_logo.js recipient@example.com');
      process.exit(1);
    }

    const logoPath = path.join(__dirname, '..', 'public', 'images', 'ciphervaultlogobig.svg');
    let logoDataUri = '';
    try {
      if (fs.existsSync(logoPath)) {
        const svg = fs.readFileSync(logoPath, 'utf8');
        const base64 = Buffer.from(svg, 'utf8').toString('base64');
        logoDataUri = `data:image/svg+xml;base64,${base64}`;
      }
    } catch (e) {
      console.warn('Could not read logo file:', e.message || e);
    }

    // Build HTML with a CID image reference (fallback to data URI inline if available)
    const cidReference = 'cid:ciphervaultlogobig';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8fafc;">
        <h3>Embedded Logo Test</h3>
        <div>${logoDataUri ? `<img src="${logoDataUri}" alt="logo" style="max-width:240px;display:block;margin-bottom:12px;"/>` : `<img src="${cidReference}" alt="logo" style="max-width:240px;display:block;margin-bottom:12px;"/>`}</div>
        <p>If you see the logo above, embedding works. If not, the image should be attached to the message.</p>
      </div>
    `;

    // Attach logo as a base64 attachment as well (Mailjet will include it in the message)
    const attachments = [];
    try {
      if (logoDataUri) {
        const base64 = Buffer.from(fs.readFileSync(path.join(__dirname, '..', 'public', 'images', 'ciphervaultlogobig.svg'), 'utf8')).toString('base64');
        attachments.push({ ContentType: 'image/svg+xml', Filename: 'ciphervaultlogobig.svg', Base64Content: base64 });
      }
    } catch (e) {
      console.warn('Could not attach logo for embed test:', e.message || e);
    }

    const mailjet = Mailjet.connect(apiKey, apiSecret);
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL || `no-reply@${process.env.APP_DOMAIN || 'ciphervault.example'}`,
            Name: process.env.MAILJET_FROM_NAME || 'Cyphervault'
          },
          To: [{ Email: to }],
          Subject: 'Embedded logo test',
          HTMLPart: html,
          Attachments: attachments
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
