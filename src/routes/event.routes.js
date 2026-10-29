import { Router } from "express";

export const eventRoutes = Router()

//crear un evento con categorias, (usuario autenticado = organizador)
eventRoutes.post('/events')

//listar todos los eventos poblando su organizer y categories (usuario autenticado)
eventRoutes.get('/events')

//listar los eventos del usuario logueado (usuario autenticado)
eventRoutes.get('/events/my')

//obtener un evento por id poblando su organizador y categories (usuario autenticado)
eventRoutes.get('/events/:eventId')

//actualizar un evento por id y sus categorias (solo organizador o admin)
eventRoutes.put('/events/:eventId')

//eliminar físicamente un evento por su id (solo organizador o admin)
userRoutes.delete('/events/:eventId')

