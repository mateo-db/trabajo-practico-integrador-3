import { body, param } from 'express-validator'
import { UserModel } from '../../models/user.model.js'

//array de validaciones para id de usuario que viene por params
export const userIdValidations = [
    param('userId')
    .isMongoId().withMessage('El id del usuario a actualizar debe ser un ObjectId de MongoDB')
    .custom(async (userId) => {
        const userExists = await UserModel.findById(userId)
        if (!userExists) {
            throw new Error('El id de usuario recibido no corresponde a un usuario registrado')
        }
    })
]