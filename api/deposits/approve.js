import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

dotenv.config();

/**
 * POST /api/deposits/approve
 * Send deposit approval email via Mailjet
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { depositId, userId, amount, method, userName, userEmail, transactionHash } = req.body;

    // Validate input
    if (!depositId || !userId || !amount || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields: depositId, userId, amount, userEmail' });
    }

    // Check Mailjet credentials
    const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
    const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;

    if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
      console.error('❌ Mailjet credentials not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    console.log('\n' + '='.repeat(70));
    console.log('📧 /api/deposits/approve - Deposit Approval Email');
    console.log('='.repeat(70));
    console.log('Details:', { depositId, userId, amount, userEmail, method });

    // Create email HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Deposit Approved</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { background-color: #0f172a; color: #f0b90b; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .footer { background-color: #f4f4f4; color: #666; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; }
    .button { display: inline-block; padding: 10px 20px; background-color: #f0b90b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; color: #555; width: 40%; }
    .highlight { color: #f0b90b; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="text-align: center; padding: 25px 0;">
      <a href="https://cyphervault.vercel.app" target="_blank" style="text-decoration: none;">
        <img src="https://cyphervault.vercel.app/images/ciphervaultlogobig.png" alt="Cypher Vault" width="200" style="display: inline-block; max-width: 100%; height: auto; border: 0; font-family: sans-serif; font-size: 24px; color: #f0b90b; font-weight: bold;" />
      </a>
    </div>
    <div class="content">
      <h2>Deposit Approved!</h2>
      <p>Hello ${userName || 'User'},</p>
      <p>Success! Your deposit has been confirmed and credited to your account.</p>
      <table class="info-table">
        <tr><td>Amount:</td><td class="highlight">$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Method:</td><td>${method || 'Crypto'}</td></tr>
        ${transactionHash ? `<tr><td>Transaction Hash:</td><td style="font-family: monospace; font-size: 12px; word-break: break-all;">${transactionHash}</td></tr>` : ''}
        <tr><td>Status:</td><td style="color: #22c55e;">Approved</td></tr>
      </table>
      <p>Funds are now available in your balance for trading or investment.</p>
      <center><a href="https://cyphervault.vercel.app/dashboard" class="button">Go to Dashboard</a></center>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Cypher Vault. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send via Mailjet
    const mailjet = Mailjet.connect(MAILJET_API_KEY, MAILJET_API_SECRET);
    const fromEmail = process.env.MAILJET_FROM_EMAIL || 'no-reply@cyphervault.online';
    const fromName = process.env.MAILJET_FROM_NAME || 'Cypher Vault';

    console.log('📤 Sending via Mailjet...');
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName
          },
          To: [{ Email: userEmail }],
          Subject: '✅ Deposit Approved - Cypher Vault',
          HTMLPart: html
        }
      ]
    });

    const result = await request;
    const messageId = result.body?.Messages?.[0]?.To?.[0]?.MessageID;

    console.log('✅ Mailjet Response:', {
      status: result.response?.status,
      messageId: messageId,
      msgStatus: result.body?.Messages?.[0]?.Status
    });
    console.log('='.repeat(70) + '\n');

    return res.status(200).json({
      success: true,
      messageId: messageId,
      message: 'Deposit approval email sent successfully'
    });

  } catch (error) {
    console.error('❌ Email Send Error:', {
      message: error.message,
      statusCode: error.statusCode,
      mailjetError: error.response?.body?.ErrorMessage,
      details: error.response?.body
    });
    console.log('='.repeat(70) + '\n');

    return res.status(500).json({
      error: 'Failed to send email',
      details: error.response?.body?.ErrorMessage || error.message
    });
  }
}
