const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const { authMiddleware } = require('../middleware/auth');

// Public
router.post('/register', participantController.register);

// Protected (Web or App scan)
router.get('/admin/participants', authMiddleware, participantController.getAll);
router.post('/admin/checkin/:token', authMiddleware, participantController.checkIn);
router.get('/admin/checkin/:token', participantController.checkIn); // Support for browser scan
router.get('/admin/stats', authMiddleware, participantController.stats);

module.exports = router;
