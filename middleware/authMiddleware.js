// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Agrega el usuario del token a la petición
            const usuario = await Usuario.findById(decoded.id).select(
                "-password -confirmado -token -createdAt -updatedAt -__v"
            );
            if (!usuario) {
                return res.status(401).json({ msg: "Token no válido" });
            }
            req.usuario = usuario;

            return next(); // Pasa al siguiente middleware o controlador
        } catch (error) {
            return res.status(401).json({ msg: "Token no válido" });
        }
    }

    if (!token) {
        const error = new Error("Token no válido o inexistente");
        return res.status(401).json({ msg: error.message });
    }

    next();
};

export default checkAuth;
