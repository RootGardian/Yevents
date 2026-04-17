const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const startKeepAlive = require('./utils/keep-alive');
const history = require('connect-history-api-fallback');

dotenv.config();

const app = express();
const APP_VERSION = '1.0.6-final-routing';

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
    res.json({ status: 'ok', version: APP_VERSION, timestamp: new Date().toISOString() });
});

// --- Static Files & SPA Routing ---
// Use absolute paths for production reliability on Render
const projectRoot = process.cwd(); // Root of the deployed project
const publicDir = path.join(projectRoot, 'public');
const indexPath = path.join(publicDir, 'index.html');

console.log(`[BOOT] Absolute Path Diagnostic:`);
console.log(`[BOOT] -- CWD (Project Root): ${projectRoot}`);
console.log(`[BOOT] -- PublicDir: ${publicDir}`);
console.log(`[BOOT] -- IndexExists: ${fs.existsSync(indexPath)}`);

// 1. History API Fallback (redirects non-API requests to index.html for SPA routing)
app.use(history({
    verbose: true,
    rewrites: [
        { from: /^\/api\/.*$/, to: (context) => context.parsedUrl.pathname }
    ]
}));

// 2. Serve static files from 'public' (CSS, JS, images, etc.)
app.use(express.static(publicDir));

// 3. Final SPA Catch-all (for security on refresh/direct access)
app.get('*', (req, res) => {
    // Only catch GET requests for potential UI pages
    if (req.method === 'GET' && !req.url.startsWith('/api')) {
        return res.sendFile(indexPath);
    }
    res.status(404).json({ error: 'Endpoint not found' });
});

console.log(`[BOOT] SPA Routing (Fallback & Catch-all) configured.`);

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BOOT] Server listening on 0.0.0.0:${PORT}`);
    console.log(`[BOOT] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[BOOT] DATABASE_URL set: ${!!process.env.DATABASE_URL}`);

    // --- Start Keep Alive ---
    // Make sure to define SELF_URL in Render environment variables
    // Format: https://your-app-name.onrender.com/health
    const selfUrl = process.env.SELF_URL || (process.env.RENDER_EXTERNAL_URL ? `${process.env.RENDER_EXTERNAL_URL}/health` : null);
    if (selfUrl) {
        startKeepAlive(selfUrl);
    } else {
        console.log('[BOOT] KEEP-ALIVE: SELF_URL not defined, skip keep-alive.');
    }
});
