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
        from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>', // sender address
        to: email, // list of receivers
        subject: "APV - Comprueba tu cuenta", // Subject line
        text: "Comprueba tu cuenta APV", // plain text body
        html: ` <p> Hola <strong>${nombre},</strong> Comprueba tu cuenta en APV</p>
        <p>Hace falta solo un paso para confirmar tu cuenta, haz click en el siguiente enlace: 
        <a href='${process.env.FRONTEND_URL}/confirmar/${token}'>Comprobar Cuenta</a>
        </p>
        
        <p>Si no creaste esta cuenta puedes eliminar este mensaje</p>
 
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
        from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>', // sender address
        to: email, // list of receivers
        subject: "Reestablece tu contraseña", // Subject line
        text: "Reestablece tu contraseña", // plain text body
        html: ` <p> Hola <strong>${nombre},</strong> has solicitado reestablecer tu contraseña</p>
        <p>Sigue el siguiente enlace para generar una nueva contraseña: 
        <a href='${process.env.FRONTEND_URL}/olvide-password/${token}'>Reestablecer contraseña</a>
        </p>
        
        <p>Si no solicitaste un cambio de contraseña de tu cuenta en APV 
        o no creaste una cuenta con este servicio, puedes ignorar este mensaje</p>
 
        `, // html body
    });

    console.log("Mensaje enviado: %s", info.messageId);
};
