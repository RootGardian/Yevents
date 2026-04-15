const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// --- Middleware ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- API Routes (loaded with error catching) ---
try {
    const authRoutes = require('./routes/auth');
    const participantRoutes = require('./routes/participants');
    const adminRoutes = require('./routes/admin');

    app.use('/api', authRoutes);
    app.use('/api', participantRoutes);
    app.use('/api/admin', adminRoutes);
    console.log('[BOOT] API routes loaded successfully.');
} catch (err) {
    console.error('[BOOT] FATAL: Failed to load API routes:', err.message);
    console.error(err.stack);
}

// --- Health check (always available) ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Static Files (Frontend) ---
const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, '../../yevents/dist');
const indexPath = path.join(frontendPath, 'index.html');

console.log(`[BOOT] Frontend path: ${frontendPath}`);
console.log(`[BOOT] Frontend path exists: ${fs.existsSync(frontendPath)}`);
console.log(`[BOOT] index.html exists: ${fs.existsSync(indexPath)}`);

if (fs.existsSync(frontendPath)) {
    try {
        const contents = fs.readdirSync(frontendPath);
        console.log(`[BOOT] Frontend dir contents: ${contents.join(', ')}`);
    } catch (e) {
        console.error('[BOOT] Cannot read frontend dir:', e.message);
    }
}

app.use(express.static(frontendPath));

// --- SPA Fallback (Express 4 compatible) ---
app.get('*', (req, res) => {
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend not found');
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BOOT] Server listening on 0.0.0.0:${PORT}`);
    console.log(`[BOOT] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[BOOT] DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
});
