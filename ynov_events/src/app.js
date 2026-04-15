const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for easier dev/prod static serving
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
const authRoutes = require('./routes/auth');
const participantRoutes = require('./routes/participants');
const adminRoutes = require('./routes/admin');

app.use('/api', authRoutes);
app.use('/api', participantRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Static Files (Frontend) - Use absolute path matching Docker layout
const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, '../../yevents/dist');
const indexPath = path.join(frontendPath, 'index.html');

console.log(`Frontend path: ${frontendPath}`);
console.log(`Index exists: ${fs.existsSync(indexPath)}`);

if (fs.existsSync(frontendPath)) {
    console.log(`Frontend dir contents: ${fs.readdirSync(frontendPath).join(', ')}`);
}

app.use(express.static(frontendPath));

// Handle client-side routing (SPA)
app.use((req, res) => {
    // Return 404 for API routes that weren't caught
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: 'API route not found' });
    }
    // For everything else, serve the React app
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(500).send('Frontend build not found. Check Docker build logs.');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
