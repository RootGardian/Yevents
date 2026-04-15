const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Try Admin first
        let user = await prisma.admin.findUnique({ where: { email } });
        let role = 'admin';

        if (!user) {
            // Try Staff
            user = await prisma.staff.findUnique({ where: { email } });
            role = 'staff';
        }

        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom || user.name,
                role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.logout = (req, res) => {
    // With JWT, client just needs to discard the token
    res.json({ message: 'Déconnexion réussie' });
};
