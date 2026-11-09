import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { EventModel } from "../models/event.model.js";

//Listar los usuarios activos con el virtual populate events (solo admin)
export const getAllUsers = async (_req, res) => {
    try {
        const allUsers = await UserModel.find({deletedAt: null}, 'profile role') //para que el find coincida con los usuarios activos (donde deletedAt vale 'null') y traiga solo los campos indicados ('profile' y 'role') de esos modelos de usuario 
        .populate({
            path: 'user_events',
            select: 'title description -_id' //poblar el virtual trayendo solo 'title' y 'description' de los eventos, excluyendo su '_id', en estas configuraciones generalmente se puede excluir solo _id a la vez que se incluyen otros campos
        })
        return res.status(200).json({
            message: `Usuarios activos y sus eventos encontrados`,
            data: allUsers
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error interno del servidor al intentar listar usuarios activos"
        })
    }
}

//obtener un usuario activo con sus eventos (solo admin)
export const getUserById = async (req, res) => {
    try {
        const { userId } = matchedData(req, {locations: ['params']})
        const userById = await UserModel.findOne({
            _id: userId,
            deletedAt: null
        }, 'profile role')
        .populate({
            path: 'user_events',
            select: 'title description -_id'
        })
        return res.status(200).json({
            message: `Usuario activo con id y sus eventos encontrados`,
            data: userById
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error interno del servidor al listar usuario activo por id"
        })
    }
}

//actualización de usuario por su id (solo admin)
export const updateUserById = async (req, res) => {
    try {
        const { userId } = matchedData(req, {locations: ['params']}) //desestructuramos valor de parámetro userId y guardamos en memoria
        const dataToUpdate = matchedData(req, {locations: ['body']}) //obtenemos datos provenientes del body que pasaron validaciones
        const userFound = await UserModel.findById(userId) //buscamos modelo por id que vino desde params

        if (!userFound) {
            return res.status(404).json({
                message: "Usuario a actualizar no encontrado"
            })
        }


        //preparamos actualización de propiedad embebida profile
        const embeddedUpdate = {
            ...userFound.profile, //1ro, copia de perfil original del modelo
            ...dataToUpdate.profile //2do, copia de la actualización de profile que vino por body
        }

        //realizamos actualización sobre modelo indicando id y campos con valores actualizados
        const userUpdated = await UserModel.findByIdAndUpdate(userId, {
            ...dataToUpdate, //descomponemos los campos que hayan venido desde el body a actualizar y los incorporamos dentro del nuevo objeto
            profile: embeddedUpdate //asignamos a la propiedad embebida profile la actualización que preparamos, de modo que no se pierdan datos y se modifique solo lo que vino por body
        },
        {
            returnDocument: 'after'
        })

        return res.status(200).json({
            message: 'Usuario actualizado con éxito: ',
            data: userUpdated
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno del servidor al intentar actualizar el usuario"
        })
    }
}
