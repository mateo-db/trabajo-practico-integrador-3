import { matchedData } from "express-validator";
import { EventModel } from "../models/event.model.js";

export const createEvent = async (req, res) => {
    try {
        const organizerId = req.data.id 
        const { 
            title, 
            description, 
            startDate, 
            endDate, 
            capacity, 
            price, 
            status, 
            location, 
            categories } = matchedData(req, {locations: ['body']})
        
        const newEvent = await EventModel.create({
            title,
            description,
            startDate,
            endDate,
            capacity,
            price,
            status,
            location,
            organizer: organizerId,
            categories
        })
    
        return res.status(201).json({
            message: 'Evento creado exitosamente: ',
            data: newEvent
        })
    } catch (error) {
        return res.status(500).json({
            message: `Error interno del servidor al intentar crear un evento: ${error.message}`
        })
    }
}

