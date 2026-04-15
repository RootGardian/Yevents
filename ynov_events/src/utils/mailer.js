const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp-relay.brevo.com',
    port: process.env.MAIL_PORT || 587,
    secure: false, // TLS
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendConfirmationEmail = async (participant) => {
    const mailOptions = {
        from: `"${process.env.MAIL_FROM_NAME || 'Ynov Events'}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: participant.email,
        subject: 'Confirmation d\'inscription - Ynov Events 2026',
        html: `
            <h1>Félicitations ${participant.prenom} !</h1>
            <p>Votre inscription à l'événement Ynov Events 2026 a été confirmée.</p>
            <p><strong>Catégorie :</strong> ${participant.categorieBadge}</p>
            <p><strong>Code de badge :</strong> ${participant.qrCodeToken.substring(0, 8)}</p>
            <p>Présentez votre QR Code reçu dans cet email lors de votre arrivée.</p>
            <br>
            <p>À très bientôt !</p>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };
