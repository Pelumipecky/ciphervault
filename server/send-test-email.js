
require('dotenv').config();
const emailService = require('./emailService');

const TEST_EMAIL = 'cyphervault6@gmail.com'; // User provided support email

async function runTest() {
    console.log(`Starting Email Test using Mailjet...`);
    console.log(`Target Email: ${TEST_EMAIL}`);
    console.log(`Admin Email (ENV): ${process.env.ADMIN_EMAIL}`);
    console.log(`Using credentials: API ${process.env.MAILJET_API_KEY ? 'Present' : 'Missing'}, SECRET ${process.env.MAILJET_API_SECRET ? 'Present' : 'Missing'}`);

    // Test 1: Welcome Email (User view)
    console.log('\n--- Test 1: Sending Welcome Email ---');
    try {
        const resultWelcome = await emailService.sendWelcome(TEST_EMAIL, 'Support Team');
        console.log(`Welcome Email Result: ${resultWelcome ? 'SUCCESS' : 'FAILED'}`);
    } catch (e) {
        console.error('Welcome Email Error:', e);
    }

    // Test 2: Admin Notification (Triggered by deposit)
    // This tests if ADMIN_EMAIL is correctly set to cyphervault6@gmail.com
    console.log('\n--- Test 2: Sending Admin Notification (via Deposit Request) ---');
    try {
        // We simulate a deposit from a "Test User", the admin notification should go to cyphervault6@gmail.com
        // Note: The "user" notification will also go to TEST_EMAIL here because I'm passing it as the user email.
        await emailService.sendDepositRequest(
            TEST_EMAIL,          // userEmail
            'Test User',         // userName
            5000,                // amount
            'USDT',              // method
            'TRC20',             // currency
            '0xTestHash123',     // txHash
            'http://example.com/proof.jpg' // proofUrl
        );
        console.log('Deposit Request Triggered (Check inbox for User AND Admin emails)');
    } catch (e) {
        console.error('Deposit Email Error:', e);
    }
}

runTest();
