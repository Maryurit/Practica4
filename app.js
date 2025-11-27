const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Importaciones de configuración
const { connectDB } = require('./src/config/database');
const passport = require('./src/config/passport');

// Importaciones de rutas
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Inicializar aplicación Express
const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// ✅ CONFIGURACIÓN EJS (REEMPLAZA HANDLEBARS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🔍 DEBUG: VERIFICAR RUTAS Y ARCHIVOS (AGREGA ESTO)
console.log('🔍 VERIFICACIÓN DE RUTAS:');
console.log('📍 Ruta views:', path.join(__dirname, 'views'));

const fs = require('fs');
const viewsPath = path.join(__dirname, 'views');

// Verificar si el directorio existe
console.log('📁 Directorio views existe:', fs.existsSync(viewsPath));

if (fs.existsSync(viewsPath)) {
  // Listar archivos
  const files = fs.readdirSync(viewsPath);
  console.log('📋 Archivos en views:', files);
  
  // Verificar archivos específicos
  const requiredFiles = ['login.ejs', 'register.ejs', 'dashboard.ejs'];
  requiredFiles.forEach(file => {
    const filePath = path.join(viewsPath, file);
    const exists = fs.existsSync(filePath);
    console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
    
    if (exists) {
      const stats = fs.statSync(filePath);
      console.log(`     Tamaño: ${stats.size} bytes`);
    }
  });
} else {
  console.log('❌ ERROR: Directorio views NO existe');
}
// FIN DEBUG 🔍

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para hacer disponible el usuario en todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Rutas
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.session.twoFactorVerified) {
      res.redirect('/dashboard');
    } else if (req.user && req.user.isTwoFactorEnabled) {
      res.redirect('/verify-2fa');
    } else {
      res.redirect('/setup-2fa');
    }
  } else {
    res.redirect('/login');
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <body>
        <h1>Página No Encontrada</h1>
        <p>La página que buscas no existe.</p>
        <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err);
  res.status(500).send(`
    <html>
      <body>
        <h1>Error del Servidor</h1>
        <p>Ha ocurrido un error interno del servidor.</p>
        <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`✅ Usando EJS - Sin problemas de vistas`);
});

module.exports = app;