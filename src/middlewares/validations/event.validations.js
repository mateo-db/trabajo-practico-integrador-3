import { body, param } from "express-validator";
import { EventModel } from "../../models/event.model.js";
import { CategoryModel } from "../../models/category.model.js";

export const createEventValidations = [
    body('title')
    .trim()
    .notEmpty().withMessage('El titulo del evento es obligatorio/no puede estar vacío')
    .isString().withMessage('El título del evento debe ser un texto')
    .isLength({min: 3, max: 150}).withMessage('El título del evento debe ser un texto de entre 3 y 150 carácteres')
    .bail()
    .custom(async (title) => {
        const titleExists = await EventModel.findOne({title})
        if (titleExists) {
            throw new Error('Ese título ya está en uso, el título del evento debe ser único')
        }
        return true
    }),
    body('description')
    .trim()
    .notEmpty().withMessage('El titulo del evento es obligatorio/no puede estar vacío')
    .isString().withMessage('El título del evento debe ser un texto')
    .isLength({min: 20}).withMessage('El título del evento debe ser un texto de entre 3 y 150 carácteres'),
    body('startDate')
    .exists().withMessage('La fecha de inicio del evento es obligatoria')
    .trim()
    .notEmpty().withMessage('La fecha de inicio no puede estar vacía')
    .isDate().withMessage('La fecha de inicio del evento debe ser de un formáto válido (Ej: 2026-10-12)'),
    body('endDate')
    .exists().withMessage('La fecha de inicio del evento es obligatoria')
    .trim()
    .notEmpty().withMessage('La fecha de inicio no puede estar vacía')
    .isDate().withMessage('La fecha de inicio del evento debe ser de un formáto válido (Ej: 2026-10-12)')
    .bail()
    .custom((endDate, {req}) => {
        const start = new Date(req.body.startDate) //convertimos startDate y endDate a datos tipo date para compararlos
        const end = new Date(endDate)
        if (end < start) { //si endDate es menor a startDate, lanzamos error (así validamos que la fecha de fin sea posterior o en todo caso comparta el mismo día que la fecha de inicio)
            throw new Error('La fecha de cierre del evento no puede ser anterior a la fecha de inicio: solo posterior o compartir el mismo día')
        }
        return true
    }),
    body('capacity')
    .optional()
    .isInt({gt: 0}).withMessage('La capacidad del evento debe ser un número entero (capacidad mínima posible: 1)'),
    body('price')
    .optional()
    .isFloat({min: 0}).withMessage('El precio del evento debe ser un número (precio mínimo: 0)'),
    body('status')
    .trim()
    .notEmpty('El estado del evento es obligatorio/no puede estar vacío')
    .isIn(['scheduled', 'cancelled', 'finished']).withMessage('El estado del evento solo permite tres valores: scheduled, cancelled, finished'),
    body('location.venue')
    .trim()
    .notEmpty().withMessage('El campo venue en location es obligatorio')
    .isString().withMessage('El campo venue en location debe ser un texto')
    .isLength({min: 3, max: 100}).withMessage('El campo venue en location debe ser un texto de entre 3 y 100 carácteres'),
    body('location.address')
    .trim()
    .notEmpty().withMessage('El campo address en location es obligatorio')
    .isString().withMessage('El campo address en location debe ser un texto')
    .isLength({min: 5, max: 150}).withMessage('El campo address en location debe ser un texto de entre 5 y 150 carácteres'),
    body('location.city')
    .trim()
    .notEmpty().withMessage('El campo city en location es obligatorio')
    .isString().withMessage('El campo city en location debe ser un texto')
    .isLength({min: 2, max: 50}).withMessage('El campo city en location debe ser un texto de entre 2 y 50 carácteres'),
    body('categories')
    .optional()
    .isArray().withMessage('Las categorías del evento deben venir en un arreglo'),
    body('categories.*')
    .optional()
    .isMongoId().withMessage('El id de la categoría del evento debe ser un ObjectId de MongoDB')
    .bail()
    .custom(async (categoryId) => {
        const categoryExists = await CategoryModel.findById(categoryId)
        if (!categoryExists) {
            throw new Error('Esa categoría del evento no existe')
        }
        return true 
    })
]