import { body } from 'express-validator'
import { UserModel } from '../../models/user.model.js'

export const registerUserValidations = [
    body('username')
    .trim() //eliminamos espacios en blanco al principio y final
    .notEmpty().withMessage('El nombre de usuario es obligatorio') //verificamos que no esté vacío el campo
    .isString().withMessage('El nombre de usuario debe ser un texto')
    .isLength({ min: 3, max: 20}).withMessage('El nombre de usuario debe ser un texto de entre 3 a 20 carácteres')
    .isAlphanumeric().withMessage('El nombre de usuario debe ser un texto alfanúmerico (contener letras y números)')
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
    .isString().withMessage('La contraseña debe ser un texto')
    .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0
    }).withMessage('La contraseña debe ser mínimo 8 carácteres, incluyendo 1 maýuscula, minúscula y número'),
    body('role')
    .isString().withMessage('El rol debe ser texto')
    .isIn(['user', 'admin']),
    body('profile.firstName')
    .trim() 
    .notEmpty().withMessage('El nombre del perfil es obligatorio') 
    .isString().withMessage('El nombre del perfil debe ser un texto')
    .isLength({min: 2, max: 50}).withMessage('El nombre de perfil debe ser un texto de entre 2 a 50 carácteres')
    .isAlpha().withMessage('El nombre de perfil debe ser un texto con letras solamente'),
    body('profile.lastName')
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