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

Crea un archivo `.env` en `todolist-backend/`. Usa `.env.example` como plantilla y copia/ajusta a `.env`.

Flags y opciones relevantes:

```env
# Seguridad y límites
RATE_LIMIT_LOGIN_MAX=10
RATE_LIMIT_FORGOT_MAX=5
RESET_TOKEN_TTL_MIN=60
ENABLE_CSP=0

# Demo y limpieza
DEMO_USER_EMAIL=
DEMO_CLEAN_SCHEDULE=0 3 * * *
CRON_TZ=UTC
CLEAN_DEMO_ON_STARTUP=0
DISABLE_CRON=0

# Feature flags (rutas públicas)
ENABLE_PUBLIC_REGISTRATION=1
ENABLE_FORGOT_PASSWORD=1
```

Notas:
- En desarrollo, CORS permite cualquier origen (útil para Postman). En producción se valida contra `FRONTEND_URL`.
- Rate limit global: 50 peticiones/15 min/IP sobre `/api`. Además hay límites específicos:
	- Login: `RATE_LIMIT_LOGIN_MAX` (por defecto 10/15 min)
	- Olvide password: `RATE_LIMIT_FORGOT_MAX` (por defecto 5/h)
- Reset password: los tokens expiran tras `RESET_TOKEN_TTL_MIN` (por defecto 60 minutos).
- Cuenta demo (opcional):
	- `DEMO_USER_EMAIL` identifica la cuenta demo.
	- Cron de limpieza diaria configurable con `DEMO_CLEAN_SCHEDULE` (por defecto 03:00 UTC), zona `CRON_TZ`.
	- `CLEAN_DEMO_ON_STARTUP=1` ejecuta una limpieza al iniciar; `DISABLE_CRON=1` deshabilita el cron.
	- La cuenta demo no puede editar perfil ni contraseña.
 - Feature flags (público):
 	- `ENABLE_PUBLIC_REGISTRATION=0` deshabilita POST `/registrar`.
 	- `ENABLE_FORGOT_PASSWORD=0` deshabilita POST `/olvide-password` (respuesta genérica para evitar enumeración). Si defines `DEMO_USER_EMAIL`, también se impide el reset para esa cuenta.

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

## � Seguridad implementada

Este backend incluye medidas prácticas orientadas a un entorno demo público:

- Helmet activado globalmente y Content-Security-Policy opcional (ENABLE_CSP=1).
- CORS restringido por `FRONTEND_URL` en producción.
- Rate limiting global y específico para rutas sensibles (login y olvido de contraseña), configurable por `.env`.
- Feature flags para “Registrar” y “Olvidé contraseña” (habilitar/deshabilitar por `.env`).
- Anti-enumeración de usuarios: respuestas genéricas en login y recuperación.
- Token de recuperación de contraseña con caducidad (`RESET_TOKEN_TTL_MIN`).
- Hash de contraseñas con bcrypt y salting.
- JWT con payload mínimo; middleware oculta campos sensibles.
- Cuenta demo (si se configura `DEMO_USER_EMAIL`):
	- Bloqueo de edición de perfil y contraseña en backend y deshabilitación en frontend.
	- Limpieza automática diaria de tareas (cron configurable por `.env`).
- Validación robusta de payloads en Tareas con `express-validator` (longitudes, enum, fecha ISO) y 400 en errores.

Estas prácticas buscan equilibrio entre seguridad, simplicidad y claridad para demostración.

## 🤖 Implementación asistida por IA

Parte de las mejoras de seguridad, limpieza programada y endurecimiento de rutas fueron iteradas con ayuda de un agente de IA durante el desarrollo, manteniendo control y revisión humana sobre cada cambio.

## �📄 Licencia

Uso educativo/demostrativo.
