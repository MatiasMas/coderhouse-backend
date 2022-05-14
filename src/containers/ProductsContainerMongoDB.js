import { ProductsModel } from '../models/products.model.js';
import { MessagesModel } from '../models/messages.model.js';

class ProductsContainerMongoDB {

    constructor() {
    }

    async deleteAll() {
        try {
            const response = await ProductsModel.deleteMany({});
            console.log(response);
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteByCode(code) {
        try {
            const response = await ProductsModel.deleteOne({ code: code });
            console.log(response);
        } catch (err) {
            throw new Error(err);
        }
    }

    async getByCode(code) {
        try {
            const response = await ProductsModel.findOne({ code: code });
            console.log(response);
            return response;
        } catch (err) {
            throw new Error(err);
        }
    }

    async getAll() {
        try {
            const response = await ProductsModel.find();
            console.log(response);
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllMessages() {
        try {
            const response = await MessagesModel.find();
            console.log(response);
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProductByCode(code, product) {
        try {
            const response = await ProductsModel.updateOne({ code: code }, product);
            console.log(response);
        } catch (err) {
            throw new Error(err);
        }
    }

    async save(product) {
        try {
            const response = await ProductsModel.create(product);
            console.log(response);
        } catch (error) {
            throw new Error(error);
        }
    }

    async saveMessage(message) {
        try {
            const response = await MessagesModel.create(message);
            console.log(response);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default ProductsContainerMongoDB;
