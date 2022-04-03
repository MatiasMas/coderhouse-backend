const fs = require('fs')

class CartsContainer {
    fileName
    maxId
    carts

    constructor(fileName) {
        this.fileName = fileName
        this.maxId = 0
        this.carts = []
    }

    async deleteAll() {
        this.carts = []
        try {
            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify([]))
            this.maxId = 0
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteById(id) {
        const cart = this.getById(id)

        const index = this.carts.indexOf(cart)
        this.carts.splice(index, 1)
        await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.carts))
        this.maxId--
    }

    async deleteProductInCartById(idCart, idProduct) {
        const cart = this.getById(idCart)

        const cartIndex = this.carts.indexOf(cart)
        const product = this.carts[cartIndex].products.find((product) => product.id === idProduct)
        const productIndex = this.carts[cartIndex].products.indexOf(product)
        this.carts[cartIndex].products.splice(productIndex, 1)

        await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.carts))
    }

    async getAll() {
        try {
            this.carts = JSON.parse(await fs.promises.readFile(`src/${this.fileName}`, 'utf-8'))

            this.carts.map((cart) => {
                if (cart.id && this.maxId < cart.id) {
                    this.maxId = cart.id
                }
            })

            return this.carts
        } catch (error) {
            throw new Error(error)
        }
    }

    getById(id) {
        const cart = this.carts.find((cart) => cart.id === id)

        if (cart == null) {
            throw new Error(`The cart with ID: ${id} doesn't exist in the container.`)
        }

        return cart
    }

    async updateCart(cart) {
        let retrievedCart = this.getById(cart.id)

        if (retrievedCart) {
            let index = this.carts.indexOf(retrievedCart);

            this.carts[index].timestamp = cart.timestamp
            this.carts[index].products = cart.products

            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.carts))
        }
    }

    async save(cart) {
        await this.getAll()
        this.maxId++
        cart.id = this.maxId
        this.carts.push(cart)

        try {
            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.carts))
            return cart.id
        } catch (error) {
            throw new Error(error)
        }
    }

    async saveNewProductInCart(idCart, product) {
        const cart = this.getById(idCart)
        const cartIndex = this.carts.indexOf(cart)

        this.carts[cartIndex].products.push(product)

        try {
            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.carts))
            return cart.id
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = CartsContainer
