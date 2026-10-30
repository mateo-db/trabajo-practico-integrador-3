import { hashPassword } from "../helpers/bcrypt.helper.js"
import { generateToken } from "../helpers/jwt.helper.js"
import { UserModel } from "../models/user.model.js"

//controlador registrar usuario
export const registerUser = async (req, res) => {
    try {
        //desestructuro campos desde el body para el registro del usuario, incluyendo el documento embebido profile
        const { username, email, password, role, profile } = matchedData(req, {locations: ["body"]})
        const { firstName, lastName, birthDate, phone } = profile //desestructuro a su vez profile para conservar el objeto del documento embebido y extraer sus campos para la creación del usuario junto a su perfil
        const hashedPassword = hashPassword(password)
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

        //buscamos si ese usuario está registrado en nuestra base de datos
        //como email fue configurado como campo único (unique: true), podemos usarlo como identificador del usuario específico a buscar

        const registeredUser = await UserModel.findOne({ email }) //buscamos por email

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
export const logUserOut = async (req, res) => {
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