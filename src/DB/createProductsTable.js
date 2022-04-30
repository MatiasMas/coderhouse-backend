import { knexMySQL } from './db.js'

const createProductsTable = async () => {
    try {
        const exist = await knexMySQL.schema.hasTable('products')

        if (!exist) {
            await knexMySQL.schema.createTable('products', (tableBuilder) => {
                tableBuilder.increments('id').primary().notNullable(),
                tableBuilder.string('timestamp').notNullable(),
                tableBuilder.string('name').notNullable(),
                tableBuilder.string('description'),
                tableBuilder.string('code').notNullable(),
                tableBuilder.string('image'),
                tableBuilder.float('price').notNullable(),
                tableBuilder.integer('stock').notNullable()
            })

            console.log('Table created!')
        }
    } catch (e) {
        console.log(e.stackTrace)
    } finally {
        knexMySQL.destroy()
    }
}

createProductsTable()