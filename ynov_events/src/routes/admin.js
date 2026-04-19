const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const settingsController = require('../controllers/settingsController');
const { authMiddleware, isAdmin } = require('../middleware/auth');

router.use(authMiddleware);
router.use(isAdmin);

router.post('/settings', settingsController.updateSettings);

router.get('/export', adminController.exportParticipants);
router.post('/resend-email', adminController.resendEmail);
router.post('/trigger-reminders', adminController.triggerManualReminders);
router.post('/reset-password', adminController.resetUserPassword);
router.get('/audit-logs', adminController.getAuditLogs);

// Staff management
router.get('/staff', adminController.getStaff);
router.post('/staff', adminController.createStaff);
router.delete('/staff/:id', adminController.deleteStaff);

// Admin management (Restricted to Super Admin in controller)
router.get('/admins', adminController.getAdmins);
router.post('/admins', adminController.createAdmin);
router.delete('/admins/:id', adminController.deleteAdmin);

module.exports = router;
