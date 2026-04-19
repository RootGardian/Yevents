const prisma = require('../db');
const { sendConfirmationEmail } = require('../utils/mailer');
const { v4: uuidv4 } = require('uuid');
const { registrationSchema } = require('../utils/validation');

exports.register = async (req, res) => {
    try {
        // 0. Validation with Zod
        const validatedData = registrationSchema.parse(req.body);
        const { nom, prenom, email, telephone, entreprise, categorie_badge } = validatedData;

        // 1. Capacity check
        const config = await prisma.setting.findUnique({ where: { key: 'max_capacity' } });
        const maxCapacity = config ? parseInt(config.value) : 100;
        
        const totalInscrits = await prisma.participant.count();
        
        if (totalInscrits >= maxCapacity) {
            return res.status(422).json({
                message: 'Événement complet',
                places_restantes: 0
            });
        }

        // 2. Check if email already exists
        const existing = await prisma.participant.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ 
                message: 'Cet email est déjà utilisé pour une inscription.' 
            });
        }

        // 3. Create the participant record
        let participant;
        try {
            participant = await prisma.participant.create({
                data: {
                    nom,
                    prenom,
                    email,
                    telephone,
                    entreprise,
                    categorieBadge: categorie_badge,
                    qrCodeToken: uuidv4(),
                    registrationStatus: 'pending',
                    emailSent: false,
                    consentTimestamp: new Date()
                }
            });
        } catch (dbError) {
            console.error('[REGISTRATION] Database error:', dbError);
            return res.status(500).json({ message: 'Erreur lors de la création du profil participant.' });
        }

        // 4. Attempt email sending
        try {
            await sendConfirmationEmail(participant);
            
            // Email success: Confirm registration
            const confirmedParticipant = await prisma.participant.update({
                where: { id: participant.id },
                data: { 
                    emailSent: true,
                    registrationStatus: 'confirmed'
                }
            });

            return res.status(201).json({ 
                message: 'Inscription réussie', 
                participant: confirmedParticipant 
            });

        } catch (emailError) {
            console.error('[REGISTRATION] Email sending failed:', emailError);
            
            await prisma.participant.update({
                where: { id: participant.id },
                data: { 
                    registrationStatus: 'email_failed',
                    emailError: emailError.message 
                }
            });

            return res.status(500).json({ 
                message: 'Erreur lors de l\'envoi du mail de confirmation. Votre inscription est enregistrée mais en attente de validation manuelle.', 
                error: emailError.message 
            });
        }

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const participants = await prisma.participant.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.checkIn = async (req, res) => {
    const { token } = req.params;
    const audit = require('../utils/audit');

    try {
        const participants = await prisma.participant.findMany({
            where: {
                qrCodeToken: { startsWith: token }
            }
        });

        if (participants.length === 0) {
            return res.status(404).json({ message: 'Participant non trouvé' });
        }

        if (participants.length > 1) {
            return res.status(422).json({ message: 'Plusieurs participants correspondent. Précisez le code.' });
        }

        const participant = participants[0];

        if (participant.isCheckedIn) {
            return res.status(409).json({ 
                status: 'ALREADY_CHECKED_IN',
                message: 'ALERTE : Ce badge a déjà été contrôlé !', 
                participant 
            });
        }

        const updated = await prisma.participant.update({
            where: { id: participant.id },
            data: { 
                isCheckedIn: true,
                checkedInAt: new Date()
            }
        });

        await audit.log('CHECKIN', `Validation de présence: ${updated.prenom} ${updated.nom}`, req.user);

        res.json({ message: 'Check-in réussi ! Entrée validée.', participant: updated });
    } catch (error) {
        console.error('[CHECKIN] Error:', error);
        res.status(500).json({ message: 'Erreur serveur lors du check-in' });
    }
};

