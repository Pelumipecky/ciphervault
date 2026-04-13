# Deposit Approval Email - Complete Debug Guide

## What We Fixed

1. **✅ Mailjet Credentials** - Added to root `.env`
2. **✅ Comprehensive Logging** - Added detailed step-by-step logging
3. **✅ Email Service Enhancement** - Better error messages

## How to Test & Debug

### Step 1: Verify Server is Running
```bash
npm run dev
```

The server should start on `http://localhost:3000`. You'll see:
```
➜  Local:   http://localhost:5173/   (Frontend)
➜  Server running on port 3000        (Backend API)
```

### Step 2: Test Environment Setup
Run the diagnostic tool:
```bash
node test-deposit-email.mjs
```

Should see:
```
✅ Mailjet API Key: Present
✅ Mailjet API Secret: Present  
✅ Email Notifications: Enabled
✅ Mailjet Credentials: Valid
```

### Step 3: Admin Approves a Deposit

When you approve a deposit in admin dashboard, watch the **BROWSER CONSOLE** (F12):

#### Expected Console Logs (Client-side):

```
======================================================================
🔄 DEPOSIT APPROVAL FLOW STARTED
======================================================================
Step 1: Update deposit status
✅ Deposit status updated to Approved
Step 2: Fetch user data
✅ User found: { email: 'user@example.com', name: 'John Doe' }
Step 3: Update user balance
✅ User balance updated: $1000
Step 4: Update UI state
✅ UI state updated
Step 5: Create in-app notification
✅ In-app notification created
Step 6: Send approval email
📧 Sending approval email to: user@example.com
✅ Deposit approval email sent successfully
======================================================================
✅ DEPOSIT APPROVAL COMPLETED SUCCESSFULLY
======================================================================
```

### Step 4: Check Server Logs

Watch the **TERMINAL/SERVER LOGS** where you ran `npm run dev`:

#### Expected Server Logs:

```
======================================================================
📧 /api/send-email - Email Request Received
======================================================================
Details: { 
  to: 'user@example.com',
  subject: '✅ Deposit Approved - eToro Trust Capital',
  htmlLength: 1234
}
Mailjet Config: { hasKey: true, hasSecret: true }
📤 Attempting to send via Mailjet...
From: { email: 'no-reply@cyphervault.online', name: 'eToro Trust Capital' }
✅ Mailjet API Response: { 
  status: 200,
  messageId: 'xxxxxxxxxxxxxxxx',
  msgStatus: 'success'
}
======================================================================
```

## Troubleshooting

### Problem 1: "Email Notifications: Disabled"

**Fix**: Add to `.env`:
```
VITE_EMAIL_NOTIFICATIONS_ENABLED=true
```

### Problem 2: "Mailjet API Key: Missing"

**Fix**: Add to `.env`:
```
MAILJET_API_KEY=c7f1dfd3ff5d2253ebc1899c99a7e879
MAILJET_API_SECRET=966a27785f3a4f08717fa48f25ae41dc
MAILJET_FROM_EMAIL=no-reply@cyphervault.online
MAILJET_FROM_NAME=eToro Trust Capital
ADMIN_EMAIL=cyphervault6@gmail.com
```

### Problem 3: "Unable to connect to http://localhost:3000"

**Fix**: Start the server:
```bash
npm run dev
```

### Problem 4: "Mailjet Credentials: Invalid"

**Fix**: Verify API key and secret in `.env`. They should match your Mailjet account.

### Problem 5: Console shows "Step 6" but no email arrives

**Possibilities:**
1. **Check spam folder** - Mailjet may flag first emails
2. **Wrong recipient email** - Verify user.email is correct
3. **Mailjet quota exceeded** - Check Mailjet dashboard
4. **Email template issue** - Check browser console for HTML errors

### Problem 6: Server logs show error at `/api/send-email`

**Common Errors:**

```
❌ Email Send Error: {
  message: 'Mailjet error',
  mailjetError: 'Invalid API credentials'
}
```

**Fix**: Verify Mailjet API key/secret are correct

```
❌ Email Send Error: {
  message: 'Mailjet error',
  mailjetError: 'From email not verified'
}
```

**Fix**: Verify `MAILJET_FROM_EMAIL` is registered in Mailjet account

## Critical Checklist

Before testing, verify ALL of these:

- [ ] Server running: `npm run dev`
- [ ] `.env` has `VITE_EMAIL_NOTIFICATIONS_ENABLED=true`
- [ ] `.env` has `MAILJET_API_KEY=xxx`
- [ ] `.env` has `MAILJET_API_SECRET=xxx`
- [ ] `.env` has `MAILJET_FROM_EMAIL=no-reply@...`
- [ ] Mailjet account is active and verified
- [ ] Recipient email address is valid

## How Email Flow Works

```
Admin clicks "Approve Deposit"
    ↓
Browser console shows approval logs (Step 1-6)
    ↓
sendDepositNotification() called
    ↓
fetch('/api/send-email') API call
    ↓
Server receives request (see server logs)
    ↓
Server calls Mailjet API
    ↓
Mailjet sends email to user inbox
    ↓
Email arrives in user's email (check spam folder!)
```

## Verify in Your Code

The three key files with logging:

1. **Frontend**: `src/pages/dashboard/AdminDashboard.tsx` (lines 681-765)
   - handleApproveDeposit function
   - Shows all approval steps with logging

2. **Email Service**: `src/utils/emailService.ts` (lines 20-70)
   - sendEmailNotification function
   - Checks if emails are enabled
   - Logs API calls

3. **Backend API**: `api/index.js` (lines 500-590)
   - POST /api/send-email endpoint
   - Verifies Mailjet credentials
   - Sends via Mailjet
   - Logs all steps and errors

## Next Steps if Still Not Working

1. **Test directly via cURL**:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1>"
  }'
```

2. **Check Mailjet Dashboard**:
   - Login to https://app.mailjet.com
   - Check "Sent Messages"
   - Look for your test emails
   - Check for bounce/error messages

3. **Test with Different Email**:
   - Try sending to Gmail, Outlook, etc.
   - Some email providers block first-time senders
   - Add Mailjet's domain to SPF/DKIM records if needed

---

**Status**: ✅ All logging in place. Follow the console logs to identify exactly where it fails.

**Key Point**: If you see "✅ Deposit approval email sent successfully" in browser console AND "✅ Mailjet API Response" in server logs, the email was sent successfully. Check your spam folder or Mailjet dashboard for delivery status.
