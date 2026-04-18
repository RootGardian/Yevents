const prisma = require('../db');

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
