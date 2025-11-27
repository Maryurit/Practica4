const User = require('../models/User');
const TwoFactorAuth = require('../utils/twoFactor');

const authController = {
  // Mostrar formulario de registro
  showRegister: (req, res) => {
    res.render('register', { 
      error: req.query.error  // ✅ EJS - solo pasar variables necesarias
    });
  },

  // Procesar registro
  register: async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Validaciones básicas
      if (password !== confirmPassword) {
        return res.redirect('/register?error=Las contraseñas no coinciden');
      }

      if (password.length < 6) {
        return res.redirect('/register?error=La contraseña debe tener al menos 6 caracteres');
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { username: username },
            { email: email }
          ]
        }
      });

      if (existingUser) {
        return res.redirect('/register?error=El usuario o email ya existe');
      }

      // Crear nuevo usuario
      const newUser = await User.create({
        username,
        email,
        password
      });

      // Iniciar sesión automáticamente después del registro
      req.login(newUser, (err) => {
        if (err) {
          return res.redirect('/login?error=Error al iniciar sesión');
        }
        res.redirect('/setup-2fa');
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.redirect('/register?error=Error en el servidor');
    }
  },

  // Mostrar formulario de login
  showLogin: (req, res) => {
    res.render('login', { 
      error: req.query.error  // ✅ EJS - solo pasar variables necesarias
    });
  },

  // Procesar login
  login: (req, res) => {
    // Si Passport autentica correctamente, redirigir a verificación 2FA
    if (req.user.isTwoFactorEnabled) {
      res.redirect('/verify-2fa');
    } else {
      res.redirect('/setup-2fa');
    }
  },

  // Mostrar configuración de 2FA
  showSetup2FA: async (req, res) => {
    try {
      const user = req.user;

      if (user.isTwoFactorEnabled) {
        return res.redirect('/dashboard');
      }

      // Generar nuevo secreto si no existe
      if (!user.twoFactorSecret) {
        const secret = TwoFactorAuth.generateSecret(user.email);
        user.twoFactorSecret = secret.base32;
        await user.save();
      }

      // Generar código QR
      const qrCode = TwoFactorAuth.generateQRCode({
        otpauth_url: `otpauth://totp/Lab%20App:${user.email}?secret=${user.twoFactorSecret}&issuer=Lab%20App`
      });

      res.render('setup-2fa', {
        qrCode: qrCode,        // ✅ EJS - pasar variables sin 'title'
        secret: user.twoFactorSecret,
        error: req.query.error
      });

    } catch (error) {
      console.error('Error en setup 2FA:', error);
      res.redirect('/dashboard?error=Error configurando 2FA');
    }
  },

  // Verificar y activar 2FA
  verify2FASetup: async (req, res) => {
    try {
      const { token } = req.body;
      const user = req.user;

      if (!user.twoFactorSecret) {
        return res.redirect('/setup-2fa?error=Secreto no encontrado');
      }

      const isValid = TwoFactorAuth.verifyToken(user.twoFactorSecret, token);

      if (isValid) {
        user.isTwoFactorEnabled = true;
        await user.save();
        
        req.session.twoFactorVerified = true;
        res.redirect('/dashboard?success=2FA activado correctamente');
      } else {
        res.redirect('/setup-2fa?error=Código inválido');
      }

    } catch (error) {
      console.error('Error verificando 2FA:', error);
      res.redirect('/setup-2fa?error=Error del servidor');
    }
  },

  // Mostrar verificación de 2FA para login
  showVerify2FA: (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }

    res.render('verify-2fa', {
      error: req.query.error  // ✅ EJS - solo pasar variables necesarias
    });
  },

  // Verificar código 2FA para login
  verify2FALogin: async (req, res) => {
    try {
      const { token } = req.body;
      const user = req.user;

      if (!user.twoFactorSecret) {
        return res.redirect('/login?error=2FA no configurado');
      }

      const isValid = TwoFactorAuth.verifyToken(user.twoFactorSecret, token);

      if (isValid) {
        req.session.twoFactorVerified = true;
        res.redirect('/dashboard?success=Autenticación exitosa');
      } else {
        res.redirect('/verify-2fa?error=Código 2FA inválido');
      }

    } catch (error) {
      console.error('Error en verificación 2FA:', error);
      res.redirect('/verify-2fa?error=Error del servidor');
    }
  },

  // Cerrar sesión
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.redirect('/dashboard?error=Error al cerrar sesión');
      }
      req.session.destroy();
      res.redirect('/login?success=Sesión cerrada correctamente');
    });
  }
};

module.exports = authController;