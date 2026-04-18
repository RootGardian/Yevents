const QRCode = require('qrcode');

const sendConfirmationEmail = async (participant) => {
    console.log(`[MAILER] Sending email via Brevo API to ${participant.email}...`);

    const apiKey = process.env.BREVO_API_KEY;
    const url = 'https://api.brevo.com/v3/smtp/email';

    if (!apiKey) {
        console.error('[MAILER] Missing API Key (BREVO_API_KEY)');
        throw new Error('Missing Brevo API Key');
    }

    try {
        const urn = participant.qrCodeToken.substring(0, 8).toUpperCase();

        // Generate QR for CID embedding (Base64)
        const qrDataUrl = await QRCode.toDataURL(participant.qrCodeToken, {
            margin: 1,
            width: 200
        });
        const qrBase64 = qrDataUrl.split('base64,')[1];

        const emailData = {
            sender: {
                name: process.env.MAIL_FROM_NAME || 'Ynov Events',
                email: process.env.MAIL_FROM_ADDRESS
            },
            to: [{
                email: participant.email,
                name: `${participant.prenom} ${participant.nom}`
            }],
            subject: 'Confirmation d\'inscription - Ynov Talk Events 2026',
            htmlContent: `
            <div style="background-color: #1a1a1a; color: #ffffff; font-family: 'Helvetica', Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
                <div style="text-align: left; padding-bottom: 20px;">
                    <p style="font-size: 16px; margin: 0;">Bonjour ${participant.prenom} ${participant.nom},</p>
                    <p style="font-size: 16px; margin: 15px 0 5px 0;">Merci de vous être inscrit à l'événement <b>YNOV TALK EVENTS 2026</b>.</p>
                    <p style="font-size: 16px; margin: 5px 0;">Votre inscription est désormais confirmée.</p>
                </div>

                <div style="background-color: #262626; padding: 30px; border-radius: 8px; margin: 20px 0; border: 1px solid #333;">
                    <h2 style="text-align: center; font-size: 18px; margin-bottom: 30px; border-bottom: 1px solid #444; padding-bottom: 20px; letter-spacing: 1px;">RÉSUMÉ DE VOTRE INSCRIPTION :</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td width="40%" valign="top" style="text-align: center;">
                                <p style="font-size: 12px; color: #aaa; margin: 0;">Votre numéro d'inscription unique</p>
                                <p style="font-size: 18px; font-weight: bold; margin: 10px 0;">${urn}</p>
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${participant.qrCodeToken}" width="150" height="150" style="display: block; margin: auto; background: white; padding: 5px;" alt="QR Code" />
                            </td>
                            <td width="60%" valign="top" style="padding-left: 20px;">
                                <div style="margin-bottom: 15px;">
                                    <p style="font-size: 12px; color: #aaa; margin: 0;">Numéro d'inscription unique (URN) :</p>
                                    <p style="font-size: 16px; font-weight: bold; margin: 5px 0;">${urn}</p>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <p style="font-size: 12px; color: #aaa; margin: 0;">Catégorie du badge :</p>
                                    <p style="font-size: 16px; font-weight: bold; margin: 5px 0;">${participant.categorieBadge}</p>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <p style="font-size: 12px; color: #aaa; margin: 0;">Nom complet :</p>
                                    <p style="font-size: 16px; font-weight: bold; margin: 5px 0; text-transform: uppercase;">${participant.prenom} ${participant.nom}</p>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <p style="font-size: 12px; color: #aaa; margin: 0;">Entreprise / Université :</p>
                                    <p style="font-size: 16px; font-weight: bold; margin: 5px 0; text-transform: uppercase;">${participant.entreprise || 'N/A'}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #8c2d2d; padding: 15px; text-align: center; border-radius: 4px 4px 0 0;">
                    <h3 style="margin: 0; letter-spacing: 1px;">INFORMATIONS SUR L'ÉVÉNEMENT</h3>
                </div>
                <div style="background-color: #262626; padding: 20px; border-radius: 0 0 4px 4px; border: 1px solid #333;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="55%" valign="top">
                                <p style="font-weight: bold; margin: 0 0 10px 0;">Horaires :</p>
                                <p style="font-size: 14px; margin: 5px 0;">Samedi 2 Mai : 14h00 – 18h00</p>
                            </td>
                            <td width="45%" valign="top">
                                <p style="font-weight: bold; margin: 0 0 10px 0;">Lieu :</p>
                                <p style="font-size: 14px; margin: 5px 0;">Maroc Ynov Campus, 8 Ibnou Katima (Ex Bournazel), Casablanca 20000</p>
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="padding-top: 30px; text-align: center; border-top: 1px solid #333; margin-top: 30px;">
                    <p style="font-size: 12px; color: #888;">&copy; 2026 Maroc Ynov Campus. Tous droits réservés.</p>
                </div>
            </div>
            `,
            attachment: [
                {
                    content: qrBase64,
                    name: 'qrcode.png'
                }
            ]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[MAILER] Brevo API Error:', result);
            throw new Error(result.message || 'Failed to send email via Brevo API');
        }

        console.log('[MAILER] Email sent successfully via API:', result.messageId);
        return result;

    } catch (error) {
        console.error(`[MAILER] Error sending email to ${participant.email}:`, error);
        throw error;
    }
};

