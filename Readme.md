Lab App 2FA - Documentación
📋 Descripción
Aplicación web con autenticación de 2 factores (2FA) desarrollada con Node.js, Express, Passport, MySQL RDS y desplegada en AWS.

🚀 Características
✅ Registro y login de usuarios

✅ Autenticación de 2 factores con Google Authenticator

✅ Base de datos MySQL en AWS RDS

✅ Despliegue automático con CloudFormation

✅ Docker y Docker Compose listos

🛠️ Instalación y Ejecución Local
Prerrequisitos
Node.js 16+

MySQL 8.0+

Git

1. Clonar Repositorio
bash
git clone https://github.com/Maryurit/lab-app-2fa.git
cd lab-app-2fa
2. Instalar Dependencias
bash
npm install
3. Configurar Variables de Entorno
Crear archivo .env:

env
NODE_ENV=development
PORT=3000
SESSION_SECRET=lab_secret_key_2025

# Base de datos local
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lab_app_db
DB_USER=root
DB_PASS=password

# O configuración RDS
RDS_HOSTNAME=tu-endpoint.rds.amazonaws.com
RDS_PORT=3306
RDS_DB_NAME=lab_app_db
RDS_USERNAME=admin
RDS_PASSWORD=tu_password
4. Configurar Base de Datos
bash
# Conectar a MySQL y crear base de datos
mysql -u root -p
CREATE DATABASE lab_app_db;
EXIT;
5. Ejecutar la Aplicación
bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
6. Acceder a la Aplicación
Abrir en navegador: http://localhost:3000

🐳 Ejecutar con Docker
1. Construir y Ejecutar
bash
# Usar Docker Compose (recomendado)
docker-compose up --build

# O solo con Docker
docker build -t lab-app-2fa .
docker run -p 3000:3000 lab-app-2fa
2. Acceder con Docker
Abrir: http://localhost:3000

☁️ Despliegue en AWS con CloudFormation
Prerrequisitos
Cuenta AWS con permisos

Key Pair EC2: Practica4

AWS CLI configurado

1. Preparar Template
Guardar como cloudformation-lab-app.yaml el template proporcionado.

2. Desplegar Stack
bash
aws cloudformation create-stack \
  --stack-name lab-app-maryurit \
  --template-body file://cloudformation-lab-app.yaml \
  --parameters ParameterKey=DBPassword,ParameterValue=LabPassword123! \
  --capabilities CAPABILITY_IAM
3. Verificar Despliegue
bash
# Ver estado
aws cloudformation describe-stacks --stack-name lab-app-maryurit

# Ver URL de la aplicación
aws cloudformation describe-stacks --stack-name lab-app-maryurit --query "Stacks[0].Outputs"
4. Acceder a la Aplicación Desplegada
Copiar la ApplicationURL de los Outputs

Abrir en navegador: http://IP_PUBLICA:3000

📱 Configurar 2FA
1. Registrar Usuario
Ir a http://localhost:3000/register

Crear nueva cuenta

2. Configurar Autenticación 2FA
Después del login, serás redirigido a /setup-2fa

Escanea el código QR con Google Authenticator

O ingresa manualmente la clave secreta

Verifica con código de 6 dígitos

3. Usar Google Authenticator
Descargar Google Authenticator (iOS/Android)

Escanear QR o ingresar clave manualmente

Usar códigos de 6 dígitos para login

🗄️ Estructura del Proyecto
text
lab-app-2fa/
├── src/
│   ├── controllers/     # Lógica de autenticación
│   ├── models/          # Modelos de base de datos
│   ├── routes/          # Rutas de la aplicación
│   ├── config/          # Configuración DB y Passport
│   ├── middleware/      # Middlewares de autenticación
│   └── utils/           # Utilidades 2FA
├── views/               # Vistas EJS
├── public/              # Archivos estáticos
├── Dockerfile           # Configuración Docker
├── docker-compose.yml   # Orquestación Docker
└── cloudformation.yaml  # Despliegue AWS
🔧 Comandos Útiles
Desarrollo
bash
npm run dev      # Modo desarrollo con nodemon
npm start        # Modo producción
npm test         # Ejecutar tests
Base de Datos
bash
# Conectar a RDS
mysql -h endpoint.rds.amazonaws.com -u admin -p

# Ver tablas
USE lab_app_db;
SHOW TABLES;
SELECT * FROM users;
Docker
bash
docker-compose up -d        # Ejecutar en segundo plano
docker-compose logs -f      # Ver logs
docker-compose down         # Detener contenedores
AWS
bash
# Conectar a instancia EC2
ssh -i "Practica4.pem" ubuntu@IP_PUBLICA

# Ver logs en EC2
pm2 logs lab-app-maryurit
pm2 status