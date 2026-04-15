const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user;
        if (decoded.role === 'admin') {
            user = await prisma.admin.findUnique({ where: { id: decoded.id } });
        } else if (decoded.role === 'staff') {
            user = await prisma.staff.findUnique({ where: { id: decoded.id } });
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = { ...user, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { authMiddleware, isAdmin };