const sendOTPEmail = async (email, otp) => {
    console.log(`[MAILER] Sending OTP email to ${email}...`);
    const apiKey = process.env.BREVO_API_KEY;
    const url = 'https://api.brevo.com/v3/smtp/email';

    if (!apiKey) {
        throw new Error('Missing Brevo API Key');
    }

    const emailData = {
        sender: {
            name: process.env.MAIL_FROM_NAME || 'Ynov Events',
            email: process.env.MAIL_FROM_ADDRESS
        },
        to: [{ email }],
        subject: `Votre code de vérification - Ynov Events`,
        htmlContent: `
        <div style="background-color: #1a1a1a; color: #ffffff; font-family: 'Helvetica', Arial, sans-serif; padding: 40px; text-align: center; border-radius: 8px;">
            <h1 style="color: #ff3e3e; font-size: 24px; margin-bottom: 20px;">Vérification d'identité</h1>
            <p style="font-size: 16px; color: #aaaaaa;">Voici votre code de vérification pour accéder à vos inscriptions :</p>
            <div style="background-color: #262626; padding: 20px; border-radius: 12px; border: 1px solid #333; margin: 30px auto; width: fit-content;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #ffffff;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #666666;">Ce code expirera dans 2 minutes.</p>
            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">
            <p style="font-size: 12px; color: #444444;">Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail.</p>
        </div>
        `
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify(emailData)
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to send OTP email');
    }
};

const sendReminderEmail = async (email, name, role = 'Participant') => {
    console.log(`[MAILER] Sending reminder email to ${email}...`);
    const apiKey = process.env.BREVO_API_KEY;
    const url = 'https://api.brevo.com/v3/smtp/email';

    if (!apiKey) throw new Error('Missing Brevo API Key');

    const emailData = {
        sender: {
            name: process.env.MAIL_FROM_NAME || 'Ynov Events',
            email: process.env.MAIL_FROM_ADDRESS
        },
        to: [{ email, name }],
        subject: 'RAPPEL : J-2 avant Ynov Talk Events 2026',
        htmlContent: `
        <div style="background-color: #0f172a; color: #ffffff; font-family: 'Helvetica', Arial, sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto;">
            <div style="text-align: center; border-bottom: 2px solid #8c2d2d; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-style: italic; font-weight: 900; text-transform: uppercase;">Préparez-vous à l'Impact</h1>
            </div>
            
            <p style="font-size: 16px; color: #cbd5e1; line-height: 1.6;">Bonjour ${name},</p>
            
            <p style="font-size: 16px; color: #cbd5e1; line-height: 1.6;">Plus que 2 jours avant <b>Ynov Talk Events 2026</b>. Nous avons hâte de vous retrouver au Campus de Casablanca pour ce moment de partage authentique.</p>
            
            <div style="background-color: #1e293b; padding: 25px; border-radius: 8px; border-left: 4px solid #8c2d2d; margin: 30px 0;">
                <p style="font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">ℹ️ INFORMATION CRITIQUE :</p>
                <p style="font-size: 15px; color: #f8fafc; margin-bottom: 0;">
                    Le <b>badge QR Code</b> qui vous a été transmis par mail lors de votre inscription est <b>STRICTEMENT OBLIGATOIRE</b> pour accéder au campus. Veuillez le préparer sur votre téléphone ou l'imprimer pour fluidifier votre entrée.
                </p>
            </div>

            <p style="font-size: 14px; color: #94a3b8;">
                Rappel du lieu :<br>
                <b>Maroc Ynov Campus, 8 Ibnou Katima (Ex Bournazel), Casablanca</b><br>
                Début de l'événement : 14h00
            </p>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b;">
                <p style="font-size: 12px; color: #64748b;">Ce message est un rappel automatique pour l'événement Ynov Talk Events 2026.</p>
            </div>
        </div>
        `
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify(emailData)
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to send reminder email');
    }
};

module.exports = {
    sendConfirmationEmail,
    sendOTPEmail,
    sendReminderEmail
};

