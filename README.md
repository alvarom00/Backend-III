# Backend III - Proyecto Final  
Autor: Álvaro Manterola

Este proyecto implementa un servidor en Node.js con Express, conectado a MongoDB mediante Mongoose. Incluye autenticación basada en JWT, documentación con Swagger, pruebas funcionales y un entorno completamente dockerizado mediante Docker y Docker Compose.

---

## Ejecución con Docker

### 1. Clonar el repositorio
git clone https://github.com/alvarom00/Backend-III
cd Backend-III

### 2. Crear archivo .env  
Ejemplo:
PORT=8080
JWT_SECRET=secretcoder123
MONGO_URL=mongodb://admin:admin123@mongo:27017/ecommerce?authSource=admin

### 3. Levantar los contenedores
docker compose up --build

### 4. Servicios disponibles
Backend API: http://localhost:8080  
Documentación Swagger: http://localhost:8080/api/docs  
Mongo Express: http://localhost:8081  
MongoDB: localhost:27017  

---

## Pruebas funcionales
Las pruebas se encuentran en la carpeta src/test.

Para ejecutarlas:
npm test

---

## Imagen en Docker Hub

docker pull alvaromanterola/backendiii:latest

---

## Ejecución sin Docker
npm install  
npm start

---

Proyecto realizado como entrega final para el curso Backend III de Coderhouse.
