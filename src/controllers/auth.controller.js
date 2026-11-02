import { matchedData } from "express-validator"
import { comparePassword, hashPassword } from "../helpers/bcrypt.helper.js"
import { generateToken } from "../helpers/jwt.helper.js"
import { UserModel } from "../models/user.model.js"

//controlador registrar usuario
export const registerUser = async (req, res) => {
    try {
        //desestructuro campos desde el body para el registro del usuario, incluyendo el documento embebido profile
        const { username, email, password, role, profile } = matchedData(req, {locations: ["body"]})
        const { firstName, lastName, birthDate, phone } = profile //desestructuro a su vez profile para conservar el objeto del documento embebido y extraer sus campos para la creación del usuario junto a su perfil
        const hashedPassword = await hashPassword(password)
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            role,
            profile: {
                firstName,
                lastName,
                birthDate,
                phone
            }
        })
        
        return res.status(201).json({
            message: "Se registró el usuario con su perfil éxitosamente: ",
            data: newUser
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Ocurrió un error interno en el servidor",
        })
    }
}

//controlador loguear usuario
export const logUserIn = async (req, res) => {
    try {
        const { email, password } = matchedData(req, {locations: ["body"]})

        console.log('Email que nos llega: ', email)
        //buscamos si ese usuario está registrado en nuestra base de datos
        //como email fue configurado como campo único (unique: true), podemos usarlo como identificador del usuario específico a buscar

        const registeredUser = await UserModel.findOne({ email }) //buscamos por email
        console.log('Valor devuelto de registered user: ', registeredUser)

        //validamos: si no encontramos al usuario (es decir, si no existe ese usuario registrado), retornamos código 401 (Unauthorized) y mensaje de explicación
        if (!registeredUser) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            })
        }
        
        //llamamos a función helper que compara la contraseña en texto plano (entrante desde el body) versus la contraseña hasheada que guardamos en la base de datos al momento de registrar al usuario
        const validPassword = await comparePassword(password, registeredUser.password)

        //validamos: si no coinciden, retornar código 401 (Unauthorized) y mensaje de explicación
        if (!validPassword) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            })
        }

        //para este punto tanto el email como la contraseña fueron validadas y ya está logueado el usuario, el siguiente paso es generar el payload

        //configuramos el objeto payload con el id del usuario y el role
        const payload = {
            id: registeredUser.id,
            role: registeredUser.role,
        }

        //usamos el helper generateToken pasandole como parámetro el payload
        const token = generateToken(payload)

        //mandamos nuestro jwt como cookie segura

        //el primer parámetro es el nombre que tendrá nuestra cookie 
        //el segundo parámetro es el valor (guardada en memoria por variable) que asignaremos a dicha cookie
        //como tercer parámetro pasamos un objeto de configuración para que sea seguro y demás opciones
        //en este caso se usa
        res.cookie("token", token, {
            httpOnly: true, //para que no sea accesible desde el navegador con JS
            maxAge: 1000*60*60, //1 hora
        })
    
        return res.status(200).json({
            message: "Usuario logueado correctamente"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Ocurrió un error interno en el servidor"
        })
    }
}

//cerrar la sesión del usuario (logout)
export const logUserOut = async (_req, res) => {
    try {
        //limpiamos la cookie de autenticación
        res.clearCookie("token")
        return res.status(200).json({
            message: "Sesión cerrada con éxito"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error interno en el servidor"
        })
    }
}

//traer perfil de usuario autenticado
export const getUserProfile = async (req, res) => {
    try {
        //desestructuramos el id desde el token del usuario autenticado en la sesión
        const loggedUserId = req.data.id //a través de notacion de puntos ya accedo al valor del campo "id" en objeto data, entonces simplemente lo guardo en memoria en variable "loggedUserId"
        
        //buscamos usuario en bd
        const userFound = await UserModel.findById(loggedUserId)
        if (!userFound) {
            return res.status(404).json({
                message: 'El usuario del que quiere mostrar el perfil no se encuentra registrado'
            })
        }
        
        //retornamos código de estado, mensaje y data accediendo al perfil del modelo encontrado (un objeto, lo hacemos con notación de puntos)
        return res.status(200).json({
            message: 'Perfil del usuario autenticado: ',
            data: userFound.profile
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: `Error interno del servidor al traer perfil de usuario autenticado: ${error.message}`
        })
    }
}

//actualizar perfil de usuario autenticado
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.data.id //accedemos al valor del id del usuario autenticado 
        const dataToUpdate = matchedData(req, {locations: ['body']})
        const userFound = await UserModel.findById(userId)

        //creamos copias de perfil original y perfil con campos a actualizar dentro de un nuevo objeto, esto conservará los campos originales del perfil y solo actualizará lo que el usuario envió por el body
        //esto es debido a un comportamiento de JavaScript, donde al encontrar propiedades repetidas en un objeto, prevalece el valor de la última propiedad repetida que aparece
        //por eso, el orden acá es crucial: primero hacemos copia del perfil original y luego copia de lo enviado desde el body
        const profileUpdate = {
            ...userFound.profile,
            ...dataToUpdate.profile
        }

        //indicamos el id del modelo a actualizar y con $set modificamos señalando propiedad/clave a actualizar y el nuevo valor que tendrá esta propiedad
        const profileUpdated = await UserModel.findByIdAndUpdate(userId, {
            $set: {
                profile: profileUpdate
            },
        }, {
            returnDocument: "after",
            runValidators: true //indicamos a mongoose que ejecute las validaciones para el schema, ya que por defecto para las actualizaciones con el método findByIdAndUpdate() no lo hace
        })

        return res.status(200).json({
            message: "Perfil del usuario autenticado actualizado con éxito: ",
            data: profileUpdated
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: `Error interno del servidor al actualizar perfil del usuario autenticado: ${error.message}`
        })
    }
}