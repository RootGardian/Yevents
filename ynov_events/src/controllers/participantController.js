const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendConfirmationEmail } = require('../utils/mailer');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    const { nom, prenom, email, telephone, entreprise, categorie_badge, nb_accompagnateurs } = req.body;

    try {
        // Capacity check
        const config = await prisma.setting.findUnique({ where: { key: 'max_capacity' } });
        const maxCapacity = config ? parseInt(config.value) : 100;
        
        const participants = await prisma.participant.findMany();
        const currentTotal = participants.reduce((acc, p) => acc + 1 + p.nbAccompagnateurs, 0);
        const requested = 1 + (parseInt(nb_accompagnateurs) || 0);

        if ((currentTotal + requested) > maxCapacity) {
            return res.status(422).json({
                message: 'Événement complet',
                places_restantes: Math.max(0, maxCapacity - currentTotal)
            });
        }

        // Transactional creation & email
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
                    nbAccompagnateurs: parseInt(nb_accompagnateurs) || 0,
                    qrCodeToken: uuidv4(),
                    registrationStatus: 'confirmed',
                    emailSent: false,
                    consentTimestamp: new Date()
                }
            });

            await sendConfirmationEmail(participant);
            
            await prisma.participant.update({
                where: { id: participant.id },
                data: { emailSent: true }
            });

            res.status(201).json({ message: 'Inscription réussie', participant });

        } catch (emailError) {
            console.error('Email failed:', emailError);
            if (participant) {
                await prisma.participant.update({
                    where: { id: participant.id },
                    data: { 
                        registrationStatus: 'email_failed',
                        emailError: emailError.message 
                    }
                });
            }
            res.status(201).json({ 
                message: 'Inscription enregistrée (Email en attente)', 
                participant 
            });
        }

    } catch (error) {
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
            return res.json({ message: 'Déjà présent', participant });
        }

        const updated = await prisma.participant.update({
            where: { id: participant.id },
            data: { isCheckedIn: true }
        });

        await audit.log('CHECKIN', `Validation de présence: ${updated.prenom} ${updated.nom}`, updated);

        res.json({ message: 'Check-in réussi !', participant: updated });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.stats = async (req, res) => {
    try {
        const config = await prisma.setting.findUnique({ where: { key: 'max_capacity' } });
        const maxCapacity = config ? parseInt(config.value) : 100;

        const participants = await prisma.participant.findMany();
        
        const totalInscrits = participants.length;
        const totalAccompagnateurs = participants.reduce((acc, p) => acc + p.nbAccompagnateurs, 0);
        const totalAttendu = totalInscrits + totalAccompagnateurs;
        
        const presents = participants.filter(p => p.isCheckedIn);
        const totalPresent = presents.length + presents.reduce((acc, p) => acc + p.nbAccompagnateurs, 0);

        const emailFailures = participants.filter(p => p.registrationStatus === 'email_failed').length;

        // Stats by category
        const statsParCategorie = {};
        participants.forEach(p => {
            statsParCategorie[p.categorieBadge] = (statsParCategorie[p.categorieBadge] || 0) + 1;
        });

        res.json({
            jauge_max: maxCapacity,
            total_inscrits: totalInscrits,
            total_accompagnateurs: totalAccompagnateurs,
            total_attendu: totalAttendu,
            total_present: totalPresent,
            taux_remplissage: Math.round((totalAttendu / maxCapacity) * 100),
            taux_presence: totalAttendu > 0 ? Math.round((totalPresent / totalAttendu) * 100) : 0,
            stats_par_categorie: Object.entries(statsParCategorie).map(([k, v]) => ({ categorie_badge: k, total: v })),
            email_failures: emailFailures
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
