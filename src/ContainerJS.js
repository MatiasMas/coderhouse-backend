const fs = require('fs')

class Container {
    fileName
    maxId
    products

    constructor(fileName) {
        this.fileName = fileName
        this.maxId = 0
        this.products = []
    }

    async deleteAll() {
        this.products = []
        try {
            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify([]))
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
            const products = JSON.parse(await fs.promises.readFile(`src/${this.fileName}`, 'utf-8'))
            this.products = products

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

            this.products[index].title = product.title
            this.products[index].price = product.price
            this.products[index].thumbnail = product.thumbnail

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
}

module.exports = Container
