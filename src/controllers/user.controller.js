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
            message: "Error interno del servidor"
        })
    }
}