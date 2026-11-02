import { Router } from "express";
import { 
    loginUserValidations, 
    registerUserValidations, 
    updateUserProfileValidations } from "../middlewares/validations/auth.validations.js";
import { checkValidationsResult } from "../middlewares/validationResultHandler.js";
import { 
    getUserProfile, 
    logUserIn, 
    logUserOut, 
    registerUser, 
    updateUserProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authRoutes = Router()

//RUTAS PÚBLICAS
//registrar usuario con perfil embebido
authRoutes.post('/auth/register', registerUserValidations, checkValidationsResult, registerUser)

//login de usuario (jwt enviado como cookie segura)
authRoutes.post('/auth/login', loginUserValidations, checkValidationsResult, logUserIn)
//logUserIn ya controla si el si el usuario está registrado, si su contraseña es válida, etc.. no hace falta middlewares de validación

// RUTAS PRIVADAS
// logout limpiando la cookie de autenticación (usuario autenticado)
authRoutes.post('/auth/logout', authMiddleware, logUserOut)

// //perfil del usuario autenticado (usuario autenticado)
authRoutes.get('/auth/profile', authMiddleware, getUserProfile)

// actualizar perfil embebido de usuario autenticado (usuario autenticado)
authRoutes.put('/auth/profile', authMiddleware, updateUserProfileValidations, checkValidationsResult, updateUserProfile)