exports.stats = async (req, res) => {
    try {
        const config = await prisma.setting.findUnique({ where: { key: 'max_capacity' } });
        const maxCapacity = config ? parseInt(config.value) : 100;

        const participants = await prisma.participant.findMany();
        
        const totalInscrits = participants.length;
        const totalPresent = participants.filter(p => p.isCheckedIn).length;
        const emailFailures = participants.filter(p => p.registrationStatus === 'email_failed').length;

        // Stats by category
        const statsParCategorie = {};
        participants.forEach(p => {
            statsParCategorie[p.categorieBadge] = (statsParCategorie[p.categorieBadge] || 0) + 1;
        });

        res.json({
            jauge_max: maxCapacity,
            total_inscrits: totalInscrits,
            total_attendu: totalInscrits,
            total_present: totalPresent,
            taux_remplissage: Math.round((totalInscrits / maxCapacity) * 100),
            taux_presence: totalInscrits > 0 ? Math.round((totalPresent / totalInscrits) * 100) : 0,
            stats_par_categorie: Object.entries(statsParCategorie).map(([k, v]) => ({ categorie_badge: k, total: v })),
            email_failures: emailFailures,
            presences_par_heure: participants
                .filter(p => p.isCheckedIn && p.checkedInAt)
                .reduce((acc, p) => {
                    const hour = new Date(p.checkedInAt).getHours();
                    const hourStr = `${hour}h`;
                    const existing = acc.find(item => item.hour === hourStr);
                    if (existing) existing.count++;
                    else acc.push({ hour: hourStr, count: 1 });
                    return acc;
                }, [])
                .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.lookup = async (req, res) => {
    const { email, telephone } = req.body;
    if (!email && !telephone) {
        return res.status(400).json({ message: 'Veuillez fournir un email ou un numéro de téléphone.' });
    }

    try {
        const participant = await prisma.participant.findFirst({
            where: {
                OR: [
                    email ? { email: email } : null,
                    telephone ? { telephone: telephone } : null
                ].filter(Boolean)
            }
        });

        if (!participant) {
            return res.status(404).json({ message: 'Aucune inscription trouvée avec ces informations.' });
        }

        // Filter sensitive data
        const safeParticipant = {
            prenom: participant.prenom,
            nom: participant.nom,
            email: participant.email,
            telephone: participant.telephone,
            entreprise: participant.entreprise,
            categorieBadge: participant.categorieBadge
        };

        res.json(safeParticipant);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche.' });
    }
};

exports.updateParticipant = async (req, res) => {
    try {
        const validatedData = registrationSchema.parse(req.body);
        const { currentEmail, otpCode } = req.body;
        const { nom, prenom, email, telephone, entreprise, categorie_badge } = validatedData;
        
        if (!currentEmail || !otpCode) {
            return res.status(400).json({ message: 'Identification requise (Email + Code OTP manquant).' });
        }

        // 1. Verify OTP first (on the email where it was sent)
        const otpRecord = await prisma.otp.findUnique({ where: { email: currentEmail } });
        if (!otpRecord || otpRecord.code !== otpCode) {
            return res.status(401).json({ message: 'Code de vérification invalide. Veuillez recommencer.' });
        }
        if (new Date() > otpRecord.expiresAt) {
            return res.status(401).json({ message: 'Code expiré.' });
        }

        // 2. Fetch participant by the CURRENT email verified by OTP
        const participant = await prisma.participant.findUnique({ where: { email: currentEmail } });
        if (!participant) {
            return res.status(404).json({ message: 'Participant non trouvé.' });
        }

        // Check if new email is already taken by someone else
        if (email !== currentEmail) {
            const existing = await prisma.participant.findUnique({ where: { email } });
            if (existing) {
                return res.status(400).json({ message: 'La nouvelle adresse e-mail est déjà utilisée par un autre badge.' });
            }
        }

        // 3. Update the record
        const updated = await prisma.participant.update({
            where: { id: participant.id },
            data: {
                nom,
                prenom,
                email, // New email from validatedData
                telephone,
                entreprise,
                categorieBadge: categorie_badge,
                registrationStatus: 'pending',
                emailSent: false
            }
        });

        // Delete OTP after success
        await prisma.otp.delete({ where: { email: currentEmail } });

        try {
            await sendConfirmationEmail(updated);
            await prisma.participant.update({
                where: { id: updated.id },
                data: { 
                    emailSent: true,
                    registrationStatus: 'confirmed'
                }
            });
            const audit = require('../utils/audit');
            await audit.log('SELF_UPDATE', `Mise à jour des informations par le participant: ${updated.email}`, { participantId: updated.id });
            res.json({ message: 'Informations mises à jour et nouveau badge envoyé !', participant: updated });
        } catch (emailError) {
            console.error('[UPDATE] Email failed:', emailError);
            res.status(201).json({ 
                message: 'Informations mises à jour, mais l\'envoi du mail a échoué. Veuillez contacter le support.', 
                participant: updated 
            });
        }

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Update error:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
    }
};

exports.requestOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const participant = await prisma.participant.findUnique({ where: { email } });
        if (!participant) {
            return res.status(404).json({ message: 'Aucun compte trouvé avec cet e-mail.' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

        await prisma.otp.upsert({
            where: { email },
            update: { code, expiresAt, createdAt: new Date() },
            create: { email, code, expiresAt }
        });

        const { sendOTPEmail } = require('../utils/mailer');
        await sendOTPEmail(email, code);

        res.json({ message: 'Code envoyé !' });
    } catch (error) {
        console.error('[OTP REQUEST] Error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi du code.' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, code } = req.body;

    try {
        const otpRecord = await prisma.otp.findUnique({ where: { email } });

        if (!otpRecord || otpRecord.code !== code) {
            return res.status(400).json({ message: 'Code invalide.' });
        }

        if (new Date() > otpRecord.expiresAt) {
            return res.status(400).json({ message: 'Code expiré. Veuillez en redemander un.' });
        }

        const participant = await prisma.participant.findUnique({ where: { email } });
        // OTP is NOT deleted here anymore, it will be deleted by updateParticipant or expiration.
        // This allows the code to be used for the final save transaction.

        // Filter sensitive data
        const safeParticipant = {
            prenom: participant.prenom,
            nom: participant.nom,
            email: participant.email,
            telephone: participant.telephone,
            entreprise: participant.entreprise,
            categorieBadge: participant.categorieBadge
        };

        res.json({ participant: safeParticipant });
    } catch (error) {
        console.error('[OTP VERIFY] Error:', error);
        res.status(500).json({ message: 'Erreur lors de la vérification.' });
    }
};



