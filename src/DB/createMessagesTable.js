import { knexSQLite } from './db.js'

const createMessagesTable = async () => {
    try {
        const exist = await knexSQLite.schema.hasTable('messages')

        if (!exist) {
            await knexSQLite.schema.createTable('messages', (tableBuilder) => {
                tableBuilder.increments('id').primary().notNullable(),
                    tableBuilder.timestamp('date').notNullable(),
                    tableBuilder.string('email').notNullable(),
                    tableBuilder.string('message')
            })

            console.log('Table created!')
        }
    } catch (e) {
        console.log(e.stackTrace)
    } finally {
        knexSQLite.destroy()
    }
}

createMessagesTable()