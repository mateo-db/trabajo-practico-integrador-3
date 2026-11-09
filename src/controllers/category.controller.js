import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";

//crear una categoria (solo admin)
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

//listar categorias (usuario autenticado)
export const getAllCategories = async (_req, res) => {
    try {
        const allCategories = await CategoryModel.find()

        if (!allCategories) {
            return res.status(404).json({
                message: 'No se encontraron categorías registradas'
            })
        }
        return res.status(200).json({
            message: 'Se encontró categorias: ',
            data: allCategories
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Error interno del servidor al intentar listar categorias'
        })
    }
}

//traer categoría por id poblando el virtual events (usuario autenticado)
export const getCategoryById = async (req, res) => {
    try {
        // a la hora de extraer el id desde params, cuando desestructuramos el nombre de nuestra variable debe ser IGUAL a como identificamos ese parámetro en nuestras rutas del controlador
        // ej: si en nuestras rutas identificamos el parámetro como -> /categories/:categoryId
        // al desestructurar en el controlador desde params usando matchedData -> { categoryId } 
        const { categoryId } = matchedData(req, {locations: ['params']})
        const categoryFound = await CategoryModel.findById(categoryId)
        .populate({
            path: 'events_in_category',
            select: 'title description -_id'
        })

        if (!categoryFound) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            })
        }

        return res.status(200).json({
            message: 'Se encontró categoria: ',
            data: categoryFound
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Error interno del servidor al intentar obtener categoria'
        })
    }
}
