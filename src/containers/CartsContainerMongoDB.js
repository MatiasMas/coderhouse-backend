import { CartsModel } from '../models/carts.model.js';

class CartsContainerMongoDB {

    constructor() {

    }

    async deleteAll() {
        try {
            const response = await CartsModel.deleteMany({});
            console.log(response);
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteById(id) {
        try {
            const response = await CartsModel.deleteOne({ id: id });
            console.log(response);
        } catch (err) {
            throw new Error(err);
        }
    }

    async deleteProductInCartByCode(idCart, productCode) {
        try {
            const { products } = await CartsModel.findOne({ id: idCart }, { products: 1 });
            console.log(products);
            const productsUpdated = [];
            for (const product of products) {
                if (product.code !== productCode) {
                    productsUpdated.push(product);
                }
            }

            const response = await CartsModel.updateOne({ id: idCart }, { products: productsUpdated });
            console.log(response);
        } catch (err) {
            throw new Error(err);
        }
    }

    async getAll() {
        try {
            const response = await CartsModel.find();
            console.log(response);
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(id) {
        try {
            const response = await CartsModel.findOne({ id: id });
            console.log(response);
            return response;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateCart(cart) {
        try {
            const response = await CartsModel.updateOne({ id: cart.id }, cart);
        } catch (err) {
            throw new Error(err);
        }
    }

    async save(cart) {
        try {
            let cartsNumber = await CartsModel.find().count();
            cart.id = ++cartsNumber;

            const response = await CartsModel.create(cart);
            console.log(response);
        } catch (err) {
            throw new Error(err);
        }
    }

    async saveNewProductInCart(idCart, product) {
        try {
            const { products } = await CartsModel.findOne({ id: idCart }, { products: 1 });
            const productsUpdated = [...products, product];
            console.log(products);
            const response = await CartsModel.updateOne({ id: idCart }, { products: productsUpdated });
            console.log(response);
        } catch (err) {
            throw new Error(err);
        }
    }
}

export default CartsContainerMongoDB;
