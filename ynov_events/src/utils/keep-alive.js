const https = require('https');
const http = require('http');

/**
 * Pings the application URL to keep it from sleeping on Render free tier.
 * @param {string} url - The full URL to ping (e.g., https://myapp.onrender.com/health)
 * @param {number} intervalMinutes - Interval between pings in minutes (default: 14)
 */
function startKeepAlive(url, intervalMinutes = 14) {
    if (!url) {
        console.warn('[KEEP-ALIVE] No SELF_URL provided. Skipping keep-alive initialization.');
        return;
    }

    console.log(`[KEEP-ALIVE] Initializing keep-alive for: ${url} (every ${intervalMinutes}m)`);

    const client = url.startsWith('https') ? https : http;

    setInterval(() => {
        console.log(`[KEEP-ALIVE] Pinging ${url}...`);
        
        client.get(url, (res) => {
            console.log(`[KEEP-ALIVE] Ping status: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error(`[KEEP-ALIVE] Ping error: ${err.message}`);
        });
    }, intervalMinutes * 60 * 1000);
}

module.exports = startKeepAlive;
