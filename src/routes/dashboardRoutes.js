const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isTwoFactorVerified } = require('../middleware/auth');

// Rutas protegidas que requieren 2FA
router.get('/dashboard', isTwoFactorVerified, dashboardController.showDashboard);
router.get('/profile', isTwoFactorVerified, dashboardController.showProfile);
router.post('/disable-2fa', isTwoFactorVerified, dashboardController.disable2FA);

module.exports = router;