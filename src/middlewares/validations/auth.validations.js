import { body } from 'express-validator'
import { UserModel } from '../../models/user.model.js'

export const registerUserValidations = [
    body('username')
    .trim() //eliminamos espacios en blanco al principio y final
    .notEmpty().withMessage('El nombre de usuario es obligatorio') //verificamos que no esté vacío el campo
    .isString().withMessage('El nombre de usuario debe ser un texto')
    .isLength({ min: 3, max: 20}).withMessage('El nombre de usuario debe ser un texto de entre 3 a 20 carácteres')
    .bail() //detenemos la cadena de validaciones si alguna de las anteriores fallaron, de modo que no busquemos datos inválidos en la BD
    .custom(async (username) => {
        const usernameExists = await UserModel.findOne({ username })
        if (usernameExists) {
            throw new Error('Ese nombre de usuario ya está en uso')
        }
        return true
    }),
    body('email')
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
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isString().withMessage('La contraseña debe ser un texto'),
    body('profile.firstName')
    .trim() 
    .notEmpty().withMessage('El nombre del perfil es obligatorio') 
    .isString().withMessage('El nombre del perfil debe ser un texto')
    .isLength({min: 2, max: 50}).withMessage('El nombre de perfil debe ser un texto de entre 2 a 50 carácteres'),
    body('profile.lastName')
    .trim() 
    .notEmpty().withMessage('El apellido del perfil es obligatorio') 
    .isString().withMessage('El apellido del perfil debe ser un texto')
    .isLength({min: 2, max: 50}).withMessage('El apellido de perfil debe ser un texto de entre 2 a 50 carácteres'),
    body('profile.birthDate')
    .optional()
    .isDate().withMessage('La fecha de nacimiento debe ser válida (Ejemplo: 2002-10-23'),
    body('profile.phone')
    .optional()
    .notEmpty('Si agrega su número de telefóno, no puede ser un texto vacío')
    .isString().withMessage('El número de teléfono debe ser un texto')
    .isMobilePhone('es-AR').withMessage('El número de teléfono debe ser de formato válido (Argentina)')
]