// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Middleware para verificar si el usuario ha completado 2FA
const isTwoFactorVerified = (req, res, next) => {
  if (req.isAuthenticated() && req.session.twoFactorVerified) {
    return next();
  }
  res.redirect('/login');
};

// Middleware para usuarios no autenticados
const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');
};

module.exports = {
  isAuthenticated,
  isTwoFactorVerified,
  isNotAuthenticated
};