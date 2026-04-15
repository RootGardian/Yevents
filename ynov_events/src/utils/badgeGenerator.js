const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

/**
 * Generates a PDF badge for a participant and returns it as a Buffer.
 * @param {Object} participant - Participant data from database
 * @returns {Promise<Buffer>}
 */
const generateBadgeBuffer = async (participant) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: [283.46, 425.20], // Approx 100x150mm (A6 or large badge size)
                margin: 20
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', err => reject(err));

            // --- Background & Header ---
            // Ynov Red Header
            doc.rect(0, 0, 283.46, 80).fill('#8c2d2d');
            
            doc.fillColor('white')
               .fontSize(16)
               .font('Helvetica-Bold')
               .text('YNOV TALK EVENTS', 0, 25, { align: 'center', width: 283.46 });
            
            doc.fontSize(10)
               .font('Helvetica')
               .text('2026', 0, 45, { align: 'center', width: 283.46 });

            // --- Name Section ---
            const fullName = `${participant.prenom} ${participant.nom}`.toUpperCase();
            doc.fillColor('black')
               .fontSize(18)
               .font('Helvetica-Bold')
               .text(fullName, 20, 110, { align: 'center', width: 243.46 });

            doc.fontSize(12)
               .font('Helvetica')
               .fillColor('#64748b')
               .text(participant.entreprise || '', 20, 135, { align: 'center', width: 243.46 });

            // --- Badge Category ---
            const categoryColor = participant.categorieBadge === 'VIP' ? '#ed8936' : '#4299e1';
            doc.rect(60, 160, 163.46, 30).fill(categoryColor);
            doc.fillColor('white')
               .fontSize(12)
               .font('Helvetica-Bold')
               .text(participant.categorieBadge.toUpperCase(), 0, 170, { align: 'center', width: 283.46 });

            // --- QR Code ---
            const qrBuffer = await QRCode.toBuffer(participant.qrCodeToken, {
                margin: 1,
                width: 150,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });

            doc.image(qrBuffer, 66.73, 210, { width: 150 });

            // --- URN (Registration Number) ---
            // Generating a visual URN from ID
            const urn = `124${String(participant.id).padStart(5, '0')}`;
            doc.fillColor('#94a3b8')
               .fontSize(9)
               .font('Helvetica-Bold')
               .text(`URN: ${urn}`, 0, 370, { align: 'center', width: 283.46 });

            // --- Footer ---
            doc.fontSize(7)
               .font('Helvetica')
               .fillColor('#94a3b8')
               .text('Ynov Casablanca - 2 Mai 2026', 0, 400, { align: 'center', width: 283.46 });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateBadgeBuffer };
