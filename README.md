
# Blog Backend - NestJS

Este es el backend para el blog de Jonathan Leiva, desarrollado con NestJS, MongoDB y otras tecnologías modernas.

## Requisitos previos

- Node.js (versión recomendada: 18 o superior)
- MongoDB
- npm

## Instalación

1. Clona este repositorio
```
bash
git clone https://github.com/tu-usuario/jonathanleivag-blog-backend.git
cd jonathanleivag-blog-backend
```
2. Instala las dependencias
```
bash
npm install
```
3. Configura las variables de entorno
   - Copia el archivo `.env.example` a `.env`
   - Completa las variables requeridas en el archivo `.env`
```
bash
cp .env.example .env
```
## Variables de entorno

| Variable | Descripción | Requerido | Ejemplo |
|----------|-------------|-----------|---------|
| PORT | Puerto donde se ejecutará la aplicación | No | 3000 |
| NODE_ENV | Entorno de ejecución | Sí | development |
| SAMESITE | Configuración de cookies SameSite | Sí | lax |
| URI_MONGO | URI de conexión a MongoDB | Sí | mongodb://localhost:27017/blog |
| JWT_SECRET | Clave secreta para JWT | Sí | mi_secreto_muy_seguro |
| EXPIRES_IN | Tiempo de expiración de JWT | Sí | 7d |
| URL_FRONTEND | URL del frontend | Sí | http://localhost:5173 |

## Scripts disponibles

- `npm run build` - Compila la aplicación
- `npm run format` - Formatea el código con Prettier
- `npm run start` - Inicia la aplicación
- `npm run start:dev` - Inicia la aplicación en modo desarrollo con recarga automática
- `npm run start:debug` - Inicia la aplicación en modo debug
- `npm run start:prod` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta ESLint para corregir problemas de código
- `npm run test` - Ejecuta los tests
- `npm run test:watch` - Ejecuta los tests en modo watch
- `npm run test:cov` - Ejecuta los tests con cobertura
- `npm run test:debug` - Ejecuta los tests en modo debug
- `npm run test:e2e` - Ejecuta los tests end-to-end

## Tecnologías principales

- [NestJS](https://nestjs.com/) - Framework de Node.js para construir aplicaciones del lado del servidor
- [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL
- [Mongoose](https://mongoosejs.com/) - ODM para MongoDB
- [JWT](https://jwt.io/) - JSON Web Tokens para autenticación
- [Swagger](https://swagger.io/) - Documentación de API

## Características

- Autenticación con JWT
- Validación con class-validator
- Documentación de API con Swagger
- Arquitectura modular con NestJS
- Conexión a MongoDB
- Sistema de paginación
- Seguridad mejorada con helmet y cors

## Licencia
[MIT](https://choosealicense.com/licenses/mit/)

## Contacto
Jonathan Leiva - [github.com/jonathanleivag](https://github.com/jonathanleivag)
[@jonathanleivag](https://www.instagram.com/jonathanleivag/)
