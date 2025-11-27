const dashboardController = {
  // Mostrar dashboard principal
  showDashboard: (req, res) => {
    res.render('dashboard', {
      user: req.user,
      success: req.query.success,
      error: req.query.error
    });
  },

  // Mostrar perfil de usuario
  showProfile: (req, res) => {
    res.render('profile', {
      user: req.user,
      success: req.query.success,
      error: req.query.error
    });
  },

  // Desactivar 2FA
  disable2FA: async (req, res) => {
    try {
      const user = req.user;
      user.twoFactorSecret = null;
      user.isTwoFactorEnabled = false;
      await user.save();

      res.redirect('/profile?success=2FA desactivado correctamente');
    } catch (error) {
      console.error('Error desactivando 2FA:', error);
      res.redirect('/profile?error=Error desactivando 2FA');
    }
  }
};

module.exports = dashboardController;