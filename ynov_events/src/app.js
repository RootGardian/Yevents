const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
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
// Use path.resolve to get absolute paths from the process directory
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const indexPath = path.join(publicDir, 'index.html');

console.log(`[BOOT] Environment Diagnostic:`);
console.log(`[BOOT] -- CWD: ${process.cwd()}`);
console.log(`[BOOT] -- Dirname: ${__dirname}`);
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

console.log(`[BOOT] SPA Routing & Static Files configured.`);

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BOOT] Server listening on 0.0.0.0:${PORT}`);
    console.log(`[BOOT] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[BOOT] DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
});
