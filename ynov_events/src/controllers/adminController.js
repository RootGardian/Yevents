const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { sendConfirmationEmail } = require('../utils/mailer');
const audit = require('../utils/audit');

exports.exportParticipants = async (req, res) => {
    try {
        const participants = await prisma.participant.findMany();
        
        let csv = 'Nom;Prénom;Email;Téléphone;Entreprise;Catégorie;Présence;Date Inscription\n';
        
        participants.forEach(p => {
            csv += `${p.nom};${p.prenom};${p.email};${p.telephone};${p.entreprise || ''};${p.categorieBadge};${p.isCheckedIn ? 'PRÉSENT' : 'ABSENT'};${p.createdAt.toISOString()}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=participants.csv');
        res.send(csv);

        await audit.log('EXPORT', 'Export CSV des participants effectué.');
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

        await audit.log('RESEND_EMAIL', `Renvoi mail à: ${email}`, participant);
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
    try {
        const staff = await prisma.staff.findMany({ orderBy: { name: 'asc' } });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createStaff = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const staff = await prisma.staff.create({
            data: { name, email, password: hashedPassword }
        });
        res.status(201).json(staff);
    } catch (error) {
        console.error('Create staff error:', error);
        res.status(500).json({ message: 'Erreur lors de la création du staff' });
    }
};

exports.deleteStaff = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.staff.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Staff supprimé' });
    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};

// --- Admin Management (RESTRICTED TO AHMED BANGOURA) ---
const SUPER_ADMIN_EMAIL = 'ahmedbangoura@yevents.ma';

exports.getAdmins = async (req, res) => {
    if (req.user.email !== SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    try {
        const admins = await prisma.admin.findMany({
            select: { id: true, name: true, email: true, createdAt: true },
            orderBy: { name: 'asc' }
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.createAdmin = async (req, res) => {
    if (req.user.email !== SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = await prisma.admin.create({
            data: { name, email, password: hashedPassword },
            select: { id: true, name: true, email: true }
        });
        await audit.log('ADMIN_CREATED', `Admin créé par Super Admin: ${email}`);
        res.status(201).json(admin);
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'admin' });
    }
};

exports.deleteAdmin = async (req, res) => {
    if (req.user.email !== SUPER_ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Privilèges Super Admin requis' });
    }
    const { id } = req.params;
    
    // Prevent self-deletion of Super Admin via API
    const adminToDelete = await prisma.admin.findUnique({ where: { id: parseInt(id) } });
    if (adminToDelete && adminToDelete.email === SUPER_ADMIN_EMAIL) {
        return res.status(400).json({ message: 'Le Super Admin ne peut pas être supprimé' });
    }

    try {
        await prisma.admin.delete({ where: { id: parseInt(id) } });
        await audit.log('ADMIN_DELETED', `Admin supprimé par Super Admin (ID: ${id})`);
        res.json({ message: 'Administrateur supprimé' });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};
