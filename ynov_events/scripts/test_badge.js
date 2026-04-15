const { generateBadgeBuffer } = require('../src/utils/badgeGenerator');
const fs = require('fs');
const path = require('path');

const testParticipant = {
    id: 1,
    nom: 'Ahmed',
    prenom: 'Rachid Bangoura',
    email: 'test@example.com',
    entreprise: 'AUTOHOUSE',
    categorieBadge: 'VISITOR',
    qrCodeToken: 'test-token-12345678'
};

async function runTest() {
    console.log('--- Generating Test Badge ---');
    try {
        const buffer = await generateBadgeBuffer(testParticipant);
        const outputPath = path.join(__dirname, 'test_badge.pdf');
        fs.writeFileSync(outputPath, buffer);
        console.log(`Success! Badge generated at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating badge:', error);
    }
}

runTest();
