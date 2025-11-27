const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      // Buscar usuario por username o email
      const user = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { username: username },
            { email: username }
          ]
        }
      });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      // Verificar contraseña
      const isValidPassword = await user.validPassword(password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;