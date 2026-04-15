const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { generateBadgeBuffer } = require('./badgeGenerator');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp-relay.brevo.com',
    port: process.env.MAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendConfirmationEmail = async (participant) => {
    try {
        const urn = `124${String(participant.id).padStart(5, '0')}`;
        
        // Generate QR for CID embedding
        const qrDataUrl = await QRCode.toDataURL(participant.qrCodeToken, {
            margin: 1,
            width: 200
        });

        // Generate PDF Badge
        const badgeBuffer = await generateBadgeBuffer(participant);

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME || 'Ynov Talk Events'}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: participant.email,
            subject: 'Confirmation d\'inscription - Ynov Talk Events 2026',
            html: `
            <div style="background-color: #1a1a1a; color: #ffffff; font-family: 'Helvetica', Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
                <div style="text-align: left; padding-bottom: 20px;">
                    <p style="font-size: 16px; margin: 0;">Hi ${participant.prenom} ${participant.nom},</p>
                    <p style="font-size: 16px; margin: 15px 0 5px 0;">Thank you for registering to attend <b>YNOV TALK EVENTS 2026</b>.</p>
                    <p style="font-size: 16px; margin: 5px 0;">Your registration is now confirmed.</p>
                </div>

                <div style="background-color: #262626; padding: 30px; border-radius: 8px; margin: 20px 0; border: 1px solid #333;">
                    <h2 style="text-align: center; font-size: 18px; margin-bottom: 30px; border-bottom: 1px solid #444; padding-bottom: 20px; letter-spacing: 1px;">YOUR VISITOR REGISTRATION SUMMARY:</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td width="40%" valign="top" style="text-align: center;">
                                <p style="font-size: 12px; color: #aaa; margin: 0;">Your Unique Registration Number</p>
                                <p style="font-size: 18px; font-weight: bold; margin: 10px 0;">${urn}</p>
                                <img src="cid:qrcode" width="150" height="150" style="display: block; margin: auto; background: white; padding: 5px;" alt="QR Code" />
                            </td>
                            <td width="60%" valign="top" style="padding-left: 20px;">
                                <div style="margin-bottom: 15px;">
                                    <p style="font-size: 12px; color: #aaa; margin: 0;">Unique Registration Number (URN):</p>
                                    <p style="font-size: 16px; font-weight: bold; margin: 5px 0;">${urn}</p>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <p style="font-size: 12px; color: #aaa; margin: 0;">Badge Category:</p>
                                    <p style="font-size: 16px; font-weight: bold; margin: 5px 0;">${participant.categorieBadge}</p>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <p style="font-size: 12px; color: #aaa; margin: 0;">Full Name:</p>
                                    <p style="font-size: 16px; font-weight: bold; margin: 5px 0; text-transform: uppercase;">${participant.prenom} ${participant.nom}</p>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <p style="font-size: 12px; color: #aaa; margin: 0;">Company Name:</p>
                                    <p style="font-size: 16px; font-weight: bold; margin: 5px 0; text-transform: uppercase;">${participant.entreprise || 'N/A'}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #8c2d2d; padding: 15px; text-align: center; border-radius: 4px 4px 0 0;">
                    <h3 style="margin: 0; letter-spacing: 1px;">EVENT INFORMATION</h3>
                </div>
                <div style="background-color: #262626; padding: 20px; border-radius: 0 0 4px 4px; border: 1px solid #333;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="55%" valign="top">
                                <p style="font-weight: bold; margin: 0 0 10px 0;">Show timings:</p>
                                <p style="font-size: 14px; margin: 5px 0;">Saturday, 2 May : 02:00 pm – 06:00 pm</p>
                            </td>
                            <td width="45%" valign="top">
                                <p style="font-weight: bold; margin: 0 0 10px 0;">Location:</p>
                                <p style="font-size: 14px; margin: 5px 0;">Maroc Ynov Campus, 8 Ibnou Katima (Ex Bournazel), Casablanca 20000</p>
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="padding-top: 30px; text-align: center; border-top: 1px solid #333; margin-top: 30px;">
                    <p style="font-size: 12px; color: #888;">&copy; 2026 YNOV MOROCCO. All rights reserved.</p>
                    <p style="font-size: 12px; color: #888;">Please find your printable badge attached as a PDF.</p>
                </div>
            </div>
            `,
            attachments: [
                {
                    filename: 'badge_ynov_talk_events.pdf',
                    content: badgeBuffer
                },
                {
                    filename: 'qrcode.png',
                    content: qrDataUrl.split('base64,')[1],
                    encoding: 'base64',
                    cid: 'qrcode'
                }
            ]
        };

        return transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Mail error details:', error);
        throw error;
    }
};

module.exports = { sendConfirmationEmail };
