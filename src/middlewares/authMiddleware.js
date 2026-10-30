import { verifyToken } from "../helpers/jwt.helper.js";

export const authMiddleware = async (req, res) => {
    try {
        //leemos token desde las cookies en la request
        const evaluatedToken = req.cookies.token

        //evaluamos validez del token, si no es válido devolvemos error y mensaje
        if (!evaluatedToken) {
            return res.status(401).json({
                message: 'Token inválido'
            })
        }

        //verificamos token con helper
        const verifiedToken = verifyToken(evaluatedToken)
        //el helper ya hace su propio manejo de errores con respecto al token, por lo cual no es necesario hacerlo nosotros acá

        //añadimos campo "data" a la request, este campo guardará el token verificado 
        //esto se hace para su posterior evaluación en otros middlewares (admin, owner etc)
        req.data = verifiedToken

        next() //NECESARIO para seguir al siguiente middleware en la ruta
    } catch (error) {
        return res.status(500).json({
            message: `Error al ejecutar authMiddleware: ${error.message}`
        })
    }
}