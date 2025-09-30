import jwt from "jsonwebtoken";

// No almacenar información sensible en un JWT
const generarJWT = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export default generarJWT;
