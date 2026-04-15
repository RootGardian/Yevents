const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const APP_VERSION = '1.0.5-spa-fix';

// --- LOG TOUT LE TRAFIC (DIAGNOSTIC) ---
app.use((req, res, next) => {
    res.setHeader('X-App-Version', APP_VERSION);
    console.log(`[REQUEST] ${req.method} ${req.url} (v${APP_VERSION})`);
    next();
});

// --- Middleware ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: ['https://yevents-7o90.onrender.com', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// --- API Routes ---
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
}

// --- Health check ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: APP_VERSION });
});

// --- Static Files & SPA Routing ---
// We prioritize serving static files from the 'public' directory
const publicDir = path.join(__dirname, '..', 'public');
const indexPath = path.join(publicDir, 'index.html');

console.log(`[BOOT] Public directory initialized at: ${publicDir}`);
console.log(`[BOOT] Production index.html located: ${fs.existsSync(indexPath)}`);

// 1. Serve static assets (js, css, images)
app.use(express.static(publicDir));

// 2. SPA Wildcard: Serve index.html for any request that doesn't match a static file or API
app.get('*', (req, res) => {
    // Skip if it's an API route that reached here (404 for API)
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error(`[SPA] Fallback triggered but index.html not found at: ${indexPath}`);
        res.status(404).send('Site en cours de maintenance (Frontend introuvable)');
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BOOT] Server listening on 0.0.0.0:${PORT}`);
    console.log(`[BOOT] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[BOOT] DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
});
