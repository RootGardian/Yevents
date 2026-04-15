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
    connectionTimeout: 30000, // increased
    greetingTimeout: 30000,
    socketTimeout: 60000
});

async function testConnection() {
    console.log(`Connecting to ${process.env.MAIL_HOST}:${process.env.MAIL_PORT}...`);
    try {
        await transporter.verify();
        console.log('Connection SUCCESSFUL!');
    } catch (error) {
        console.error('Connection FAILED:', error);
    }
}

testConnection();
