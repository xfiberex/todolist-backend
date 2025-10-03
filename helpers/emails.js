import nodemailer from "nodemailer";

export const emailRegistro = async datos => {
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Enviar email
    const info = await transport.sendMail({
        from: '"ToDoList" <no-reply@todolist.com>', // sender address
        to: email, // list of receivers
        subject: "ToDoList - Confirma tu cuenta", // Subject line
        text: "Confirma tu cuenta", // plain text body
        html: ` <p> Hola <strong>${nombre},</strong> gracias por registrarte en <strong>ToDoList</strong>.</p>
        <p>Solo falta un paso para confirmar tu cuenta. Haz click en el siguiente enlace: 
        <a href='${process.env.FRONTEND_URL}/confirmar/${token}'>Confirmar Cuenta</a>
        </p>
        
        <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
 
        `, // html body
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export const emailOlvidePassword = async datos => {
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Enviar email
    const info = await transport.sendMail({
        from: '"ToDoList" <no-reply@todolist.com>', // sender address
        to: email, // list of receivers
        subject: "ToDoList - Restablece tu contraseña", // Subject line
        text: "Restablece tu contraseña", // plain text body
        html: ` <p> Hola <strong>${nombre},</strong> has solicitado restablecer tu contraseña.</p>
        <p>Sigue el siguiente enlace para crear una nueva contraseña: 
        <a href='${process.env.FRONTEND_URL}/olvide-password/${token}'>Restablecer contraseña</a>
        </p>
        
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
 
        `, // html body
    });

    console.log("Mensaje enviado: %s", info.messageId);
};
