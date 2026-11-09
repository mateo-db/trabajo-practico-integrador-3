import { Router } from "express";
import { deleteUserById, getAllUsers, getUserById, updateUserById } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { updateUserValidations, userIdValidations } from "../middlewares/validations/user.validations.js";
import { checkValidationsResult } from "../middlewares/validationResultHandler.js";

export const userRoutes = Router()


//traer un usuario activo por id poblando sus events (usuario autenticado)
userRoutes.get('/users/:userId', authMiddleware, userIdValidations, checkValidationsResult, getUserById)

//actualizar un usuario por id 
userRoutes.put('/users/:userId', authMiddleware, userIdValidations, updateUserValidations, checkValidationsResult, updateUserById)

//eliminar un usuario por id
userRoutes.delete('/users/:userId', userIdValidations, checkValidationsResult, deleteUserById)

//traer todos los users activos poblando events (solo admin)
userRoutes.get('/users', getAllUsers)