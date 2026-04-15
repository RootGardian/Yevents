const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendConfirmationEmail } = require('../src/utils/mailer');
require('dotenv').config();

async function retryFailedEmails() {
    console.log('[RETRY] Starting retry of failed emails...');
    try {
        const failedParticipants = await prisma.participant.findMany({
            where: {
                registrationStatus: 'email_failed'
            }
        });

        console.log(`[RETRY] Found ${failedParticipants.length} failed emails to retry.`);

        for (const p of failedParticipants) {
            console.log(`[RETRY] Retrying for ${p.prenom} ${p.nom} (${p.email})...`);
            try {
                await sendConfirmationEmail(p);
                
                await prisma.participant.update({
                    where: { id: p.id },
                    data: { 
                        emailSent: true, 
                        registrationStatus: 'confirmed',
                        emailError: null 
                    }
                });
                console.log(`[RETRY] SUCCESS for ${p.email}`);
            } catch (error) {
                console.error(`[RETRY] FAILED again for ${p.email}:`, error.message);
                // Keep the status as email_failed but maybe update the error
                await prisma.participant.update({
                    where: { id: p.id },
                    data: { emailError: error.message }
                });
            }
        }

    } catch (error) {
        console.error('[RETRY] Critical error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

retryFailedEmails();
