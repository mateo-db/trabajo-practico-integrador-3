//importaciones necesarias
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { conn } from './src/config/database.js'
import { userRoutes } from './src/routes/user.routes.js'
import { authRoutes } from './src/routes/auth.routes.js'
import { categoryRoutes } from './src/routes/category.routes.js'
import { eventRoutes } from './src/routes/event.routes.js'

//constante de express en memoria
const app = express()
const PORT = process.env.PORT || 3003

//middlewares globales en orden correcto
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//rutas generales
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', eventRoutes)

//dejamos server en escucha
app.listen(PORT, async () => {
    await conn(),
    console.log(`Servidor escuchando exitosamente en puerto ${PORT}`)
})