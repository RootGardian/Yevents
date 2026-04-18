const prisma = require('../db');
const audit = require('../utils/audit');

const DEFAULT_SETTINGS = {
    event_name: 'Ynov Talk 2026',
    event_date: '2026-05-02',
    event_date_text: 'SAMEDI 2 MAI 2026',
    event_hours: '09:00 - 18:00',
    event_location: 'Casablanca Ynov campus',
    event_location_link: 'https://maps.app.goo.gl/B6KTip19rMJmUVMp7?g_st=ic',
    event_public_target: 'PROFESSIONNELS & ÉTUDIANTS YNOV',
    max_capacity: '100',
    support_email: 'ahmedrachid.bangoura@ynov.com'
};

exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await prisma.setting.findMany();
        const settingsMap = {};
        
        // Fill with defaults first
        Object.keys(DEFAULT_SETTINGS).forEach(key => {
            settingsMap[key] = DEFAULT_SETTINGS[key];
        });

        // Overlay database values
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });

        res.json(settingsMap);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des paramètres' });
    }
};

exports.updateSettings = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }

    const updates = req.body; // Expecting { key: value, ... }
    try {
        const operations = Object.entries(updates).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        });

        await prisma.$transaction(operations);
        await audit.log('SETTINGS_UPDATE', `Mise à jour des paramètres de l'événement`, req.user);
        
        res.json({ message: 'Paramètres mis à jour avec succès' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};
