import mongoose from 'mongoose';
import { ProductsSchema } from './products.model.js';

const CartsSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: true,
    },
    products: {
        type: [ProductsSchema],
    },
    id: {
        type: Number,
        required: true,
        unique: true,
    },
});

export const CartsModel = mongoose.model('Carts', CartsSchema);