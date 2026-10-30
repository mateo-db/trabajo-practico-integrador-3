import jwt from "jsonwebtoken";

// función que generará el token
export const generateToken = (payload) => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET, process.env.JWT_EXPIRES);
    } catch (error) {
        throw new Error("Error generando el token: " + error.message);
    }
};

// verificamos token
export const verifyToken = (token) => {
    try {
        console.log(token)
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error("EL ERROR REAL DE JWT ES:", error)
        throw new Error("Error verificando el token: " + error.message);
    }
};