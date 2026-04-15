const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

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

// Static Files (Frontend)
const frontendPath = path.join(__dirname, '../../yevents/dist');
app.use(express.static(frontendPath));

// Handle client-side routing (SPA)
app.get('*', (req, res) => {
    // If request is not for API, serve index.html
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Serving frontend from: ${frontendPath}`);
});

module.exports = app;
