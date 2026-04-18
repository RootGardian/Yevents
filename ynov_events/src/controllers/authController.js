const prisma = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const audit = require('../utils/audit');
const { loginSchema } = require('../utils/validation');

exports.login = async (req, res) => {
    try {
        // Validation with Zod
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        // Try Admin first
        let user = await prisma.admin.findUnique({ where: { email } });
        let role = 'admin';

        if (!user) {
            // Try Staff
            user = await prisma.staff.findUnique({ where: { email } });
            role = 'staff';
        }

        if (!user) {
            await audit.log('LOGIN_FAILED', `Tentative de connexion (Email inconnu): ${email}`);
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await audit.log('LOGIN_FAILED', `Mot de passe incorrect pour: ${email}`);
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role, isSuperAdmin: user.isSuperAdmin || false },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        const userData = {
            id: user.id,
            email: user.email,
            nom: user.nom || user.name,
            role,
            isSuperAdmin: user.isSuperAdmin || false,
            requiresPasswordChange: user.isSuperAdmin ? false : (user.requiresPasswordChange || false)
        };

        await audit.log('LOGIN', 'Connexion réussie', { email: user.email, role });

        res.json({
            token,
            user: userData
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        // Fetch fresh user data
        let user;
        if (role === 'admin') {
            user = await prisma.admin.findUnique({ where: { id: userId } });
        } else {
            user = await prisma.staff.findUnique({ where: { id: userId } });
        }

        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'L\'ancien mot de passe est incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user
        const updateData = {
            password: hashedPassword,
            requiresPasswordChange: false
        };

        if (role === 'admin') {
            await prisma.admin.update({ where: { id: userId }, data: updateData });
        } else {
            await prisma.staff.update({ where: { id: userId }, data: updateData });
        }

        await audit.log('PASSWORD_CHANGED', `Changement de mot de passe réussi pour: ${user.email}`, { role });

        res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
    }
};

exports.logout = async (req, res) => {
    if (req.user) {
        await audit.log('LOGOUT', 'Déconnexion effectuée', { email: req.user.email, role: req.user.role });
    }
    res.json({ message: 'Déconnexion réussie' });
};
