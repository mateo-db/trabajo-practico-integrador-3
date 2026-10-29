import { model, Schema, Types } from 'mongoose'

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 150
    },
    description: {
        type: String,
        min: 20
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number,
        validate: Number.isInteger,
        min: 1
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        enum: ['scheduled', 'canceled', 'finished'],
        default: 'scheduled'
    },
    location: {
        unique: true, //documento embebido con relación 1:1 hacia event, aplicamos unique: true
        required: true,
        venue: {
            type: String,
            min: 3,
            max: 100
        },
        address: {
            type: String,
            min: 5,
            max: 150
        },
        city: {
            type: String,
            min: 2,
            max: 50
        }
    },
    organizer: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: [{
        type: Types.ObjectId,
        ref: 'Category'
    }]
})

export const EventModel = model('Event', eventSchema)