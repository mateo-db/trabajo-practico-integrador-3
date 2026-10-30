import { Router } from "express";

export const authRoutes = Router()

//RUTAS PÚBLICAS
//registrar usuario con perfil embebido
authRoutes.post('/auth/register')
//login de usuario (jwt enviado como cookie segura)
authRoutes.post('/auth/login')

//RUTAS PRIVADAS
//perfil del usuario autenticado (usuario autenticado)
authRoutes.get('/auth/profile')

//actualizar perfil embebido de usuario autenticado (usuario autenticado)
authRoutes.put('/auth/profile')

//logout limpiando la cookie de autenticación (usuario autenticado)
authRoutes.post('/auth/logout')