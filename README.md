# Backend - Gestor de Tareas

API RESTful para la aplicación de ToDo List. Construida con Node.js, Express y MongoDB (Mongoose). Maneja autenticación JWT, correos de confirmación y recuperación de contraseña, y CRUD de tareas por usuario.

## ✨ Características

- API RESTful con Express 5 y Mongoose 8
- Autenticación con JWT (login, rutas protegidas, middleware `checkAuth`)
- Confirmación de cuenta por email y recuperación de contraseña (Nodemailer)
- Seguridad: Helmet, CORS configurable, rate limiting, bcrypt para contraseñas
- Buenas prácticas: variables de entorno con dotenv, logs de arranque, puerto por defecto 4000

## 🧩 Tecnologías

- Node.js, Express, Mongoose
- JSON Web Token (jsonwebtoken)
- bcrypt
- nodemailer
- helmet, express-rate-limit, cors
- dotenv

## ⚙️ Variables de entorno

Crea un archivo `.env` en `todolist-backend/` con algo similar a:

```env
# Servidor
PORT=4000
NODE_ENV=development

# Base de datos
MONGO_URI=mongodb://localhost:27017/todolist

# Auth
JWT_SECRET=una_clave_segura_aleatoria

# App cliente
FRONTEND_URL=http://localhost:5173

# Email (ejemplo genérico: Mailtrap / proveedor SMTP)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=usuario
EMAIL_PASS=password
```

Notas:
- En desarrollo, CORS permite cualquier origen (útil para Postman). En producción se valida contra `FRONTEND_URL`.
- El rate limit actual limita a 50 peticiones por 15 minutos por IP sobre `/api`.

## 🚀 Puesta en marcha (Windows PowerShell)

```powershell
cd "c:\Users\User\Desktop\Cursos y Proyectos\03 - Proyectos de desarrollo\02-ToDoList\todolist-backend"
npm install
npm run dev
```

El servidor quedará disponible (por defecto) en `http://localhost:4000`.

## 🌐 Endpoints principales

Área Usuarios (`/api/usuarios`):
- POST `/registrar` — registro de usuario (envía email de confirmación)
- POST `/login` — autenticación, devuelve JWT
- GET `/confirmar/:token` — confirma cuenta
- POST `/olvide-password` — envía email de recuperación
- GET `/olvide-password/:token` — verifica token de recuperación
- POST `/olvide-password/:token` — define nueva contraseña
- GET `/perfil` — obtiene perfil del usuario autenticado (JWT)
- PUT `/perfil` — actualiza nombre, apellido y email (si cambia email, re-confirma)
- PUT `/actualizar-password-perfil` — cambia contraseña desde el perfil

Área Tareas (`/api/tareas`, requiere JWT):
- GET `/` — lista tareas del usuario
- POST `/` — crea tarea
- GET `/:id` — obtiene una tarea
- PUT `/:id` — actualiza una tarea
- DELETE `/:id` — elimina una tarea
- POST `/estado/:id` — alterna estado completada/incompleta

## 📝 Notas de implementación

- El hook de Mongoose evita re-hashear contraseñas si no se modifican.
- `fechaEntrega` usa `default: Date.now` (función) para evitar fechas congeladas.
- En producción, `app.set('trust proxy', 1)` habilita rate limit correcto detrás de proxy.

## 📄 Licencia

Uso educativo/demostrativo.
