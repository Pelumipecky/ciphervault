// Check Mailjet message details by ID
// Usage: node check_mailjet_message.js <messageId>

const Mailjet = require('node-mailjet');

async function main() {
  try {
    const id = process.argv[2];
    if (!id) {
      console.error('Usage: node check_mailjet_message.js <messageId>');
      process.exit(1);
    }

    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    if (!apiKey || !apiSecret) {
      console.error('Missing MAILJET_API_KEY or MAILJET_API_SECRET in environment.');
      process.exit(1);
    }

    const mj = Mailjet.connect(apiKey, apiSecret);
    const res = await mj.get('message', { version: 'v3' }).request({ ID: id });
    console.log(JSON.stringify(res.body, null, 2));
  } catch (err) {
    console.error('Error fetching message:', err.statusCode || err);
    process.exit(1);
  }
}

main();
