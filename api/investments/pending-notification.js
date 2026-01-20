/**
 * POST /api/investments/pending-notification
 * 
 * Server-side ONLY endpoint to send investment pending notification email
 * This endpoint ONLY sends the email - it does NOT modify any database records
 * Investment creation/status management happens elsewhere
 * 
 * Required body fields:
 *   - investmentId: string (the investment ID)
 *   - userId: string (the user's idnum/id)
 * 
 * Returns: { success: boolean, messageId?: string, error?: string }
 */

import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { investmentId, userId } = req.body;

    // Validate required fields
    if (!investmentId || !userId) {
      console.error('❌ Missing required fields:', { investmentId, userId });
      return res.status(400).json({
        error: 'Missing required fields: investmentId, userId'
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('📧 /api/investments/pending-notification - Pending Email');
    console.log('='.repeat(70));
    console.log('Inputs:', { investmentId, userId });

    // Check Mailjet credentials
    const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
    const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;

    if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
      console.error('❌ Mailjet credentials not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    let investment = null;
    let user = null;

    // STEP 1: Fetch investment record
    if (supabase) {
      console.log('Step 1: Fetching investment from database...');
      try {
        const { data: invData, error: invError } = await supabase
          .from('investments')
          .select('*')
          .eq('id', investmentId)
          .single();

        if (invError) {
          console.warn('⚠️  Could not fetch investment from Supabase:', invError);
        } else if (invData) {
          investment = invData;
          console.log('✅ Investment found:', {
            id: investment.id,
            plan: investment.plan,
            capital: investment.capital,
            roi: investment.roi,
            duration: investment.duration
          });
        }
      } catch (dbError) {
        console.warn('⚠️  Database error fetching investment:', dbError.message);
      }
    }

    // STEP 2: Fetch user record
    if (supabase) {
      console.log('Step 2: Fetching user from database...');
      try {
        const { data: userData, error: userError } = await supabase
          .from('userlogs')
          .select('*')
          .eq('idnum', userId)
          .single();

        if (userError) {
          console.warn('⚠️  Could not fetch user from Supabase:', userError);
        } else if (userData) {
          user = userData;
          console.log('✅ User found:', {
            idnum: user.idnum,
            email: user.email,
            name: user.name || user.firstName
          });
        }
      } catch (dbError) {
        console.warn('⚠️  Database error fetching user:', dbError.message);
      }
    }

    // Fallback: If no database connection, expect data in request body
    if (!investment && req.body.plan && req.body.amount) {
      console.log('Step 1: Using investment data from request body (no DB connection)');
      investment = {
        id: investmentId,
        plan: req.body.plan,
        capital: req.body.amount,
        roi: req.body.dailyRoiRate || 0,
        duration: req.body.duration || 0
      };
    }

    if (!user && req.body.userEmail) {
      console.log('Step 2: Using user data from request body (no DB connection)');
      user = {
        idnum: userId,
        email: req.body.userEmail,
        name: req.body.userName || 'User'
      };
    }

    // Validation: Must have at least minimum required data
    if (!user || !user.email) {
      console.error('❌ Cannot send email - no user email found');
      return res.status(400).json({
        error: 'User email not found',
        details: 'Unable to fetch user email from database or request'
      });
    }

    if (!investment || !investment.plan) {
      console.error('❌ Cannot send email - no investment plan found');
      return res.status(400).json({
        error: 'Investment plan not found',
        details: 'Unable to fetch investment details from database or request'
      });
    }

    // STEP 3: Prepare email data
    const userEmail = user.email;
    const userName = user.name || user.firstName || 'Valued Member';
    const investmentAmount = investment.capital || 0;
    const investmentPlan = investment.plan || 'Investment Plan';
    const roiRate = investment.roi || 0;
    const duration = investment.duration || 0;

    // Calculate expected returns
    const dailyRoiAmount = (investmentAmount * roiRate).toFixed(2);
    const totalReturn = (investmentAmount * roiRate * duration).toFixed(2);

    console.log('Step 3: Email data prepared:', {
      to: userEmail,
      userName,
      amount: investmentAmount,
      plan: investmentPlan,
      dailyRoi: dailyRoiAmount,
      totalReturn
    });

    // STEP 4: Create professional email HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Investment Pending</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { background-color: #0f172a; color: #f0b90b; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header img { max-width: 100%; height: auto; }
    .content { padding: 30px 20px; }
    .footer { background-color: #f4f4f4; color: #666; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; }
    .button { display: inline-block; padding: 10px 20px; background-color: #f0b90b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; color: #555; width: 40%; background-color: #f9f9f9; }
    .highlight { color: #f0b90b; font-weight: bold; }
    .status-badge { display: inline-block; background-color: #fbbf24; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; }
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
      <h2>⏳ Investment Request Received</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Thank you for submitting your investment request! We have received your application for the <strong>${investmentPlan}</strong> plan.</p>
      
      <p style="text-align: center; margin: 20px 0;">
        <span class="status-badge">PENDING REVIEW</span>
      </p>

      <p><strong>Your Investment Details:</strong></p>
      <table class="info-table">
        <tr>
          <td>Investment Plan</td>
          <td><strong>${investmentPlan}</strong></td>
        </tr>
        <tr>
          <td>Amount</td>
          <td class="highlight">$${parseFloat(investmentAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>Daily ROI Rate</td>
          <td>${(roiRate * 100).toFixed(2)}%</td>
        </tr>
        <tr>
          <td>Expected Daily Return</td>
          <td class="highlight">$${parseFloat(dailyRoiAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>Duration</td>
          <td><strong>${duration} Days</strong></td>
        </tr>
        <tr>
          <td>Total Expected Return</td>
          <td class="highlight">$${parseFloat(totalReturn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td><span style="color: #f59e0b;">⏳ Under Review</span></td>
        </tr>
      </table>

      <p><strong>What happens next?</strong></p>
      <ul style="color: #555; line-height: 1.8;">
        <li>Our team is currently reviewing your investment application</li>
        <li>You will receive an approval email once the review is complete</li>
        <li>Your returns will start accruing immediately upon approval</li>
        <li>You can track your investment status in your dashboard at any time</li>
      </ul>

      <p style="text-align: center;">
        <a href="https://cyphervault.vercel.app/dashboard" class="button">Track Investment Status</a>
      </p>

      <p style="color: #888; font-size: 12px; margin-top: 30px;">
        If you have any questions about your investment, please contact our support team.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Cypher Vault. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;

    // STEP 5: Send email via Mailjet
    console.log('Step 4: Creating Mailjet connection...');
    const mailjet = Mailjet.connect(MAILJET_API_KEY, MAILJET_API_SECRET);
    const fromEmail = process.env.MAILJET_FROM_EMAIL || 'no-reply@cyphervault.online';
    const fromName = process.env.MAILJET_FROM_NAME || 'Cypher Vault';

    console.log('Step 5: Sending email via Mailjet...');
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName
          },
          To: [{ Email: userEmail }],
          Subject: '⏳ Investment Request Received - Cypher Vault',
          HTMLPart: html
        }
      ]
    });

    const result = await request;
    const messageId = result.body?.Messages?.[0]?.To?.[0]?.MessageID;

    console.log('✅ Mailjet Response:', {
      httpStatus: result.response?.status,
      messageId: messageId,
      messageStatus: result.body?.Messages?.[0]?.Status
    });

    console.log('='.repeat(70) + '\n');

    // STEP 6: Return success response
    return res.status(200).json({
      success: true,
      messageId: messageId,
      message: 'Investment pending notification email sent successfully',
      investmentId: investmentId,
      emailSent: true
    });

  } catch (error) {
    console.error('❌ Error in pending investment notification:', {
      message: error.message,
      statusCode: error.statusCode,
      mailjetError: error.response?.body?.ErrorMessage,
      fullError: error
    });
    console.log('='.repeat(70) + '\n');

    return res.status(500).json({
      error: 'Failed to send investment pending notification',
      message: error.message,
      details: error.response?.body?.ErrorMessage || 'Internal server error'
    });
  }
}
