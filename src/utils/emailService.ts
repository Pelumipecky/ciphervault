// Email Notification Service
// Uses EmailJS for free email notifications
// Setup: Create account at https://www.emailjs.com/ and get your credentials

interface EmailNotification {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// EmailJS Configuration - Uses environment variables
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ciphervault',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_notification',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY',
};

// Alternative: Using a simple backend API endpoint
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

    // Method 1: Using EmailJS (recommended for frontend-only apps)
    if (typeof window !== 'undefined' && (window as any).emailjs) {
      const emailjs = (window as any).emailjs;
      
      const templateParams = {
        to_email: notification.to_email,
        to_name: notification.to_name,
        subject: notification.subject,
        message: notification.message,
        notification_type: notification.type,
        app_name: 'Cypher Vault',
        year: new Date().getFullYear(),
      };

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('✅ Email sent via EmailJS to:', notification.to_email);
      return true;
    }

    // Method 2: Using custom backend API endpoint
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
 * Generate HTML email template
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${notification.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f0b90b 0%, #d19e09 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: bold;">
                    ${iconMap[notification.type]} Cypher Vault
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #f8fafc; font-size: 20px;">
                    Hello ${notification.to_name},
                  </h2>
                  
                  <div style="background-color: rgba(${notification.type === 'success' ? '16, 185, 129' : notification.type === 'error' ? '239, 68, 68' : notification.type === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.1); border-left: 4px solid ${colorMap[notification.type]}; padding: 20px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0; color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                      ${notification.message}
                    </p>
                  </div>
                  
                  <p style="margin: 30px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                    If you have any questions or need assistance, please don't hesitate to contact our support team.
                  </p>
                  
                  <div style="text-align: center; margin-top: 30px;">
                      <a href="${import.meta.env.VITE_APP_URL || 'https://ciphervault.com'}" style="display: inline-block; background: linear-gradient(135deg, #f0b90b 0%, #d19e09 100%); color: #0f172a; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                      Visit Dashboard
                    </a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0f172a; padding: 20px 30px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px;">
                    © ${new Date().getFullYear()} Cypher Vault. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #475569; font-size: 11px;">
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

/**
 * Load EmailJS library dynamically
 */
export function initializeEmailJS(): void {
  if (typeof window === 'undefined') return;
  
  // Check if EmailJS is already loaded
  if ((window as any).emailjs) return;

  // Only load if email notifications are enabled
  const emailEnabled = import.meta.env.VITE_EMAIL_NOTIFICATIONS_ENABLED === 'true';
  if (!emailEnabled) return;

  // Load EmailJS SDK
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  script.async = true;
  script.onload = () => {
    console.log('📧 EmailJS SDK loaded successfully');
  };
  document.head.appendChild(script);
}
