/**
 * POST /api/investments/pending-notification
 * 
 * Server-side ONLY endpoint to send investment pending notification email
 * This endpoint ONLY sends the email - it does NOT modify any database records
 * Investment creation/status management happens elsewhere
 * 
 * Required body fields:
 *   - investmentId: string
 *   - userId: string
 *   - userEmail: string (REQUIRED if database fetch fails)
 *   - plan: string (REQUIRED if database fetch fails)
 *   - amount: number (REQUIRED if database fetch fails)
 *   - userName: string (optional)
 *   - dailyRoiRate: number (optional)
 *   - duration: number (optional)
 * 
 * Returns: { success: boolean, messageId?: string, message: string }
 */

import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  console.log('\n🔵 [ENDPOINT CALLED] /api/investments/pending-notification');
  console.log('Method:', req.method);
  console.log('Body received:', JSON.stringify(req.body, null, 2));

  if (req.method !== 'POST') {
    console.error('❌ Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { investmentId, userId, userEmail, plan, amount, userName, dailyRoiRate, duration } = req.body;

    console.log('\n📋 Validating input data:');
    console.log('  ✓ investmentId:', investmentId ? '✅' : '❌');
    console.log('  ✓ userId:', userId ? '✅' : '❌');
    console.log('  ✓ userEmail:', userEmail ? '✅' : '❌');
    console.log('  ✓ plan:', plan ? '✅' : '❌');
    console.log('  ✓ amount:', amount ? '✅' : '❌');

    // Check Mailjet credentials FIRST
    const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
    const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;

    console.log('\n🔐 Checking Mailjet credentials:');
    console.log('  API Key:', MAILJET_API_KEY ? `✅ Present (${MAILJET_API_KEY.substring(0, 8)}...)` : '❌ Missing');
    console.log('  API Secret:', MAILJET_API_SECRET ? '✅ Present' : '❌ Missing');

    if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
      console.error('❌ Mailjet credentials not configured - CANNOT SEND EMAIL');
      return res.status(500).json({ 
        error: 'Email service not configured',
        details: 'Mailjet credentials missing from environment'
      });
    }

    // Validate minimum required fields
    if (!investmentId || !userId) {
      console.error('❌ Missing critical fields: investmentId or userId');
      return res.status(400).json({
        error: 'Missing required fields: investmentId, userId'
      });
    }

    if (!userEmail) {
      console.error('❌ Missing userEmail - cannot send email');
      return res.status(400).json({
        error: 'Missing userEmail'
      });
    }

    if (!plan || !amount) {
      console.error('❌ Missing investment details: plan or amount');
      return res.status(400).json({
        error: 'Missing investment details'
      });
    }

    // Prepare email data
    const finalUserName = userName || 'Valued Member';
    const finalAmount = parseFloat(amount) || 0;
    const finalPlan = plan || 'Investment Plan';
    const finalRoi = parseFloat(dailyRoiRate) || 0;
    const finalDuration = parseInt(duration) || 0;

    const dailyRoiAmount = (finalAmount * finalRoi).toFixed(2);
    const totalReturn = (finalAmount * finalRoi * finalDuration).toFixed(2);

    console.log('\n✉️  Email data prepared:');
    console.log('  To:', userEmail);
    console.log('  User:', finalUserName);
    console.log('  Plan:', finalPlan);
    console.log('  Amount: $' + finalAmount);
    console.log('  Daily ROI: $' + dailyRoiAmount);

    // Create email HTML
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Investment Pending</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1a2847 100%); color: #f0b90b; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table tr td { padding: 12px; border-bottom: 1px solid #eee; }
    .info-table tr td:first-child { font-weight: bold; width: 40%; background: #f9f9f9; }
    .highlight { color: #f0b90b; font-weight: bold; font-size: 16px; }
    .button { display: inline-block; padding: 12px 30px; background: #f0b90b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { background: #f4f4f4; color: #666; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; }
    .badge { display: inline-block; background: #fbbf24; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0; color: #f0b90b;">⏳ Investment Received</h2>
    </div>
    <div class="content">
      <p>Hello <strong>${finalUserName}</strong>,</p>
      <p>Thank you for your investment submission! Your <strong>${finalPlan}</strong> investment has been received and is now <span class="badge">PENDING REVIEW</span>.</p>
      
      <h3 style="color: #0f172a; border-bottom: 2px solid #f0b90b; padding-bottom: 10px;">Investment Details</h3>
      <table class="info-table">
        <tr>
          <td>Plan</td>
          <td><strong>${finalPlan}</strong></td>
        </tr>
        <tr>
          <td>Amount</td>
          <td class="highlight">$${finalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>
        <tr>
          <td>Daily ROI</td>
          <td><strong>${(finalRoi * 100).toFixed(2)}%</strong></td>
        </tr>
        <tr>
          <td>Daily Return</td>
          <td class="highlight">$${dailyRoiAmount}</td>
        </tr>
        <tr>
          <td>Duration</td>
          <td><strong>${finalDuration} days</strong></td>
        </tr>
        <tr>
          <td>Total Expected Return</td>
          <td class="highlight">$${totalReturn}</td>
        </tr>
      </table>

      <p><strong>What's Next?</strong></p>
      <ul>
        <li>Our team will review your investment request</li>
        <li>You'll receive an approval email shortly</li>
        <li>Returns begin accruing immediately upon approval</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://cyphervault.vercel.app/dashboard" class="button">View Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 Cypher Vault. All rights reserved.</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>`;

    // Send email via Mailjet
    console.log('\n📤 Creating Mailjet connection and sending...');
    const mailjet = Mailjet.connect(MAILJET_API_KEY, MAILJET_API_SECRET);
    const fromEmail = process.env.MAILJET_FROM_EMAIL || 'no-reply@cyphervault.online';
    const fromName = process.env.MAILJET_FROM_NAME || 'Cypher Vault';

    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [{
        From: { Email: fromEmail, Name: fromName },
        To: [{ Email: userEmail }],
        Subject: '⏳ Investment Received - Pending Review',
        HTMLPart: html
      }]
    });

    const messageId = result.body?.Messages?.[0]?.To?.[0]?.MessageID;
    const messageStatus = result.body?.Messages?.[0]?.Status;

    console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
    console.log('  Message ID:', messageId);
    console.log('  Status:', messageStatus);
    console.log('  To:', userEmail);

    return res.status(200).json({
      success: true,
      message: 'Investment notification email sent successfully',
      messageId,
      emailSent: true
    });

  } catch (error) {
    console.error('\n❌ ERROR IN ENDPOINT:', error.message);
    console.error('Full error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
      message: error.message
    });
  }
}
