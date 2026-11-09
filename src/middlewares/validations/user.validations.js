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

//array de validaciones para actualizar un usuario (solo admin)
export const updateUserValidations = [
    body('username')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 3, max: 20}).withMessage('El nombre de usuario debe ser un texto de entre 3 a 20 carácteres')
    .isAlphanumeric().withMessage('El nombre de usuario debe ser un texto alfanúmerico (contener letras y números)')
    .bail()
    .custom(async (username) => {
        const usernameExists = await UserModel.findOne({ username })
        if (usernameExists) {
            throw new Error('Ese nombre de usuario ya está en uso')
        }
        return true
    }),
    body('email')
    .optional()
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isString().withMessage('El email debe ser un texto')
    .isEmail().withMessage('El email debe ser de un formato válido (ejemplo: abc123@gmail.com')
    .bail()
    .custom(async (email) => {
        const emailExists = await UserModel.findOne({ email })
        if (emailExists) {
            throw new Error('Ese email ya está en uso')
        }
        return true
    }),
    body('password')
    .optional()
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isString().withMessage('La contraseña debe ser un texto')
    .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0
    }).withMessage('La contraseña debe ser mínimo 8 carácteres, incluyendo 1 maýuscula, minúscula y número'),
    body('role')
    .optional()
    .isString().withMessage('El rol debe ser texto')
    .isIn(['user', 'admin']),
    body('profile.firstName')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre del perfil es obligatorio')
    .isString().withMessage('El nombre del perfil debe ser un texto')
    .isLength({min: 2, max: 50}).withMessage('El nombre de perfil debe ser un texto de entre 2 a 50 carácteres')
    .isAlpha().withMessage('El nombre de perfil debe ser un texto con letras solamente'),
    body('profile.lastName')
    .optional()
    .trim()
    .notEmpty().withMessage('El apellido del perfil es obligatorio')
    .isString().withMessage('El apellido del perfil debe ser un texto')
    .isLength({min: 2, max: 50}).withMessage('El apellido del perfil debe ser un texto de entre 2 a 50 carácteres')
    .isAlpha().withMessage('El apellido del perfil debe ser un texto con letras solamente'),
    body('profile.birthDate')
    .optional()
    .isDate().withMessage('La fecha de nacimiento debe ser válida (Ejemplo: 2002-10-23')
    .custom(async (value) => { //custom para validar que la fecha no sea futura
        if (new Date(value) > new Date()) {
            throw new Error('La fecha es inválida: no puede ser posterior a la fecha actual')
        }
        return true
    }),
    body('profile.phone')
    .optional()
    .trim()
    .notEmpty('Si agrega su número de telefóno, no puede ser un texto vacío')
    .isString().withMessage('El número de teléfono debe ser un texto')
    .isLength({min: 8, max: 15}).withMessage('El número de teléfono debe ser un texto entre 8 y 15 números')
    .isMobilePhone('es-AR').withMessage('El número de teléfono debe ser de formato válido (Argentina) (Ej: +5491123456789)')
]
