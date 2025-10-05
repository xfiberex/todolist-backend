import jwt from "jsonwebtoken";

// No incluir datos sensibles en el payload
const generarJWT = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export default generarJWT;
