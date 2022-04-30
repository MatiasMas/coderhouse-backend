import express from 'express'
import { ProductsContainerWithDatabase } from './ProductsContainerWithDatabase.js'
import { engine } from 'express-handlebars'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const container = new ProductsContainerWithDatabase()
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const productsRouter = express.Router()

let products = []
let messages = []

io.on('connection', async (socket) => {
    console.log('User connected...')
    products = await container.getAll()
    messages = await container.getAllMessages()

    io.sockets.emit('savedProducts', products)
    io.sockets.emit('savedMessages', messages)

    socket.on('addProduct', async (data) => {
        await container.save({
            timestamp: Date.now(),
            name: data.productName,
            description: data.productDescription,
            code: data.productCode,
            price: parseFloat(data.productPrice),
            stock: parseInt(data.productStock),
            image: data.productImage,
        })

        products = await container.getAll()
        io.sockets.emit('savedProducts', products)
    })

    socket.on('addMessage', async (data) => {
        await container.saveMessage({
            email: data.email,
            date: new Date().toLocaleDateString(),
            message: data.message,
        })

        messages = await container.getAllMessages()
        io.sockets.emit('savedMessages', messages)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected...')
    })
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))

app.set('views', './src/views')
app.set('view engine', 'hbs')

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
    }),
)

///////////////////////// Products API ///////////////////////

productsRouter.get('/', async (req, res) => {
    products = await container.getAll()
    res.status(200).render('main', {
        products: products,
    })
})

productsRouter.post('/', async (req, res) => {
    const { body } = req

    if (req.body.name && req.body.price && req.body.image && req.body.description && req.body.code && req.body.stock) {
        const product = {
            timestamp: Date.now(),
            name: body.name,
            description: body.description,
            code: body.code,
            image: body.image,
            price: parseFloat(body.price),
            stock: parseInt(body.stock),
        }

        await container.save(product)

        res.status(201).render('main', {
            products: await container.getAll(),
        })
    } else {
        res.status(404).send('You must complete the fields before entering any product.')
    }
})

productsRouter.get('/randomProduct', async (req, res) => {
    const randomNumberInRange = (min, max) => {
        return Math.floor(
            Math.random() * (max - min + 1) + min,
        )
    }

    await container.getAll()

    res.status(200).json(await container.getById(randomNumberInRange(1, container.products.length)))
})

productsRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    if (isNaN(parseInt(id))) {
        throw new Error('The id is not a number.')
    } else {
        const product = await container.getById(parseInt(id))

        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({ error: 'Product not found.' })
        }
    }
})

productsRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req

    const newProduct = {
        timestamp: Date.now(),
        name: body.name,
        description: body.description,
        code: body.code,
        image: body.image,
        price: parseInt(body.price),
        stock: parseInt(body.stock),
        id: parseInt(id),
    }

    await container.updateProduct(newProduct)

    res.status(200).send('The product has been updated.')
})

productsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params

    if (isNaN(parseInt(id))) {
        throw new Error('The id is not a number.')
    } else {
        await container.deleteById(parseInt(id))
        res.status(200).send(`The product with id: ${id}, has been deleted.`)
    }
})

app.use('/api/products', productsRouter)

const PORT = 8080
server.listen(PORT, () => {
    console.log(`Server has initiated on port http://localhost:${PORT}`)
})
server.on('error', (err) => console.log(err))