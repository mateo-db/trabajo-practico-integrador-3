import mongoose from 'mongoose'

export const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Se conectó a la BD exitosamente')
    } catch (error) {
        console.log('Error interno del servidor al conectar a la BD: ', error)
    }
}