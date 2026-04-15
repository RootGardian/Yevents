const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFailures() {
    try {
        const failures = await prisma.participant.findMany({
            where: {
                registrationStatus: 'email_failed'
            }
        });
        console.log('--- EMAIL FAILURES ---');
        console.log('Count:', failures.length);
        failures.forEach(f => {
            console.log(`ID: ${f.id}, Name: ${f.nom} ${f.prenom}, Email: ${f.email}, Error: ${f.emailError}`);
        });

        const lastParticipants = await prisma.participant.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });
        console.log('\n--- LAST 5 PARTICIPANTS ---');
        lastParticipants.forEach(p => {
            console.log(`ID: ${p.id}, Name: ${p.nom} ${p.prenom}, EmailSent: ${p.emailSent}, Status: ${p.registrationStatus}`);
        });

    } catch (error) {
        console.error('Error fetching participants:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkFailures();
