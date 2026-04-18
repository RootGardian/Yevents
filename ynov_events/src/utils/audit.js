const prisma = require('../db');

const log = async (action, details, causer = null) => {
    try {
        let causerType = 'system';
        let causerId = null;
        let enrichedDetails = details;

        if (causer) {
            // Determine type
            if (causer.role === 'admin' || causer.isSuperAdmin !== undefined) {
                causerType = causer.isSuperAdmin ? 'super_admin' : 'admin';
                causerId = causer.id;
                enrichedDetails = `[${causer.email}] ${details}`;
            } else if (causer.role === 'staff') {
                causerType = 'staff';
                causerId = causer.id;
                enrichedDetails = `[STAFF: ${causer.email}] ${details}`;
            } else if (causer.qrCodeToken) { // It's a participant
                causerType = 'participant';
                causerId = causer.id;
                enrichedDetails = `[PARTICIPANT: ${causer.email}] ${details}`;
            }
        }

        await prisma.auditLog.create({
            data: {
                action,
                details: enrichedDetails,
                causerType,
                causerId
            }
        });
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};

module.exports = { log };
