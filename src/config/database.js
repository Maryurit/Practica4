const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configuración simple y robusta
const sequelize = new Sequelize(
  process.env.RDS_DB_NAME || 'lab_app_db',
  process.env.RDS_USERNAME || 'admin', 
  process.env.RDS_PASSWORD || 'LabPassword123!',
  {
    host: process.env.RDS_HOSTNAME || 'localhost',
    port: process.env.RDS_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3
    }
  }
);

const connectDB = async () => {
  try {
    console.log('🔗 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados correctamente');
    
    return sequelize;
  } catch (error) {
    console.error('❌ ERROR CRÍTICO en base de datos:', error.message);
    console.error('🔧 Detalles:', error);
    
    // Fallback a SQLite inmediato
    console.log('🔄 Cambiando a SQLite como fallback...');
    const sqlite = new Sequelize({
      dialect: 'sqlite',
      storage: './lab_app.sqlite',
      logging: false
    });
    
    try {
      await sqlite.authenticate();
      console.log('✅ Conectado a SQLite local');
      await sqlite.sync({ force: false });
      console.log('✅ Modelos sincronizados en SQLite');
      return sqlite;
    } catch (sqliteError) {
      console.error('❌ Error incluso con SQLite:', sqliteError.message);
      process.exit(1);
    }
  }
};

module.exports = { sequelize, connectDB, DataTypes };