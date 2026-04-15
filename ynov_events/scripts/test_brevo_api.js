const { sendConfirmationEmail } = require('../src/utils/mailer');
require('dotenv').config();

async function testApi() {
    const mockParticipant = {
        id: 999,
        prenom: 'Test',
        nom: 'User',
        email: 'ahmedrachid.bangoura@ynov.com',
        qrCodeToken: 'test-token-123',
        categorieBadge: 'TESTER',
        entreprise: 'Yevents Lab'
    };

    console.log('Testing Brevo API Sending...');
    try {
        await sendConfirmationEmail(mockParticipant);
        console.log('TEST SUCCESS!');
    } catch (error) {
        console.error('TEST FAILED:', error);
    }
}

testApi();
