const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

router.use(authMiddleware);
router.use(isAdmin);

router.get('/export', adminController.exportParticipants);
router.post('/resend-email', adminController.resendEmail);
router.get('/audit-logs', adminController.getAuditLogs);

// Staff management
router.get('/staff', adminController.getStaff);
router.post('/staff', adminController.createStaff);
router.delete('/staff/:id', adminController.deleteStaff);

module.exports = router;
