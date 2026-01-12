const Mailjet = require('node-mailjet');
const templates = require('./emailTemplates');

// Configuration
const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM || process.env.MAILJET_FROM_EMAIL || 'no-reply@ciphervault.online';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Cypher Vault';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cyphervault6@gmail.com';

// Initialize Mailjet Client
let mailjet = null;

if (MAILJET_API_KEY && MAILJET_API_SECRET) {
  mailjet = Mailjet.connect(MAILJET_API_KEY, MAILJET_API_SECRET);
  console.log('✅ Email Service: Mailjet Configured');
} else {
  console.warn('⚠️ Email Service: Mailjet API keys missing. Emails will not be sent.');
}

const sendEmail = async (to, subject, html) => {
  if (!mailjet) {
    console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
    return false;
  }

  // Create a plain text version from the HTML (basic stripping of tags)
  const textPart = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
                       .replace(/<[^>]+>/g, ' ')                        // Remove tags
                       .replace(/\s+/g, ' ')                            // Collapse whitespace
                       .trim();

  try {
    const result = await mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": EMAIL_FROM_ADDRESS,
              "Name": EMAIL_FROM_NAME
            },
            "ReplyTo": {
              "Email": ADMIN_EMAIL,
              "Name": "Support"
            },
            "To": [
              {
                "Email": to,
                "Name": to.split('@')[0] // Fallback name
              }
            ],
            "Subject": subject,
            "TextPart": textPart,
            "HTMLPart": html,
          }
        ]
      });
    
    console.log(`📧 Email sent to ${to}: ${JSON.stringify(result.body.Messages.map(m => m.Status))}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.statusCode, error.message);
    return false;
  }
};

const emailService = {
  async sendWelcome(email, name) {
    const html = templates.welcome(name);
    return await sendEmail(email, 'Welcome to Cypher Vault', html);
  },

  async sendDepositRequest(userEmail, userName, amount, method, currency, txHash, proofUrl) {
    // 1. Notify User
    const userHtml = templates.depositRequestUser(userName, amount, method, currency, txHash);
    await sendEmail(userEmail, 'Deposit Request Received', userHtml);
    
    // 2. Notify Admin
    const adminHtml = templates.depositRequestAdmin(userName, amount, `${method} ${currency || ''}`, txHash, proofUrl);
    await sendEmail(ADMIN_EMAIL, `New Deposit: $${amount} from ${userName}`, adminHtml);
  },

  async sendDepositStatus(userEmail, userName, amount, status, reason) {
    if (status === 'approved') {
      const html = templates.depositApproved(userName, amount);
      return await sendEmail(userEmail, 'Deposit Approved', html);
    } else {
      const html = templates.depositRejected(userName, amount, reason);
      return await sendEmail(userEmail, 'Deposit Rejected', html);
    }
  },

  async sendRoiCredit(userEmail, userName, planName, amount, newBalance) {
    const date = new Date().toLocaleString();
    const html = templates.roiCredited(userName, planName, amount, newBalance, date);
    return await sendEmail(userEmail, 'Daily Investment Return Credited', html);
  },

  async sendWithdrawalRequest(userEmail, userName, amount, method, wallet) {
    // 1. Notify User
    const userHtml = templates.withdrawalRequestUser(userName, amount, method, wallet);
    await sendEmail(userEmail, 'Withdrawal Request Submitted', userHtml);

    // 2. Notify Admin
    const adminHtml = templates.withdrawalRequestAdmin(userName, amount, method, wallet);
    await sendEmail(ADMIN_EMAIL, `New Withdrawal: $${amount} from ${userName}`, adminHtml);
  },

  async sendWithdrawalStatus(userEmail, userName, amount, status, reason) {
    const html = templates.withdrawalStatus(userName, amount, status, reason);
    return await sendEmail(userEmail, `Withdrawal ${status === 'approved' ? 'Processed' : 'Update'}`, html);
  }
};

module.exports = emailService;
