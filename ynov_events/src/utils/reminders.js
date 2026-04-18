const prisma = require('../db');
const { sendReminderEmail } = require('./mailer');

/**
 * Sends a reminder email to all participants and admins (staff)
 * to be triggered 2 days before the event (April 30th).
 */
const sendAllReminders = async () => {
    console.log('[REMINDERS] Starting global reminder process...');
    
    try {
        // 1. Fetch all participants
        const participants = await prisma.participant.findMany({
            where: { registrationStatus: 'confirmed' }
        });
        
        // 2. Fetch all admins (Staff & SuperAdmins)
        const admins = await prisma.admin.findMany();
        
        console.log(`[REMINDERS] Found ${participants.length} participants and ${admins.length} admins.`);

        // 3. Send to participants
        for (const p of participants) {
            try {
                await sendReminderEmail(p.email, `${p.prenom} ${p.nom}`, 'Participant');
                await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit protection
            } catch (err) {
                console.error(`[REMINDERS] Failed to send to participant ${p.email}:`, err.message);
            }
        }

        // 4. Send to staff/admins
        for (const a of admins) {
            try {
                await sendReminderEmail(a.email, a.name, a.role === 'admin' ? 'Staff' : 'SuperAdmin');
                await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit protection
            } catch (err) {
                console.error(`[REMINDERS] Failed to send to admin ${a.email}:`, err.message);
            }
        }

        console.log('[REMINDERS] Global reminder process completed.');
    } catch (error) {
        console.error('[REMINDERS] Critical error in reminder process:', error);
    }
};

module.exports = { sendAllReminders };
