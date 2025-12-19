// Test email configuration
console.log('=== Email Notification Status Check ===\n');

// Check environment variables
const emailEnabled = process.env.VITE_EMAIL_NOTIFICATIONS_ENABLED === 'true';
const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;

console.log('📧 Email Notifications Enabled:', emailEnabled ? '✅ YES' : '❌ NO');
console.log('🔧 EmailJS Service ID:', serviceId || 'Not configured');
console.log('📝 EmailJS Template ID:', templateId || 'Not configured');
console.log('🔑 EmailJS Public Key:', publicKey && publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY' ? '✅ Configured' : '❌ Not configured');

console.log('\n=== Current Status ===');
if (!emailEnabled) {
  console.log('❌ Email notifications are DISABLED');
  console.log('💡 To enable: Set VITE_EMAIL_NOTIFICATIONS_ENABLED=true in .env');
} else if (!serviceId || !templateId || !publicKey || publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
  console.log('❌ Email notifications are ENABLED but not properly configured');
  console.log('💡 Setup required: Get EmailJS account at https://www.emailjs.com/');
} else {
  console.log('✅ Email notifications should be WORKING');
}

console.log('\n=== Setup Instructions ===');
console.log('1. Create free EmailJS account: https://www.emailjs.com/');
console.log('2. Add email service (Gmail/Outlook)');
console.log('3. Create email template');
console.log('4. Update .env file with your credentials');
console.log('5. Set VITE_EMAIL_NOTIFICATIONS_ENABLED=true');