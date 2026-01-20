#!/usr/bin/env node
/**
 * DEPOSIT EMAIL APPROVAL DIAGNOSTIC SCRIPT
 * Tests the entire email sending flow for deposit approvals
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.VITE_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000';
const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;
const EMAIL_NOTIFICATIONS_ENABLED = process.env.VITE_EMAIL_NOTIFICATIONS_ENABLED === 'true';
const TEST_EMAIL = 'test@example.com';

console.log('\n' + '='.repeat(70));
console.log('🔍 DEPOSIT EMAIL APPROVAL DIAGNOSTIC');
console.log('='.repeat(70) + '\n');

// Check 1: Environment Variables
console.log('📋 STEP 1: Check Environment Variables');
console.log('─'.repeat(70));
console.log(`API_URL:                      ${API_URL}`);
console.log(`Mailjet API Key:              ${MAILJET_API_KEY ? '✅ Present' : '❌ Missing'}`);
console.log(`Mailjet API Secret:           ${MAILJET_API_SECRET ? '✅ Present' : '❌ Missing'}`);
console.log(`EMAIL_NOTIFICATIONS_ENABLED:  ${EMAIL_NOTIFICATIONS_ENABLED ? '✅ true' : '❌ false'}`);

if (!EMAIL_NOTIFICATIONS_ENABLED) {
  console.log('\n⚠️  WARNING: Email notifications are DISABLED!');
  console.log('   Action: Set VITE_EMAIL_NOTIFICATIONS_ENABLED=true in .env\n');
}

if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
  console.log('\n⚠️  WARNING: Mailjet credentials not configured!');
  console.log('   Action: Set MAILJET_API_KEY and MAILJET_API_SECRET in .env\n');
}

// Check 2: Test /api/send-email endpoint
console.log('\n📋 STEP 2: Test /api/send-email Endpoint');
console.log('─'.repeat(70));
console.log(`Testing POST ${API_URL}/api/send-email\n`);

const testEmailPayload = {
  to: TEST_EMAIL,
  subject: '✅ Test Deposit Approval Email - Cypher Vault',
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Deposit Approved</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { background-color: #0f172a; color: #f0b90b; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .highlight { color: #f0b90b; font-weight: bold; }
    .button { display: inline-block; padding: 10px 20px; background-color: #f0b90b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Test Deposit Approval Email</h1>
    </div>
    <div class="content">
      <h2>Test: Deposit Approved! ✅</h2>
      <p>Hello Test User,</p>
      <p>This is a diagnostic test email to verify the deposit approval email system is working.</p>
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px; font-weight: bold;">Amount:</td>
          <td style="padding: 8px;"><span class="highlight">$1,000.00</span></td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px; font-weight: bold;">Method:</td>
          <td style="padding: 8px;">Bitcoin (BTC)</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Status:</td>
          <td style="padding: 8px; color: #22c55e;">Approved</td>
        </tr>
      </table>
      <p><strong>What this means:</strong> If you received this email, the deposit approval system is working correctly! ✅</p>
      <center><a href="https://cyphervault.vercel.app/dashboard" class="button">Go to Dashboard</a></center>
    </div>
    <div style="background-color: #f4f4f4; color: #666; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #ddd;">
      <p>&copy; ${new Date().getFullYear()} Cypher Vault. All rights reserved.</p>
      <p>This is a diagnostic test email.</p>
    </div>
  </div>
</body>
</html>
  `
};

try {
  const response = await fetch(`${API_URL}/api/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testEmailPayload),
  });

  console.log(`Response Status: ${response.status} ${response.statusText}`);
  
  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ API Request Successful!');
    console.log(`   Message ID: ${result.messageId || result.sent || 'N/A'}`);
    console.log(`\n✅ EMAIL SENDING SYSTEM IS WORKING!\n`);
  } else {
    console.log('❌ API Request Failed!');
    console.log(`   Error: ${result.error || result.errorMessage || 'Unknown error'}`);
    console.log(`   Details: ${result.details || 'None'}\n`);
  }
} catch (error) {
  console.log('❌ Connection Error!');
  console.log(`   ${error.message}`);
  console.log(`\n⚠️  Unable to connect to ${API_URL}`);
  console.log('   Make sure the server is running: npm run dev\n');
}

// Check 3: Verify Mailjet Credentials Work
console.log('\n📋 STEP 3: Verify Mailjet Credentials');
console.log('─'.repeat(70));

if (MAILJET_API_KEY && MAILJET_API_SECRET) {
  console.log('Checking if Mailjet credentials are valid...\n');
  
  try {
    const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64');
    const response = await fetch('https://api.mailjet.com/v3/REST/user', {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Mailjet credentials are valid!\n');
    } else {
      console.log('❌ Mailjet credentials are invalid!');
      console.log(`   Status: ${response.status}`);
      console.log('   Action: Verify MAILJET_API_KEY and MAILJET_API_SECRET in .env\n');
    }
  } catch (error) {
    console.log('❌ Unable to verify Mailjet credentials:', error.message + '\n');
  }
} else {
  console.log('⚠️  Mailjet credentials not configured\n');
}

// Summary and recommendations
console.log('\n📋 DIAGNOSIS SUMMARY');
console.log('─'.repeat(70));

const issues = [];

if (!EMAIL_NOTIFICATIONS_ENABLED) {
  issues.push('❌ Email notifications are DISABLED (VITE_EMAIL_NOTIFICATIONS_ENABLED != true)');
}

if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
  issues.push('❌ Mailjet API credentials are missing');
}

if (issues.length === 0) {
  console.log('✅ All checks passed! Email system should be working.\n');
  console.log('If emails still aren\'t arriving:');
  console.log('  1. Check spam/junk folder');
  console.log('  2. Verify recipient email address is correct');
  console.log('  3. Check server logs for errors');
  console.log('  4. Test with a different email provider if available\n');
} else {
  console.log('❌ Issues detected:\n');
  issues.forEach(issue => console.log('  ' + issue));
  console.log('\n✅ RECOMMENDED FIXES:\n');
  
  if (!EMAIL_NOTIFICATIONS_ENABLED) {
    console.log('1. Enable email notifications:');
    console.log('   Add to .env: VITE_EMAIL_NOTIFICATIONS_ENABLED=true\n');
  }
  
  if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
    console.log('2. Configure Mailjet:');
    console.log('   Add to .env:');
    console.log('   MAILJET_API_KEY=your_api_key');
    console.log('   MAILJET_API_SECRET=your_api_secret\n');
  }
}

console.log('='.repeat(70) + '\n');
