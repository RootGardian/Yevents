const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const log = async (action, details, participant = null) => {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                details,
                causerType: participant ? 'participant' : 'system',
                causerId: participant ? participant.id : null
            }
        });
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};

module.exports = { log };
