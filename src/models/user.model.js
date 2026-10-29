//importaciones necesarias
import { model, Schema } from "mongoose";

//esquema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    profile: {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        birthDate: {
            type: Date,
        },
        phone: {
            type: String
        }
    },
    deletedAt: {
        type: Date,
        default: null
    }
})

//virtual para crear relación no física desde modelo user hacia modelo events
userSchema.virtual('user_events', {
    ref: "Event", //referencia, nombre del modelo al que estamos referenciando en nuestro virtual
    localField: "_id", //campo del esquema donde se declara el virtual (user), casi siempre es "_id"
    foreignField: "organizer" //campo del esquema al que hace referencia el virtual (event), que contendrá el ObjectId que coincida con el campo local "_id" que identifica al user
})

//exportación
export const UserModel = model('User', userSchema)
