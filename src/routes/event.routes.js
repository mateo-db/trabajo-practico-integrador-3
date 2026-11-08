import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { 
    createEventValidations, 
    eventIdValidations, 
    updateEventValidations } from "../middlewares/validations/event.validations.js";
import { checkValidationsResult } from "../middlewares/validationResultHandler.js";
import { 
    createEvent, 
    deleteEventById, 
    getAllEvents, 
    getEventById, 
    getUserEvents, 
    updateEventById } from "../controllers/event.controller.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdminMiddleware.js";

export const eventRoutes = Router()

//crear un evento con categorias, (usuario autenticado = organizador)
eventRoutes.post('/events', authMiddleware, createEventValidations, checkValidationsResult, createEvent)

// //listar todos los eventos poblando su organizer y categories (usuario autenticado)
eventRoutes.get('/events', authMiddleware, getAllEvents)

// //listar los eventos del usuario logueado (usuario autenticado)
eventRoutes.get('/events/my', authMiddleware, getUserEvents)

// //obtener un evento por id poblando su organizador y categories (usuario autenticado)
/eventRoutes.get('/events/:eventId', authMiddleware, eventIdValidations, checkValidationsResult, getEventById)

//actualizar un evento por id y sus categorias (solo organizador o admin)
eventRoutes.put('/events/:eventId', authMiddleware, ownerOrAdminMiddleware, eventIdValidations, updateEventValidations, checkValidationsResult, updateEventById)

// //eliminar físicamente un evento por su id (solo organizador o admin)
eventRoutes.delete('/events/:eventId', eventIdValidations, checkValidationsResult, deleteEventById)

