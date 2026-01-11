// Email Notification Service (server-side Mailjet)
// Sends notifications via server API endpoint which uses Mailjet or SMTP

interface EmailNotification {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// Backend endpoint used to send email (server handles Mailjet/SMTP)
const API_EMAIL_ENDPOINT = import.meta.env.VITE_EMAIL_API_ENDPOINT || '/api/send-email';

/**
 * Send email notification to user
 */
export async function sendEmailNotification(notification: EmailNotification): Promise<boolean> {
  try {
    // Check if email notifications are enabled
    const emailEnabled = import.meta.env.VITE_EMAIL_NOTIFICATIONS_ENABLED === 'true';
    
    if (!emailEnabled) {
      console.log('📧 Email notifications disabled. Would have sent:', notification);
      return true; // Return success but don't actually send
    }

    // Use server-side API endpoint (server sends via Mailjet or SMTP)
    const response = await fetch(API_EMAIL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: notification.to_email,
        subject: notification.subject,
        html: generateEmailHTML(notification),
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }

    console.log('✅ Email sent via API to:', notification.to_email);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    return false;
  }
}

/**
 * Send investment notification email
 */
export async function sendInvestmentNotification(
  userEmail: string,
  userName: string,
  status: 'approved' | 'rejected' | 'pending',
  amount: number,
  plan: string
): Promise<boolean> {
  const statusMessages = {
    approved: {
      subject: '✅ Investment Approved - Cypher Vault',
      message: `Great news! Your investment of $${amount.toLocaleString()} in the ${plan} plan has been approved and is now active. Your earnings will start accumulating immediately.`,
      type: 'success' as const,
    },
    rejected: {
      subject: '❌ Investment Update - Cypher Vault',
      message: `Your investment request of $${amount.toLocaleString()} for the ${plan} plan has been reviewed. Please contact support for more details.`,
      type: 'error' as const,
    },
    pending: {
      subject: '⏳ Investment Received - Cypher Vault',
      message: `We've received your investment request of $${amount.toLocaleString()} for the ${plan} plan. Our team is reviewing it and will notify you once processed.`,
      type: 'info' as const,
    },
  };

  const config = statusMessages[status];
  
  return sendEmailNotification({
    to_email: userEmail,
    to_name: userName,
    subject: config.subject,
    message: config.message,
    type: config.type,
  });
}

/**
 * Send withdrawal notification email
 */
export async function sendWithdrawalNotification(
  userEmail: string,
  userName: string,
  status: 'approved' | 'rejected' | 'pending',
  amount: number,
  method: string
): Promise<boolean> {
  const statusMessages = {
    approved: {
      subject: '✅ Withdrawal Approved - Cypher Vault',
      message: `Your withdrawal request of $${amount.toLocaleString()} via ${method} has been approved and processed. Funds should arrive within 1-3 business days.`,
      type: 'success' as const,
    },
    rejected: {
      subject: '❌ Withdrawal Update - Cypher Vault',
      message: `Your withdrawal request of $${amount.toLocaleString()} could not be processed. Please contact support for assistance.`,
      type: 'error' as const,
    },
    pending: {
      subject: '⏳ Withdrawal Request Received - Cypher Vault',
      message: `We've received your withdrawal request of $${amount.toLocaleString()} via ${method}. Our team is processing it and will notify you once completed.`,
      type: 'info' as const,
    },
  };

  const config = statusMessages[status];
  
  return sendEmailNotification({
    to_email: userEmail,
    to_name: userName,
    subject: config.subject,
    message: config.message,
    type: config.type,
  });
}

/**
 * Send KYC notification email
 */
export async function sendKYCNotification(
  userEmail: string,
  userName: string,
  status: 'approved' | 'rejected' | 'pending'
): Promise<boolean> {
  const statusMessages = {
    approved: {
      subject: '✅ KYC Verified - Cypher Vault',
      message: `Congratulations! Your identity verification has been completed successfully. You now have full access to all Cypher Vault features.`,
      type: 'success' as const,
    },
    rejected: {
      subject: '❌ KYC Verification Update - Cypher Vault',
      message: `Your KYC verification could not be completed. Please resubmit your documents or contact support for assistance.`,
      type: 'error' as const,
    },
    pending: {
      subject: '⏳ KYC Submitted - Cypher Vault',
      message: `We've received your KYC documents and are currently reviewing them. This typically takes 24-48 hours. We'll notify you once complete.`,
      type: 'info' as const,
    },
  };

  const config = statusMessages[status];
  
  return sendEmailNotification({
    to_email: userEmail,
    to_name: userName,
    subject: config.subject,
    message: config.message,
    type: config.type,
  });
}

/**
 * Send loan notification email
 */
export async function sendLoanNotification(
  userEmail: string,
  userName: string,
  status: 'approved' | 'rejected' | 'pending',
  amount: number,
  duration: number
): Promise<boolean> {
  const statusMessages = {
    approved: {
      subject: '✅ Loan Approved - Cypher Vault',
      message: `Great news! Your loan request of $${amount.toLocaleString()} for ${duration} days has been approved. The funds will be credited to your account shortly.`,
      type: 'success' as const,
    },
    rejected: {
      subject: '❌ Loan Application Update - Cypher Vault',
      message: `Your loan request of $${amount.toLocaleString()} could not be approved at this time. Please contact support for more information.`,
      type: 'error' as const,
    },
    pending: {
      subject: '⏳ Loan Application Received - Cypher Vault',
      message: `We've received your loan request of $${amount.toLocaleString()} for ${duration} days. Our team is reviewing your application and will notify you soon.`,
      type: 'info' as const,
    },
  };

  const config = statusMessages[status];
  
  return sendEmailNotification({
    to_email: userEmail,
    to_name: userName,
    subject: config.subject,
    message: config.message,
    type: config.type,
  });
}

/**
 * Send balance update notification email
 */
export async function sendBalanceUpdateNotification(
  userEmail: string,
  userName: string,
  newBalance: number,
  previousBalance: number
): Promise<boolean> {
  const difference = newBalance - previousBalance;
  const changeType = difference > 0 ? 'increased' : 'decreased';
  
  return sendEmailNotification({
    to_email: userEmail,
    to_name: userName,
    subject: '💰 Balance Update - Cypher Vault',
    message: `Your account balance has been ${changeType} by $${Math.abs(difference).toLocaleString()}. New balance: $${newBalance.toLocaleString()}`,
    type: 'info',
  });
}

/**
 * Send daily ROI notification email
 */
export async function sendROINotification(
  userEmail: string,
  userName: string,
  roiAmount: number,
  investmentPlan: string,
  currentBalance: number,
  totalEarnings: number
): Promise<boolean> {
  return sendEmailNotification({
    to_email: userEmail,
    to_name: userName,
    subject: '💰 Daily ROI Credited - Cypher Vault',
    message: `Great news! Your daily ROI of $${roiAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} from the ${investmentPlan} has been credited to your account. Total earnings so far: $${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Current balance: $${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    type: 'success',
  });
}

/**
 * Send investment completion notification email
 */
export async function sendInvestmentCompletionNotification(
  userEmail: string,
  userName: string,
  investmentPlan: string,
  totalROI: number,
  bonusAmount: number,
  currentBalance: number
): Promise<boolean> {
  const totalEarnings = totalROI + bonusAmount;
  
  return sendEmailNotification({
    to_email: userEmail,
    to_name: userName,
    subject: '🎉 Investment Plan Completed - Cypher Vault',
    message: `Congratulations! Your ${investmentPlan} investment has completed successfully. Total ROI earned: $${totalROI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Bonus credited: $${bonusAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Total earnings: $${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Your new balance: $${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    type: 'success',
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
): Promise<boolean> {
  return sendEmailNotification({
    to_email: userEmail,
    to_name: userName,
    subject: '🎉 Welcome to Cypher Vault!',
    message: `Welcome to Cypher Vault, ${userName}! We're excited to have you join our investment platform. Start exploring our investment plans and grow your wealth with us.`,
    type: 'success',
  });
}

/**
 * Generate HTML email template with brand styling matching the website
 */
function generateEmailHTML(notification: EmailNotification): string {
  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const colorMap = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  // Website color scheme
  const PRIMARY_COLOR = '#0f172a';      // Dark blue - primary background
  const SECONDARY_COLOR = '#1e293b';    // Slightly lighter blue
  const ACCENT_COLOR = '#f0b90b';       // Gold/Yellow accent
  const TEXT_PRIMARY = '#f8fafc';       // Light text
  const TEXT_SECONDARY = '#cbd5e1';     // Dimmer text
  const LOGO_URL = 'https://raw.githubusercontent.com/yourusername/yourrepo/main/public/images/ciphervaultlogobig.svg';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${notification.subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          background-color: ${PRIMARY_COLOR};
          line-height: 1.6;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${PRIMARY_COLOR};">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${PRIMARY_COLOR}; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" maxwidth="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: ${SECONDARY_COLOR}; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, ${ACCENT_COLOR} 0%, #d19e09 100%); padding: 40px 30px; text-align: center; border-bottom: 3px solid ${ACCENT_COLOR};">
                  <img src="${LOGO_URL}" alt="Cypher Vault" style="width: 180px; height: auto; margin: 0; display: block; margin-bottom: 15px;" />
                  <h1 style="margin: 0; color: ${PRIMARY_COLOR}; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">
                    ${iconMap[notification.type]} ${notification.subject.split(' - ')[0]}
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px; background-color: ${SECONDARY_COLOR};">
                  <h2 style="margin: 0 0 15px 0; color: ${TEXT_PRIMARY}; font-size: 22px; font-weight: 600;">
                    Hello ${notification.to_name},
                  </h2>
                  
                  <!-- Message Box with Accent Border -->
                  <div style="background: linear-gradient(135deg, rgba(240, 185, 11, 0.05) 0%, rgba(240, 185, 11, 0.02) 100%); border-left: 4px solid ${ACCENT_COLOR}; border-radius: 8px; padding: 25px; margin: 25px 0; border: 1px solid rgba(240, 185, 11, 0.2);">
                    <p style="margin: 0; color: ${TEXT_PRIMARY}; font-size: 16px; line-height: 1.8;">
                      ${notification.message}
                    </p>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${import.meta.env.VITE_APP_URL || 'https://ciphervault.com'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, ${ACCENT_COLOR} 0%, #d19e09 100%); color: ${PRIMARY_COLOR}; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(240, 185, 11, 0.3);">
                      Go to Dashboard
                    </a>
                  </div>

                  <p style="margin: 30px 0 0 0; color: ${TEXT_SECONDARY}; font-size: 14px; line-height: 1.8;">
                    If you have any questions or need support, feel free to reach out to our team. We're here to help!
                  </p>

                  <p style="margin: 10px 0 0 0; color: ${TEXT_SECONDARY}; font-size: 13px;">
                    For support, email <a href="mailto:${import.meta.env.VITE_SUPPORT_EMAIL || 'Cyphervault6@gmail.com'}" style="color: ${ACCENT_COLOR}; text-decoration: none;">${import.meta.env.VITE_SUPPORT_EMAIL || 'Cyphervault6@gmail.com'}</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: ${PRIMARY_COLOR}; padding: 30px; text-align: center; border-top: 1px solid rgba(240, 185, 11, 0.1);">
                  <!-- Social Links -->
                  <div style="margin: 0 0 20px 0;">
                    <a href="https://twitter.com/ciphervault" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                      <span style="color: ${ACCENT_COLOR}; font-size: 18px;">𝕏</span>
                    </a>
                    <a href="https://discord.gg/ciphervault" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                      <span style="color: ${ACCENT_COLOR}; font-size: 18px;">💬</span>
                    </a>
                    <a href="https://telegram.me/ciphervault" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                      <span style="color: ${ACCENT_COLOR}; font-size: 18px;">✈️</span>
                    </a>
                  </div>

                  <p style="margin: 0 0 10px 0; color: ${TEXT_SECONDARY}; font-size: 13px;">
                    © ${new Date().getFullYear()} Cypher Vault. All rights reserved.
                  </p>
                  <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 12px;">
                    This is an automated notification. Please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
