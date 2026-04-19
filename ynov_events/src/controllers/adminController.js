const prisma = require('../db');
const bcrypt = require('bcryptjs');
const { sendConfirmationEmail, sendReminderEmail } = require('../utils/mailer');
const audit = require('../utils/audit');
const { sendAllReminders } = require('../utils/reminders');
const { userCreateSchema, passwordResetSchema } = require('../utils/validation');

const SUPER_ADMIN_EMAIL = 'ahmedbangoura@yevents.ma';

exports.exportParticipants = async (req, res) => {
    try {
        const participants = await prisma.participant.findMany({ orderBy: { createdAt: 'desc' } });
        
        // UTF-8 BOM to tell Excel this is UTF-8 encoding (fixes Ã© issues)
        let csv = '\ufeff';
        
        // Header
        csv += 'Nom;Prénom;Email;Téléphone;Entreprise;Catégorie;Présence;Date Inscription\n';
        
        participants.forEach(p => {
            const dateStr = p.createdAt ? new Date(p.createdAt).toLocaleString('fr-FR') : '';
            // Escape semicolons and force Excel to treat certain fields as text
            const phone = p.telephone ? `="${p.telephone}"` : '';
            const entreprise = (p.entreprise || '').replace(/;/g, ',');
            const nom = (p.nom || '').replace(/;/g, ',');
            const prenom = (p.prenom || '').replace(/;/g, ',');

            csv += `${nom};${prenom};${p.email};${phone};${entreprise};${p.categorieBadge};${p.isCheckedIn ? 'PRÉSENT' : 'ABSENT'};${dateStr}\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=participants_ynov.csv');
        res.send(csv);

        await audit.log('EXPORT', 'Export CSV des participants optimisé pour Excel effectué.', req.user);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'export' });
    }
};

exports.resendEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const participant = await prisma.participant.findUnique({ where: { email } });
        if (!participant) return res.status(404).json({ message: 'Participant non trouvé' });

        await sendConfirmationEmail(participant);
        await prisma.participant.update({
            where: { id: participant.id },
            data: { emailSent: true, registrationStatus: 'confirmed', emailError: null }
        });

        await audit.log('RESEND_EMAIL', `Renvoi mail à: ${email}`, req.user);
        res.json({ message: 'Email renvoyé' });
    } catch (error) {
        console.error('Resend email error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi' });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getStaff = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    try {
        const staff = await prisma.staff.findMany({ 
            select: { id: true, name: true, email: true, requiresPasswordChange: true, createdAt: true },
            orderBy: { name: 'asc' } 
        });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createStaff = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    try {
        const validatedData = userCreateSchema.parse(req.body);
        const { name, email, password } = validatedData;

        const hashedPassword = await bcrypt.hash(password, 12);
        const staff = await prisma.staff.create({
            data: { name, email, password: hashedPassword, requiresPasswordChange: true },
            select: { id: true, name: true, email: true, requiresPasswordChange: true }
        });
        await audit.log('STAFF_CREATED', `Membre du staff créé: ${email}`, req.user);
        res.status(201).json(staff);
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Create staff error:', error);
        res.status(500).json({ message: 'Erreur lors de la création du staff' });
    }
};

exports.deleteStaff = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    const { id } = req.params;
    try {
        await prisma.staff.delete({ where: { id: parseInt(id) } });
        await audit.log('STAFF_DELETED', `Staff supprimé (ID: ${id})`, req.user);
        res.json({ message: 'Staff supprimé' });
    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};

// --- Admin Management (RESTRICTED TO SUPER ADMIN) ---

exports.getAdmins = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    try {
        const admins = await prisma.admin.findMany({
            select: { id: true, name: true, email: true, isSuperAdmin: true, createdAt: true },
            orderBy: { name: 'asc' }
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createAdmin = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    try {
        const validatedData = userCreateSchema.parse(req.body);
        const { name, email, password } = validatedData;

        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = await prisma.admin.create({
            data: { 
                name, 
                email, 
                password: hashedPassword, 
                isSuperAdmin: false,
                requiresPasswordChange: true 
            },
            select: { id: true, name: true, email: true, isSuperAdmin: true, requiresPasswordChange: true }
        });
        await audit.log('ADMIN_CREATED', `Admin créé par Super Admin: ${email}`, req.user);
        res.status(201).json(admin);
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'admin' });
    }
};

exports.deleteAdmin = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    const { id } = req.params;
    
    try {
        const adminToDelete = await prisma.admin.findUnique({ where: { id: parseInt(id) } });
        if (adminToDelete && adminToDelete.isSuperAdmin) {
            return res.status(400).json({ message: 'Le Super Admin ne peut pas être supprimé' });
        }

        await prisma.admin.delete({ where: { id: parseInt(id) } });
        await audit.log('ADMIN_DELETED', `Admin supprimé par Super Admin (ID: ${id})`, req.user);
        res.json({ message: 'Administrateur supprimé' });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};

exports.resetUserPassword = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }

    try {
        const validatedData = passwordResetSchema.parse(req.body);
        const { userId, role, newPassword } = validatedData;

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        if (role === 'admin') {
            const admin = await prisma.admin.findUnique({ where: { id: userId } });
            if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
            
            await prisma.admin.update({
                where: { id: userId },
                data: { password: hashedPassword, requiresPasswordChange: true }
            });
            await audit.log('ADMIN_PASSWORD_RESET', `Mot de passe réinitialisé pour l'admin: ${admin.email}`, req.user);
        } else {
            const staff = await prisma.staff.findUnique({ where: { id: userId } });
            if (!staff) return res.status(404).json({ message: 'Staff non trouvé' });

            await prisma.staff.update({
                where: { id: userId },
                data: { password: hashedPassword, requiresPasswordChange: true }
            });
            await audit.log('STAFF_PASSWORD_RESET', `Mot de passe réinitialisé pour le staff: ${staff.email}`, req.user);
        }

        res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Erreur lors de la réinitialisation' });
    }
};

exports.triggerManualReminders = async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }

    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ message: 'Le mot de passe est requis pour cette opération critique.' });
    }
    
    try {
        const isMatch = await bcrypt.compare(password, req.user.password);
        if (!isMatch) {
            await audit.log('REMINDERS_AUTH_FAILED', `Tentative de rappel avec mauvais mot de passe par ${req.user.email}`, req.user);
            return res.status(401).json({ message: 'Mot de passe incorrect. Action refusée.' });
        }

        await audit.log('MANUAL_REMINDERS', `Déclenchement manuel des rappels par ${req.user.email}`, req.user);
        
        // Non-blocking trigger
        sendAllReminders();
        
        res.json({ message: 'Le processus d\'envoi massif a été lancé en arrière-plan.' });
    } catch (error) {
        console.error('Manual reminders error:', error);
        res.status(500).json({ message: 'Erreur lors du lancement des rappels' });
    }
};
