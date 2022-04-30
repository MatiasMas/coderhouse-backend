import { knexMySQL, knexSQLite } from './DB/db.js'

export class ProductsContainerWithDatabase {
    products
    messages

    constructor() {
        this.products = []
        this.messages = []
    }

    async deleteAll() {
        try {
            await knexMySQL.del().from('products')
        } catch (e) {
            throw new Error(e)
        }
    }

    async deleteById(id) {
        try {
            await knexMySQL.del().from('products').where({ id: id })
        } catch (e) {
            throw new Error(e)
        }
    }

    async getAll() {
        try {
            this.products = await knexMySQL.select('*').from('products')
            console.log(this.products)

            return this.products
        } catch (e) {
            throw new Error(e)
        }
    }

    async getAllMessages() {
        try {
            this.messages = await knexSQLite.select('*').from('messages')
            console.log(this.messages)

            return this.messages
        } catch (e) {
            throw new Error(e)
        }
    }

    async getById(id) {
        try {
            return await knexMySQL.select('*').from('products').where({ id: id })
        } catch (e) {
            throw new Error(e)
        }
    }

    async updateProduct(product) {
        try {
            if (product) {
                await knexMySQL.from('products').update(product).where({ id: product.id })
            } else {
                console.log('The product is empty.')
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async save(product) {
        try {
            if (product) {
                await knexMySQL.from('products').insert(product)
            } else {
                console.log('The product is empty.')
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async saveMessage(message) {
        try {
            if (message) {
                await knexSQLite.from('messages').insert(message)
            } else {
                console.log('The message object is empty.')
            }
        } catch (e) {
            throw new Error(e)
        }
    }
}