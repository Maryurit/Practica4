const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const { isNotAuthenticated, isAuthenticated } = require('../middleware/auth');

// Rutas de autenticación
router.get('/register', isNotAuthenticated, authController.showRegister);
router.post('/register', isNotAuthenticated, authController.register);

router.get('/login', isNotAuthenticated, authController.showLogin);
router.post('/login', isNotAuthenticated, 
  passport.authenticate('local', {
    failureRedirect: '/login?error=Credenciales inválidas'
  }),
  authController.login
);

router.get('/setup-2fa', isAuthenticated, authController.showSetup2FA);
router.post('/setup-2fa', isAuthenticated, authController.verify2FASetup);

router.get('/verify-2fa', isAuthenticated, authController.showVerify2FA);
router.post('/verify-2fa', isAuthenticated, authController.verify2FALogin);

router.post('/logout', authController.logout);

module.exports = router;