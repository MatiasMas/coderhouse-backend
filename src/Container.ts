import fs from 'fs'

type ProductType = {
    id?: number
    title: string
    price: number
    thumbnail: string
}

interface ContainerType {
    products: ProductType[]
    maxId: number
    fileName: string

    save(product: ProductType): Promise<number>

    getById(id: number): ProductType

    getAll(): Promise<ProductType[]>

    deleteById(id: number): Promise<void>

    deleteAll(): Promise<void>
}

export class Container implements ContainerType {
    fileName: string
    maxId: number
    products: ProductType[]

    constructor(fileName: string) {
        this.fileName = fileName
        this.maxId = 0
        this.products = []
    }

    async deleteAll(): Promise<void> {
        this.products = []
        try {
            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify([]))
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async deleteById(id: number): Promise<void> {
        const product = this.getById(id)

        const index = this.products.indexOf(product)
        this.products.splice(index, 1)
        await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.products))
        this.maxId--
    }

    async getAll(): Promise<ProductType[]> {
        try {
            const products: ProductType[] = JSON.parse(await fs.promises.readFile(`src/${this.fileName}`, 'utf-8'))
            this.products = products

            this.products.map((product: ProductType) => {
                if (product.id && this.maxId < product.id) {
                    this.maxId = product.id
                }
            })

            return this.products
        } catch (error: any) {
            throw new Error(error)
        }
    }

    getById(id: number): ProductType {
        const product = this.products.find((product: ProductType) => product.id === id)

        if (product == null) {
            throw new Error(`The product with ID: ${id} doesn't exist in the container.`)
        }

        return product
    }

    async save(product: ProductType): Promise<number> {
        await this.getAll()
        this.maxId++
        product.id = this.maxId
        this.products.push(product)

        try {
            await fs.promises.writeFile(`src/${this.fileName}`, JSON.stringify(this.products))
            return product.id
        } catch (error: any) {
            throw new Error(error)
        }

    }

}

const container = new Container('products.txt')

const product1: ProductType = {
    title: 'Title7',
    price: 7,
    thumbnail: 'http://google.com',
}

const product2: ProductType = {
    title: 'Title8',
    price: 8,
    thumbnail: 'http://google.com',
}

async function f() {
    await container.save(product1)
    await container.save(product2)

    // await container.deleteAll()
    // await container.deleteById(2)
}

f()
