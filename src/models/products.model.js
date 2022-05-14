import mongoose from 'mongoose';

export const ProductsSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
});

export const ProductsModel = mongoose.model('Products', ProductsSchema);