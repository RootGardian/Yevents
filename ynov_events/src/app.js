const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { sendAllReminders } = require('./utils/reminders');

const prisma = require('./db');

// Dynamic Cron Job: Runs every day at 10:00 AM
// Checks if today is exactly 2 days before the event_date in settings
cron.schedule('0 10 * * *', async () => {
    try {
        const eventDateSetting = await prisma.setting.findUnique({ where: { key: 'event_date' } });
        if (!eventDateSetting) return;

        const eventDate = new Date(eventDateSetting.value);
        const today = new Date();
        
        // Calculate difference in days
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 2) {
            console.log(`[CRON] Event is in 2 days (${eventDateSetting.value}). Sending automated reminders...`);
            await sendAllReminders();
            // Log this as a system audit
            await prisma.auditLog.create({
                data: {
                    action: 'AUTO_REMINDERS',
                    details: `Envoi automatique des rappels à J-2 effectué par le système.`,
                    causerType: 'system'
                }
            });
        }
    } catch (err) {
        console.error('[CRON] Error during scheduled check:', err);
    }
}, {
    scheduled: true,
    timezone: "Africa/Casablanca"
});
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const history = require('connect-history-api-fallback');
const rateLimit = require('express-rate-limit');

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
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Needed for some SPA logic
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'", "https://yevents-7o90.onrender.com"]
        }
    }
}));

const corsOptions = {
    origin: ['https://yevents-7o90.onrender.com', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// --- Rate Limiting ---
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' }
});

const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Max 10 attempts per 15 mins for login/register
    message: { message: 'Trop de tentatives, accès bloqué temporairement (15 min).' }
});

app.use('/api/', globalLimiter);
app.use('/api/login', strictLimiter);
app.use('/api/register', strictLimiter);
app.use('/api/request-otp', strictLimiter);

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
});

// --- Render Keep-Alive Autoping (Free Tier) ---
// Envoie une requête toutes les minutes pour empêcher le service de s'endormir
const https = require('https');
const PING_INTERVAL = 60 * 1000; // 1 minute
const TARGET_URL = 'https://yevents-7o90.onrender.com/health';

setInterval(() => {
    https.get(TARGET_URL, (res) => {
        console.log(`[AUTOPING] Status: ${res.statusCode} (v${APP_VERSION})`);
    }).on('error', (err) => {
        console.error(`[AUTOPING] Error: ${err.message}`);
    });
}, PING_INTERVAL);
