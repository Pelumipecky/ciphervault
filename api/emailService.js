import Mailjet from 'node-mailjet';
import templates from './emailTemplates.js';

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
    const status = error?.statusCode || error?.response?.status;
    const detail = error?.response?.body || error?.message || error;
    console.error(`❌ Error sending email to ${to}:`, status, detail);
    return false;
  }
};

const emailService = {
  async sendInvestmentSubmitted(userEmail, userName, plan, capital, roi, duration) {
    const html = templates.investmentSubmitted(userName, plan, capital, roi, duration);
    return await (async function(to, subject, html) {
      if (!mailjet) {
        console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
        return false;
      }
      // Create a plain text version from the HTML (basic stripping of tags)
      const textPart = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                           .replace(/<[^>]+>/g, ' ')
                           .replace(/\s+/g, ' ')
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
                    "Name": to.split('@')[0]
                  }
                ],
                "Subject": subject,
                "TextPart": textPart,
                "HTMLPart": html,
              }
            ]
          });
        console.log(`📧 Investment Submitted email sent to ${to}: ${JSON.stringify(result.body.Messages.map(m => m.Status))}`);
        return true;
      } catch (error) {
        const status = error?.statusCode || error?.response?.status;
        const detail = error?.response?.body || error?.message || error;
        console.error(`❌ Error sending Investment Submitted email to ${to}:`, status, detail);
        return false;
      }
    })(userEmail, 'Investment Submitted', html);
  },
  async sendWelcome(email, name) {
    const html = templates.welcome(name);
    return await sendEmail(email, 'Welcome to Cypher Vault', html);
  },

  async sendDepositRequest(userEmail, userName, amount, method, currency, txHash, proofUrl) {
    console.log('[DepositEmail] sendDepositRequest called with:', { userEmail, userName, amount, method, currency, txHash, proofUrl });
    // 1. Notify User
    const userHtml = templates.depositRequestUser(userName, amount, method, currency, txHash);
    const userResult = await sendEmail(userEmail, 'Deposit Request Received', userHtml);
    console.log('[DepositEmail] User email result:', userResult);
    
    // 2. Notify Admin
    const adminHtml = templates.depositRequestAdmin(userName, amount, `${method} ${currency || ''}`, txHash, proofUrl);
    const adminResult = await sendEmail(ADMIN_EMAIL, `New Deposit: $${amount} from ${userName}`, adminHtml);
    console.log('[DepositEmail] Admin email result:', adminResult);
  },

  async sendDepositStatus(userEmail, userName, amount, status, reason) {
    console.log('[DepositEmail] sendDepositStatus called with:', { userEmail, userName, amount, status, reason });
    if (status === 'approved') {
      const html = templates.depositApproved(userName, amount);
      const result = await sendEmail(userEmail, 'Deposit Approved', html);
      console.log('[DepositEmail] Approved email result:', result);
      return result;
    } else {
      const html = templates.depositRejected(userName, amount, reason);
      const result = await sendEmail(userEmail, 'Deposit Rejected', html);
      console.log('[DepositEmail] Rejected email result:', result);
      return result;
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
  },

  async sendInvestmentCreated(userEmail, userName, plan, capital, roi, duration) {
    const html = templates.investmentCreated(userName, plan, capital, roi, duration);
    return await sendEmail(userEmail, 'Investment Activated Successfully', html);
  },

  async sendInvestmentApproved(userEmail, userName, details) {
    const html = templates.investmentApproved(userName, details);
    return await sendEmail(userEmail, 'Investment Approved', html);
  },

  async sendWithdrawalApproved(userEmail, userName, amount, method, wallet) {
    const html = templates.withdrawalApproved(userName, amount, method, wallet);
    return await sendEmail(userEmail, 'Withdrawal Approved', html);
  },

  async sendKycSubmitted(userEmail, userName) {
    const html = templates.kycSubmitted(userName);
    return await sendEmail(userEmail, 'KYC Verification Submitted', html);
  },

  async sendKycApproved(userEmail, userName) {
    const html = templates.kycApproved(userName);
    return await sendEmail(userEmail, 'KYC Verification Approved', html);
  },

  async sendKycRejected(userEmail, userName, reason) {
    const html = templates.kycRejected(userName, reason);
    return await sendEmail(userEmail, 'KYC Verification Rejected', html);
  }
};

export default emailService;
