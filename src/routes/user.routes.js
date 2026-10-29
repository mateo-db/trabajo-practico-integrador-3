import { Router } from "express";

export const userRoutes = express()


//traer un usuario activo por id poblando sus events (usuario autenticado)
userRoutes.get('/users/:userId')

//actualizar un usuario por id 
userRoutes.put('/users/:userId')

//eliminar un usuario por id
userRoutes.delete('/users/:userId')

//traer todos los users activos poblando events (solo admin)
userRoutes.get('/users')