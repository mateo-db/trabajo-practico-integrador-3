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

export const getAllEvents = async (_req, res) => {
    try {
        const allEvents = await EventModel.find()
        .populate({
            path: 'organizer',
            select: 'profile role -_id',
        })
        .populate({
            path: 'categories',
            select: 'name description -_id'
        })

        return res.status(200).json({
            message: 'Todos los eventos: ',
            data: allEvents
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al traer los eventos'
        })
    }

}

export const getUserEvents = async (req, res) => {
    try {
        const userId = req.data.id
        const userEvents = await EventModel.find({organizer: userId})
        
        if (!userEvents) {
            return res.status(404).json({
                message: 'El usuario de esta sesión todavía no tiene eventos organizados por él'
            })
        }

        return res.status(200).json({
            message: 'Tus eventos: ',
            data: userEvents
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al traer eventos del usuario'
        })
    }
}
