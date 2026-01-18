require('dotenv').config();
const Mailjet = require('node-mailjet');
const emailTemplates = require('./emailTemplates');

const EMAIL_FROM_ADDRESS = process.env.MAILJET_FROM_EMAIL || 'no-reply@cyphervault.online';
const EMAIL_FROM_NAME = process.env.MAILJET_FROM_NAME || 'Cypher Vault';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@cyphervault.online';

let mailjet = null;
if (process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET) {
  mailjet = Mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
}

const templates = emailTemplates;

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
    console.log('[InvestmentEmail] sendInvestmentSubmitted called with:', { userEmail, userName, plan, capital, roi, duration });
    if (!mailjet) {
      console.log(`[Mock Email] To: ${userEmail} | Subject: Investment Submitted`);
      return false;
    }
    const html = templates.investmentSubmitted(userName, plan, capital, roi, duration);
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
              "To": [
                {
                  "Email": userEmail,
                  "Name": userName || 'Investor'
                }
              ],
              "Subject": 'Investment Submitted',
              "TextPart": textPart,
              "HTMLPart": html,
            }
          ]
        });
      console.log(`📧 Investment Submitted email sent to ${userEmail}: ${JSON.stringify(result.body.Messages.map(m => m.Status))}`);
      return true;
    } catch (error) {
      const status = error?.statusCode || error?.response?.status;
      const detail = error?.response?.body || error?.message || error;
      console.error(`❌ Error sending Investment Submitted email to ${userEmail}:`, status, detail);
      return false;
    }
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

module.exports = emailService;
