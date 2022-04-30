import { knexMySQL } from './db.js'
import ProductsContainer from '../ProductsContainer.js'

const products = await new ProductsContainer('products.txt').getAll()

const insertProducts = async () => {
    try {
        const response = await knexMySQL.insert(products).from('products')
        console.log('Products were added.')
        console.log(response)
    } catch (error) {
        console.log(error)
    } finally {
        knexMySQL.destroy()
    }
}

insertProducts()
