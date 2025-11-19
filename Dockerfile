# Imagen base de Node
FROM node:18

# Crear carpeta de la app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto del backend
EXPOSE 8080

# Comando para iniciar la app
CMD ["npm", "start"]
