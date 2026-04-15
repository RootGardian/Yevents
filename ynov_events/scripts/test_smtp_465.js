const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465, // Testing port 465
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000
});

async function testConnection() {
    console.log(`Connecting to ${process.env.MAIL_HOST}:465 (secure)...`);
    try {
        await transporter.verify();
        console.log('Connection SUCCESSFUL!');
    } catch (error) {
        console.error('Connection FAILED:', error);
    }
}

testConnection();
