//importaciones necesarias
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { conn } from './src/config/database'

//constante de express en memoria
const app = express()
const PORT = process.env.PORT || 3003

//middlewares globales en orden correcto
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//dejamos server en escucha
app.listen(PORT, async () => {
    await conn(),
    console.log(`Servidor escuchando exitosamente en puerto ${PORT}`)
})