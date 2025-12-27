// Check Mailjet events and contact status for a given message ID or email
// Usage: node check_mailjet_events.js <messageId> [email]

const Mailjet = require('node-mailjet');

async function main() {
  try {
    const messageId = process.argv[2];
    const email = process.argv[3];
    if (!messageId && !email) {
      console.error('Usage: node check_mailjet_events.js <messageId> [email]');
      process.exit(1);
    }

    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    if (!apiKey || !apiSecret) {
      console.error('Missing MAILJET_API_KEY or MAILJET_API_SECRET in environment.');
      process.exit(1);
    }

    const mj = Mailjet.connect(apiKey, apiSecret);

    if (messageId) {
      console.log('Fetching events for MessageID:', messageId);
      try {
        // Mailjet events endpoint supports filtering by MessageID
        const res = await mj.get('event', { version: 'v3' }).request({ MessageID: messageId });
        console.log('Events:', JSON.stringify(res.body, null, 2));
      } catch (e) {
        console.error('Failed to fetch events:', e.statusCode || e);
        if (e && e.response && e.response.body) console.error('Events API response body:', JSON.stringify(e.response.body));
      }

      try {
        const msgs = await mj.get('message', { version: 'v3' }).request({ ID: messageId });
        console.log('Message resource:', JSON.stringify(msgs.body, null, 2));
      } catch (e) {
        console.error('Failed to fetch message resource:', e.statusCode || e);
      }
    }

    if (email) {
      console.log('Fetching contact for email:', email);
      try {
        const contact = await mj.get('contact', { version: 'v3' }).request({ Email: email });
        console.log('Contact resource:', JSON.stringify(contact.body, null, 2));
      } catch (e) {
        console.error('Failed to fetch contact resource:', e.statusCode || e);
      }

      try {
        const blocked = await mj.get('contactpermission', { version: 'v3' }).request({ ContactEmail: email });
        console.log('Contact permission resource:', JSON.stringify(blocked.body, null, 2));
      } catch (e) {
        // Not all accounts have contactpermission; ignore
      }

      try {
        const blacklist = await mj.get('contactblacklist', { version: 'v3' }).request({ Email: email });
        console.log('Contact blacklist resource:', JSON.stringify(blacklist.body, null, 2));
      } catch (e) {
        // ignore
      }
    }

    console.log('Done');
  } catch (err) {
    console.error('Error running check:', err);
    process.exit(1);
  }
}

main();
