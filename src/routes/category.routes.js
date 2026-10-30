import { Router } from "express";

export const categoryRoutes = Router()

//crear una categoria (solo admin)
categoryRoutes.post('/categories')

//listas todas las categorias (usuario autenticado)
categoryRoutes.get('/categories')

//obtener una categoría por su id poblando events virtualmente (es decir, traer una categoría por su id a través del virtual populate configurado desde category hacia events, trayendo así toda una categoría)
//usuario autenticado
categoryRoutes.get('/categories/:categoryId')

//actualizar categoría por id
categoryRoutes.put('/categories/:categoryId')

//eliminar una categoría en cascada (es decir, antes de eliminar una categoría, eliminar todos los eventos asociados a ella)
categoryRoutes.delete('/categories/:categoryId')