const prisma = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role, isSuperAdmin: user.isSuperAdmin || false },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom || user.name,
                role,
                isSuperAdmin: user.isSuperAdmin || false
            }
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.logout = (req, res) => {
    // With JWT, client just needs to discard the token
    res.json({ message: 'Déconnexion réussie' });
};
