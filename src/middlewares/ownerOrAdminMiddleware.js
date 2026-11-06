import { EventModel } from "../models/event.model.js"

export const ownerOrAdminMiddleware = async (req, res, next) => {
    try {
        const { eventId } = req.params
        const userRole = req.data.role 
        const userId = req.data.id

        const eventEvaluated = await EventModel.findById(eventId)

        if (!eventEvaluated) {
            return res.status(404).json({
                message: 'Evento no encontrado'
            })
        }

        if (userRole !== 'admin' && eventEvaluated.organizer.toString() !== userId) {
            return res.status(403).json({
                message: "Prohibido"
            })
        }
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor al evaluar si el usuario es administrador u organizador del evento"
        })
    }
}