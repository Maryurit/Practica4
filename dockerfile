# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Crear directorio para la base de datos SQLite (fallback)
RUN mkdir -p /app/data

# Exponer puerto
EXPOSE 3000

# Variable de entorno para producción
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "start"]