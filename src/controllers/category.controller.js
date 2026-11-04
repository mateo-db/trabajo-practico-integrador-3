import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";


export const createCategory = async (req, res) => {
    try {
        const { name, description } = matchedData(req, {locations: ['body']})
        const newCategory = await CategoryModel.create({
            name,
            description
        })

        return res.status(201).json({
            message: 'Categoría creada exitosamente: ',
            data: newCategory
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Error interno del servidor al intentar crear categoría'
        })
    }
}