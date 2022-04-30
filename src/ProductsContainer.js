import fs from 'fs'

class ProductsContainer {
    fileName
    maxId
    products
    messages

    constructor(fileName) {
        this.fileName = fileName
        this.maxId = 0
        this.products = []
        this.messages = []
    }

    async deleteAll() {
        this.products = []
        try {
            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify([]))
            this.maxId = 0
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteById(id) {
        const product = this.getById(id)

        const index = this.products.indexOf(product)
        this.products.splice(index, 1)
        await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.products))
        this.maxId--
    }

    async getAll() {
        try {
            this.products = JSON.parse(await fs.promises.readFile(`src/${this.fileName}`, 'utf-8'))

            this.products.map((product) => {
                if (product.id && this.maxId < product.id) {
                    this.maxId = product.id
                }
            })

            return this.products
        } catch (error) {
            throw new Error(error)
        }
    }

    async getAllMessages() {
        try {
            this.messages = JSON.parse(await fs.promises.readFile(`src/messages.txt`, 'utf-8'))

            return this.messages
        } catch (error) {
            throw new Error(error)
        }
    }

    getById(id) {
        const product = this.products.find((product) => product.id === id)

        if (product == null) {
            throw new Error(`The product with ID: ${id} doesn't exist in the container.`)
        }

        return product
    }

    async updateProduct(product) {
        let prod = this.getById(product.id)

        if (prod) {
            let index = this.products.indexOf(prod);

            this.products[index].timestamp = product.timestamp
            this.products[index].name = product.name
            this.products[index].description = product.description
            this.products[index].code = product.code
            this.products[index].image = product.image
            this.products[index].price = product.price
            this.products[index].stock = product.stock

            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.products))
        }
    }

    async save(product) {
        await this.getAll()
        this.maxId++
        product.id = this.maxId
        this.products.push(product)

        try {
            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.products))
            return product.id
        } catch (error) {
            throw new Error(error)
        }

    }

    async saveMessage(message) {
        await this.getAllMessages()
        this.messages.push(message)

        try {
            await fs.promises.writeFile(`src/messages.txt`, JSON.stringify(this.messages))
        } catch (error) {
            throw new Error(error)
        }

    }
}

export default ProductsContainer
