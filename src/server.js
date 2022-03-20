const express = require('express')
const Container = require('./ContainerJS')

const container = new Container('products.txt')
const app = express()
const router = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))

app.set('views', './src/views')
app.set('view engine', 'ejs')

router.get('/', async (req, res) => {
    res.status(200).render('pages/index', {
        products: await container.getAll(),
    })
})

router.post('/', async (req, res) => {
    const { body } = req
    const product = {
        title: body.name,
        price: parseInt(body.price),
        thumbnail: body.thumbnail,
    }

    await container.save(product)

    res.status(201).render('pages/index', {
        products: await container.getAll(),
    })
})

router.get('/randomProduct', async (req, res) => {
    const randomNumberInRange = (min, max) => {
        return Math.floor(
            Math.random() * (max - min + 1) + min,
        )
    }

    await container.getAll()

    res.status(200).json(await container.getById(randomNumberInRange(1, container.products.length)))
})

router.get('/:id', (req, res) => {
    const { id } = req.params

    if (isNaN(parseInt(id))) {
        throw new Error('The id is not a number.')
    } else if (parseInt(id) > container.products.length || parseInt(id) <= 0) {
        throw new Error('The id is out of range.')
    } else {
        const product = container.getById(parseInt(id))

        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({ error: 'Product not found.' })
        }
    }
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const { body } = req

    const newProduct = {
        title: body.title,
        price: parseInt(body.price),
        thumbnail: body.thumbnail,
        id: parseInt(id),
    }

    container.updateProduct(newProduct)

    res.status(200).send('The product has been updated.')
})

router.delete('/:id', (req, res) => {
    const { id } = req.params

    if (isNaN(parseInt(id))) {
        throw new Error('The id is not a number.')
    } else if (parseInt(id) > container.products.length || parseInt(id) <= 0) {
        throw new Error('The id is out of range.')
    } else {
        container.deleteById(parseInt(id))
        res.status(200).send(`The product with id: ${id}, has been deleted.`)
    }
})

app.use('/api/products', router)

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Server has initiated on port http://localhost:${PORT}`)
})
server.on('error', (err) => console.log(err))