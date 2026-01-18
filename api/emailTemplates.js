
const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #ecf0f1; margin: 0; padding: 0; }
  .container { max-width: 650px; margin: 15px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.12); }
  .header { background: linear-gradient(135deg, #0f172a 0%, #1a2637 100%); padding: 50px 20px; text-align: center; position: relative; }
  .header-logo { display: inline-block; margin-bottom: 15px; }
  .header-logo img { max-width: 180px; height: auto; border: 0; }
  .header h1 { margin: 15px 0 0 0; font-size: 28px; color: #f0b90b; font-weight: 600; letter-spacing: 0.5px; }
  .header-divider { height: 3px; background: linear-gradient(90deg, #f0b90b, rgba(240, 185, 11, 0.3)); margin-top: 15px; }
  .content { padding: 40px 30px; }
  .content h2 { color: #0f172a; font-size: 22px; margin-bottom: 15px; font-weight: 600; }
  .content p { color: #555; margin-bottom: 15px; line-height: 1.7; }
  .content ul { margin-left: 20px; margin-bottom: 20px; }
  .content ul li { margin-bottom: 8px; color: #555; }
  .footer { background: linear-gradient(135deg, #0f172a 0%, #1a2637 100%); color: #cbd5e1; padding: 25px 20px; text-align: center; font-size: 12px; border-top: 1px solid #1e293b; }
  .footer p { margin: 5px 0; }
  .button { display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #f0b90b, #ffd700); color: #0f172a; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; box-shadow: 0 2px 6px rgba(240, 185, 11, 0.3); transition: all 0.3s; }
  .button:hover { opacity: 0.9; }
  .info-table { width: 100%; border-collapse: collapse; margin: 25px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; }
  .info-table tr { border-bottom: 1px solid #e2e8f0; }
  .info-table tr:last-child { border-bottom: none; }
  .info-table td { padding: 14px 16px; }
  .info-table td:first-child { font-weight: 600; color: #0f172a; width: 40%; background: #f1f5f9; }
  .info-table td:last-child { color: #1f2937; font-weight: 500; }
  .highlight { color: #f0b90b; font-weight: 700; }
  .status-active { color: #10b981; font-weight: 600; }
  .status-pending { color: #f59e0b; font-weight: 600; }
  .status-rejected { color: #ef4444; font-weight: 600; }
  .section { margin-bottom: 25px; }
  .center { text-align: center; }
  .small-text { font-size: 13px; color: #9ca3af; }
`;

const wrapTemplate = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">
        <a href="https://cyphervault.vercel.app" target="_blank" style="text-decoration: none;">
          <img src="https://cyphervault.vercel.app/images/ciphervaultlogobig.png" alt="Cypher Vault" style="display: block; max-width: 100%; height: auto; border: 0;" />
        </a>
      </div>
      <h1>${title}</h1>
      <div class="header-divider"></div>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Cypher Vault. All rights reserved.</p>
      <p class="small-text">This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

export default {
  welcome: (name) => wrapTemplate('Welcome to Cypher Vault', `
    <h2>Welcome, ${name}!</h2>
    <p>Thank you for joining Cypher Vault. We are thrilled to have you on board.</p>
    <p>Your account has been successfully created. You can now access your dashboard, explore our investment plans, and start your journey to financial freedom.</p>
    <p><strong>Next Steps:</strong></p>
    <ul>
      <li>Complete your KYC verification.</li>
      <li>Explore our tailored investment plans.</li>
      <li>Make your first deposit.</li>
    </ul>
    <center><a href="https://cyphervault.vercel.app/login" class="button">Login to Dashboard</a></center>
  `),

  depositRequestUser: (name, amount, method, currency, txHash) => wrapTemplate('Deposit Confirmation', `
    <h2>Deposit Request Received</h2>
    <p>Hello ${name},</p>
    <p>We have received your deposit request. It is currently <strong>Pending</strong> waiting for blockchain confirmation and admin approval.</p>
    <table class="info-table">
      <tr><td>Amount:</td><td>$${amount}</td></tr>
      <tr><td>Method:</td><td>${method} ${currency ? `(${currency})` : ''}</td></tr>
      <tr><td>Transaction Hash:</td><td><small>${txHash.substring(0, 20)}...</small></td></tr>
      <tr><td>Status:</td><td>Pending</td></tr>
    </table>
    <p>You will receive another email once your deposit is approved.</p>
  `),

  depositRequestAdmin: (userName, amount, method, txHash, proofUrl) => wrapTemplate('New Deposit Request', `
    <h2>New Deposit Action Required</h2>
    <p>A new deposit request has been submitted by <strong>${userName}</strong>.</p>
    <table class="info-table">
      <tr><td>User:</td><td>${userName}</td></tr>
      <tr><td>Amount:</td><td>$${amount}</td></tr>
      <tr><td>Method:</td><td>${method}</td></tr>
      <tr><td>Tx Hash:</td><td><small>${txHash}</small></td></tr>
    </table>
    <p>Please log in to the admin panel to review and approve/reject this request.</p>
    ${proofUrl ? `<p><a href="${proofUrl}" target="_blank">View Payment Proof</a></p>` : ''}
    <center><a href="https://cyphervault.vercel.app/admin" class="button">Go to Admin Panel</a></center>
  `),

  depositApproved: (name, amount) => wrapTemplate('Deposit Approved', `
    <div class="section">
      <p>Hello <strong>${name}</strong>,</p>
      <p>✅ Great news! Your deposit of <span class="highlight">$${amount}</span> has been successfully approved and credited to your account balance.</p>
    </div>
    
    <div class="section">
      <h2>Transaction Details</h2>
      <table class="info-table">
        <tr>
          <td>Amount Deposited</td>
          <td><span class="highlight">$${amount}</span></td>
        </tr>
        <tr>
          <td>Status</td>
          <td><span class="status-active">✓ Approved</span></td>
        </tr>
        <tr>
          <td>Processed Date</td>
          <td>${new Date().toLocaleDateString()}</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <p>You can now use these funds to purchase an investment plan and start earning daily returns.</p>
      <div class="center"><a href="https://cyphervault.vercel.app/dashboard" class="button">View Balance</a></div>
    </div>
  `),
  
  depositRejected: (name, amount, reason) => wrapTemplate('Deposit Rejected', `
    <h2>Deposit Rejected</h2>
    <p>Hello ${name},</p>
    <p>We regret to inform you that your deposit request for <span class="highlight">$${amount}</span> has been rejected.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>If you believe this is an error, please contact support.</p>
  `),

  roiCredited: (name, planName, amount, newBalance, date) => wrapTemplate('Daily ROI Credited', `
    <div class="section">
      <p>Hello <strong>${name}</strong>,</p>
      <p>💰 Your daily ROI has been credited! Keep your investment active to continue earning.</p>
    </div>
    
    <div class="section">
      <h2>Earnings Summary</h2>
      <table class="info-table">
        <tr>
          <td>Amount Credited</td>
          <td><span class="highlight">+$${amount}</span></td>
        </tr>
        <tr>
          <td>Plan Name</td>
          <td>${planName}</td>
        </tr>
        <tr>
          <td>Credited Date</td>
          <td>${date}</td>
        </tr>
        <tr>
          <td>Current Balance</td>
          <td><strong>$${newBalance}</strong></td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <p>Your investment is performing excellently. Continue to monitor your portfolio and watch your wealth grow!</p>
    </div>
  `),

  withdrawalRequestUser: (name, amount, method, wallet) => wrapTemplate('Withdrawal Request Submitted', `
    <h2>Withdrawal Request Pending</h2>
    <p>Hello ${name},</p>
    <p>Your withdrawal request has been received and is being processed.</p>
    <table class="info-table">
      <tr><td>Amount:</td><td>$${amount}</td></tr>
      <tr><td>Method:</td><td>${method}</td></tr>
      <tr><td>Destination:</td><td><small>${wallet}</small></td></tr>
      <tr><td>Status:</td><td>Pending</td></tr>
    </table>
    <p>Processing times may vary. We will notify you once the funds are sent.</p>
  `),

  withdrawalRequestAdmin: (userName, amount, method, wallet) => wrapTemplate('New Withdrawal Request', `
    <h2>New Withdrawal Request</h2>
    <p>User <strong>${userName}</strong> has requested a withdrawal.</p>
    <table class="info-table">
      <tr><td>User:</td><td>${userName}</td></tr>
      <tr><td>Amount:</td><td>$${amount}</td></tr>
      <tr><td>Method:</td><td>${method}</td></tr>
      <tr><td>Wallet:</td><td><small>${wallet}</small></td></tr>
    </table>
    <center><a href="https://cyphervault.vercel.app/admin" class="button">Review Request</a></center>
  `),

  withdrawalStatus: (name, amount, status, reason) => wrapTemplate(`Withdrawal ${status}`, `
    <h2>Withdrawal Update</h2>
    <p>Hello ${name},</p>
    <p>Your withdrawal request for <strong>$${amount}</strong> has been <strong>${status.toUpperCase()}</strong>.</p>
    ${status === 'rejected' && reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    ${status === 'approved' ? '<p>The funds should appear in your wallet shortly.</p>' : ''}
  `),


  investmentCreated: (name, plan, capital, roi, duration) => wrapTemplate('Investment Created', `
    <h2>Investment Confirmed!</h2>
    <p>Hello ${name},</p>
    <p>Success! You have purchased the <strong>${plan}</strong> investment plan.</p>
    <table class="info-table">
      <tr><td>Plan:</td><td>${plan}</td></tr>
      <tr><td>Capital Invested:</td><td class="highlight">$${capital}</td></tr>
      <tr><td>Daily ROI:</td><td>${roi}%</td></tr>
      <tr><td>Duration:</td><td>${duration} Days</td></tr>
    </table>
    <p>Your investment is now active and will start generating returns every 24 hours.</p>
    <center><a href="https://cyphervault.vercel.app/dashboard" class="button">Track Investment</a></center>
  `),

  investmentSubmitted: (name, plan, capital, roi, duration) => wrapTemplate('Investment Submitted', `
    <div class="section">
      <p>Hello <strong>${name}</strong>,</p>
      <p>📝 Your request to purchase the <strong>${plan}</strong> investment plan has been received and is currently <span class="status-pending">pending admin approval</span>.</p>
    </div>
    
    <div class="section">
      <h2>Investment Details</h2>
      <table class="info-table">
        <tr>
          <td>Plan Name</td>
          <td>${plan}</td>
        </tr>
        <tr>
          <td>Capital Amount</td>
          <td><span class="highlight">$${capital}</span></td>
        </tr>
        <tr>
          <td>Daily ROI</td>
          <td><strong>${roi}%</strong></td>
        </tr>
        <tr>
          <td>Duration</td>
          <td>${duration} Days</td>
        </tr>
        <tr>
          <td>Status</td>
          <td><span class="status-pending">⏳ Pending Approval</span></td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <p>You will receive another email once your investment is approved and activated. In the meantime, you can monitor your application in your dashboard.</p>
      <div class="center"><a href="https://cyphervault.vercel.app/dashboard" class="button">View My Investments</a></div>
    </div>
  `),

  investmentApproved: (name, details) => wrapTemplate('Investment Approved', `
    <div class="section">
      <p>Hello <strong>${name}</strong>,</p>
      <p>🎉 Great news! Your investment has been reviewed and is now <span class="status-active">ACTIVE</span>.</p>
    </div>
    
    <div class="section">
      <h2>Investment Details</h2>
      <table class="info-table">
        <tr>
          <td>Investment ID</td>
          <td><strong>${details.id}</strong></td>
        </tr>
        <tr>
          <td>Plan Name</td>
          <td>${details.plan}</td>
        </tr>
        <tr>
          <td>Amount Invested</td>
          <td><span class="highlight">$${Number(details.amount || 0).toLocaleString()}</span></td>
        </tr>
        <tr>
          <td>Start Date</td>
          <td>${details.startDate}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td><span class="status-active">✓ ${details.status || 'Active'}</span></td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <p>Your investment is now live and will begin generating <strong>daily returns</strong> based on your selected plan. Track your performance anytime from your dashboard.</p>
      <div class="center">
        <a href="https://cyphervault.vercel.app/dashboard" class="button">View My Investment</a>
      </div>
    </div>
  `),

  withdrawalApproved: (name, amount, method, wallet) => wrapTemplate('Withdrawal Approved', `
    <div class="section">
      <p>Hello <strong>${name}</strong>,</p>
      <p>✅ Your withdrawal request for <span class="highlight">$${amount}</span> has been approved and processed.</p>
    </div>

    <div class="section">
      <h2>Withdrawal Details</h2>
      <table class="info-table">
        <tr>
          <td>Amount</td>
          <td><span class="highlight">$${amount}</span></td>
        </tr>
        <tr>
          <td>Payment Method</td>
          <td>${method}</td>
        </tr>
        <tr>
          <td>Destination</td>
          <td><small>${wallet || 'N/A'}</small></td>
        </tr>
        <tr>
          <td>Status</td>
          <td><span class="status-active">✓ Approved</span></td>
        </tr>
      </table>
    </div>

    <div class="section">
      <p>The funds should reflect in your account shortly depending on the network speed and payment method used.</p>
    </div>
  `)
};
