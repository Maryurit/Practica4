const mysql = require('mysql2/promise');

async function createDatabase() {
  console.log('🔧 Creando base de datos en RDS...\n');
  
  const config = {
    host: 'lab-app-db.c8ri0k6e026h.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'LabPassword123!',
    port: 3306,
    connectTimeout: 10000,
    ssl: 'Amazon RDS'
  };

  try {
    // Conectar sin especificar base de datos
    const connection = await mysql.createConnection(config);
    console.log('✅ Conectado al servidor RDS');

    // Crear base de datos
    await connection.execute(`CREATE DATABASE IF NOT EXISTS lab_app_db`);
    console.log('✅ Base de datos "lab_app_db" creada/existe');

    // Usar la base de datos
    await connection.execute(`USE lab_app_db`);
    console.log('✅ Usando base de datos lab_app_db');

    // Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Tablas existentes: ${tables.length}`);

    await connection.end();
    console.log('\n🎉 ¡Base de datos lista! Ejecuta: npm start');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Verifica:');
    console.log('   1. Security Group permite MySQL puerto 3306');
    console.log('   2. RDS está en estado "Available"');
    console.log('   3. Usuario y contraseña correctos');
  }
}

createDatabase();