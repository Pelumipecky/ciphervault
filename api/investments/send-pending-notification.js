/**
 * POST /api/investments/send-pending-notification
 * Sends investment submission pending notification email
 * 
 * Body: { investmentId, userId }
 * Returns: { success: boolean, messageId?: string, error?: string }
 */

import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('\n📧 Investment Pending Notification Request');
    const { investmentId, userId } = req.body;

    if (!investmentId || !userId) {
      console.error('❌ Missing investmentId or userId');
      return res.status(400).json({ error: 'Missing investmentId or userId' });
    }

    // Fetch investment from database
    console.log('📥 Fetching investment:', investmentId);
    const { data: investment, error: invError } = await supabase
      .from('investments')
      .select('*')
      .eq('id', investmentId)
      .single();

    if (invError || !investment) {
      console.error('❌ Investment not found:', invError);
      return res.status(404).json({ error: 'Investment not found' });
    }

    console.log('✅ Investment found:', {
      plan: investment.plan,
      capital: investment.capital,
      roi: investment.roi
    });

    // Fetch user from database
    console.log('📥 Fetching user:', userId);
    const { data: user, error: userError } = await supabase
      .from('userlogs')
      .select('*')
      .eq('idnum', userId)
      .single();

    if (userError || !user) {
      console.error('❌ User not found:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.email) {
      console.error('❌ User has no email');
      return res.status(400).json({ error: 'User email not found' });
    }

    console.log('✅ User found:', user.email);

    // Check Mailjet credentials
    const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
    const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;

    if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
      console.error('❌ Mailjet not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Prepare email data
    const userName = user.name || user.firstName || 'Valued Member';
    const amount = investment.capital || 0;
    const plan = investment.plan || 'Investment';
    const roi = investment.roi || 0;
    const duration = investment.duration || 0;
    const dailyROI = (amount * roi).toFixed(2);
    const totalROI = (amount * roi * duration).toFixed(2);

    console.log('✉️  Preparing email:', {
      to: user.email,
      plan,
      amount,
      dailyROI,
      totalROI
    });

    // Create email HTML
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3c72 100%); color: #f0b90b; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .badge { display: inline-block; background: #fbbf24; color: #000; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 13px; margin-top: 12px; }
    .content { padding: 30px; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: bold; color: #666; }
    .detail-value { color: #f0b90b; font-weight: bold; font-size: 16px; }
    .highlight-box { background: #f9f9f9; padding: 20px; border-left: 4px solid #f0b90b; margin: 20px 0; border-radius: 4px; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
    .button { display: inline-block; background: #f0b90b; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    a { color: #f0b90b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Investment Received</h1>
      <div class="badge">⏳ PENDING APPROVAL</div>
    </div>
    
    <div class="content">
      <p>Hello <strong>${userName}</strong>,</p>
      
      <p>Thank you for submitting your investment! We have received your <strong>${plan}</strong> investment application.</p>
      
      <div class="highlight-box">
        <h3 style="margin-top: 0; color: #0f172a;">Investment Details</h3>
        <div class="detail-row">
          <span class="detail-label">Plan</span>
          <span>${plan}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value">$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Daily ROI Rate</span>
          <span>${(roi * 100).toFixed(2)}%</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Daily Return</span>
          <span class="detail-value">$${parseFloat(dailyROI).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration</span>
          <span><strong>${duration} days</strong></span>
        </div>
        <div class="detail-row" style="border-bottom: none; font-weight: bold;">
          <span class="detail-label">Total Expected Return</span>
          <span class="detail-value">$${parseFloat(totalROI).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our team will review your investment within 24 hours</li>
        <li>You'll receive an approval confirmation email once reviewed</li>
        <li>Your returns will start accruing immediately upon approval</li>
        <li>You can track your investment in your dashboard anytime</li>
      </ul>

      <center>
        <a href="https://cyphervault.vercel.app/dashboard" class="button">View Dashboard</a>
      </center>

      <p style="color: #888; font-size: 12px; margin-top: 30px; line-height: 1.6;">
        If you have any questions about your investment, please contact our support team at support@cyphervault.online
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; 2026 Cypher Vault. All rights reserved.<br>
      This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

    // Send via Mailjet
    console.log('📤 Sending via Mailjet...');
    const mailjet = Mailjet.connect(MAILJET_API_KEY, MAILJET_API_SECRET);
    const fromEmail = process.env.MAILJET_FROM_EMAIL || 'no-reply@cyphervault.online';
    const fromName = process.env.MAILJET_FROM_NAME || 'Cypher Vault';

    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [{
        From: { Email: fromEmail, Name: fromName },
        To: [{ Email: user.email }],
        Subject: '⏳ Investment Received - Pending Approval',
        HTMLPart: html
      }]
    });

    const messageId = result.body?.Messages?.[0]?.To?.[0]?.MessageID;

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', messageId);
    console.log('   To:', user.email);

    return res.status(200).json({
      success: true,
      messageId,
      message: 'Investment notification email sent'
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message
    });
  }
}
