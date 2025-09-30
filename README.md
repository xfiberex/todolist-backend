# Backend - Gestor de Teras

Este directorio contiene el código fuente del backend para la aplicación de gestión de tareas. Es una API RESTful construida con Node.js y Express, diseñada para manejar la lógica de negocio, la autenticación de usuarios y la interacción con la base de datos.

## ✨ Características Principales

*   **API RESTful**: Endpoints para la gestión completa de usuarios y tareas.
*   **Autenticación con JWT**: Sistema de registro, inicio de sesión y sesiones seguras mediante JSON Web Tokens.
*   **Seguridad**: Hashing de contraseñas con `bcrypt` para un almacenamiento seguro.
*   **Confirmación por Email**: Flujo de confirmación de cuenta para nuevos usuarios a través de email.
*   **Recuperación de Contraseña**: Funcionalidad para que los usuarios puedan restablecer su contraseña de forma segura.
*   **Rutas Protegidas**: Middleware que asegura que solo los usuarios autenticados puedan acceder a sus propios recursos.
*   **Base de Datos**: Utiliza MongoDB con Mongoose para un modelado de datos robusto y escalable.

## 🛠️ Tecnologías Utilizadas

*   **Node.js**: Entorno de ejecución para JavaScript.
*   **Express**: Framework para la construcción de la API.
*   **MongoDB**: Base de datos NoSQL.
*   **Mongoose**: ODM para modelar los datos de la aplicación.
*   **JSON Web Tokens (JWT)**: Para la generación de tokens de acceso.
*   **Bcrypt**: Para el hashing de contraseñas.
*   **Nodemailer**: Para el envío de correos electrónicos.
*   **Dotenv**: Para la gestión de variables de entorno.

## 🚀 Instalación y Puesta en Marcha

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```

2.  **Navegar al directorio del backend:**
    ```bash
    cd Backend
    ```

3.  **Instalar dependencias:**
    ```bash
    npm install
    ```

4.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del directorio `Backend/` y añade las siguientes variables (puedes usar el archivo `.env.example` como guía):
    ```env
    MONGO_URI=tu_string_de_conexion_a_mongodb
    JWT_SECRET=tu_palabra_secreta_para_jwt
    
    # Configuración para el envío de emails (ej. Mailtrap, Gmail)
    EMAIL_HOST=smtp.mailtrap.io
    EMAIL_PORT=2525
    EMAIL_USER=tu_usuario_email
    EMAIL_PASS=tu_password_email
    
    FRONTEND_URL=http://localhost:5173
    ```

5.  **Ejecutar el servidor en modo desarrollo:**
    ```bash
    npm run dev
    ```
    El servidor se iniciará en el puerto especificado (por defecto, el 4000).

## 🌐 Endpoints de la API

*   `/api/usuarios`: Rutas para registro, autenticación y gestión de perfiles.
*   `/api/tareas`: Rutas CRUD para las tareas (protegidas por autenticación).
