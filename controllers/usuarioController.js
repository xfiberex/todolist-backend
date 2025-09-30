import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";
import generarId from "../helpers/generarId.js"; // Suponiendo que tienes un helper similar para tokens simples

export const registrar = async (req, res) => {
    const { email, nombre, apellido } = req.body;

    // 1. Validación de campos vacíos
    if ([nombre, apellido, email].some((campo) => !campo || campo.trim() === "")) {
        const error = new Error("Todos los campos son obligatorios");
        return res.status(400).json({ msg: error.message });
    }

    // Prevenir usuarios duplcleicados
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
        const error = new Error("El usuario ya se encuentra registrado");
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardar el Nuevo Usuario
        const usuario = new Usuario(req.body);
        usuario.token = generarId(); // Genera un token único para la confirmación
        const usuarioGuardado = await usuario.save();

        // Enviar el email de confirmación
        emailRegistro({
            email,
            nombre,
            apellido,
            token: usuarioGuardado.token,
        });

        res.json({
            msg: "¡Cuenta creada exitosamente! Revisa tu correo para confirmarla. Puedes cerrar esta pagina",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};

export const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu Cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    // Comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            token: generarJWT(usuario._id), // Se genera el JSON Web Token para la sesión
        });
    } else {
        const error = new Error("La contraseña es Incorrecta");
        return res.status(403).json({ msg: error.message });
    }
};

export const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error("Token no válido");
        return res.status(403).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = ""; // El token es de un solo uso
        await usuarioConfirmar.save();
        res.json({
            msg: "Usuario Confirmado Correctamente, Presiona en Iniciar Sesión",
        });
    } catch (error) {
        console.log(error);
    }
};

export const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuario.token = generarId();
        await usuario.save();

        // Enviar Email con instrucciones
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        });

        res.json({
            msg: "Hemos enviado un email con las instrucciones, puedes cerrar esta pagina",
        });
    } catch (error) {
        console.log(error);
    }
};

export const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Usuario.findOne({ token });

    if (tokenValido) {
        res.json({ msg: "Token válido y el Usuario existe" });
    } else {
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message });
    }
};

export const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({ msg: "Contraseña modificada correctamente" });
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message });
    }
};

export const perfil = (req, res) => {
    const { usuario } = req; // Esto viene del middleware 'checkAuth'
    res.json(usuario);
};

export const actualizarPerfil = async (req, res) => {
    const usuario = await Usuario.findById(req.usuario._id);

    if (!usuario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    let emailCambiado = false; // Variable para controlar el flujo

    // 2. Lógica mejorada para el cambio de email
    if (usuario.email !== email) {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            const error = new Error("Ese correo ya está en uso");
            return res.status(400).json({ msg: error.message });
        }

        // --- LÓGICA DE RE-CONFIRMACIÓN ---
        usuario.email = email;
        usuario.confirmado = false; // El usuario debe confirmar de nuevo
        usuario.token = generarId(); // Se genera un nuevo token de un solo uso
        emailCambiado = true; // Marcamos que el email ha cambiado
    }

    // Actualizamos nombre y apellido sin importar si el email cambió o no
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.apellido = req.body.apellido || usuario.apellido;

    try {
        const usuarioActualizado = await usuario.save();

        // 3. Si el email cambió, enviamos el nuevo correo de confirmación
        if (emailCambiado) {
            emailRegistro({
                email: usuarioActualizado.email,
                nombre: usuarioActualizado.nombre,
                token: usuarioActualizado.token,
            });

            // 4. Enviamos un mensaje específico para este caso
            return res.json({
                msg: "Perfil actualizado. Se ha enviado un correo para confirmar tu nueva dirección de email. Por favor, revisa tu bandeja de entrada.",
                emailCambiado: true, // Enviamos una bandera para facilitar el trabajo al frontend
            });
        }

        // Mensaje estándar si solo se cambió nombre/apellido
        res.json({
            msg: "Perfil almacenado correctamente",
            usuario: usuarioActualizado,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};

export const actualizarPasswordPerfil = async (req, res) => {
    // --- 1. Leer los datos ---
    const { id } = req.usuario;
    const { pwd_actual, pwd_nuevo } = req.body;

    // --- 2. Comprobar que el usuario existe ---
    const usuario = await Usuario.findById(id);
    if (!usuario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    // --- 3. Comprobar la contraseña actual ---
    if (await usuario.comprobarPassword(pwd_actual)) {
        // --- 4. Almacenar la NUEVA contraseña ---
        // Se asigna la contraseña nueva, no la actual.
        usuario.password = pwd_nuevo;

        // El método .save() activará el middleware 'pre-save' del modelo User
        // que se encargará de hashear esta nueva contraseña antes de guardarla.
        await usuario.save();

        // Enviar respuesta de éxito
        res.json({ msg: "Contraseña actualizada correctamente" });
    } else {
        // Si la contraseña actual no coincide, enviar error.
        const error = new Error("La Contraseña Actual es Incorrecta");
        return res.status(400).json({ msg: error.message });
    }
};
