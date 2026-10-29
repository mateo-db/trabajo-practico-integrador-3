import { model, Schema } from 'mongoose'

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        min: 2,
        max: 30
    },
    description: {
        type: String,
        max: 200
    }
})

//virtual de category hacia eventos (que eventos tienen esta categoría)
categorySchema.virtual('events_in_category', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'categories'
})

export const CategoryModel = model('Category', categorySchema)