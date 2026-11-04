import { body, param } from "express-validator";
import { CategoryModel } from "../../models/category.model.js";

export const createCategoryValidations = [
    body('name')
    .trim()
    .notEmpty().withMessage('El nombre de la categoría es obligatorio')
    .isString().withMessage('El nombre de la categoría debe ser texto')
    .isLength({ min: 2, max: 30})
    .custom(async (name) => {
        const doesNameExists = await CategoryModel.findOne({name})
        if (doesNameExists) {
            throw new Error('Ese nombre de categoría ya está en uso')
        }
        return true
    }),
    body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('La descripción de la categoría no puede estar vacía')
    .isString('La descripción de la categoría debe ser texto')
    .isLength({max: 200})
]