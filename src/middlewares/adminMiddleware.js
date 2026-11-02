//middleware global que evaluará si el usuario es admin

export const adminMiddleware = (req, res, next) => {
    try {
        const userRole = req.data.role 
    
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: "Prohibido"
            })
        }
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor al evaluar rol de user"
        })
    }
}