const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: process.env.MAIL_PORT == '465',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000
});

async function sendTestMail() {
    const testEmail = 'ahmedrachid.bangoura@ynov.com'; // User's email from the DB entry
    console.log(`Sending test email to ${testEmail}...`);
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: testEmail,
            subject: 'Test Email from Yevents',
            text: 'This is a test email to verify SMTP configuration.',
            html: '<b>This is a test email to verify SMTP configuration.</b>'
        });
        console.log('Email SENT!', info.messageId);
    } catch (error) {
        console.error('Email FAILED:', error);
    }
}

sendTestMail();
