const express = require('express')
const Container = require('../ContainerJS')

const app = express()
const container = new Container('products.txt')

app.get('/api/products', async (req, res) => {
    res.status(200).json(await container.getAll())
})

app.get('/api/randomProduct', async (req, res) => {
    const randomNumberInRange = (min, max) => {
        return Math.floor(
            Math.random() * (max - min + 1) + min,
        )
    }

    const products = await container.getAll()

    res.status(200).json(await container.getById(randomNumberInRange(1, container.products.length)))
})

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Server has initiated on port http://localhost:${PORT}`)
})
server.on('error', (err) => console.log(err))