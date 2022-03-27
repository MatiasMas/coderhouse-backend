const express = require('express')
const Container = require('./ContainerJS')
const { engine } = require('express-handlebars')
const http = require('http')
const { Server } = require('socket.io')

const container = new Container('products.txt')
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const router = express.Router()

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
            title: data.productName,
            price: data.productPrice,
            thumbnail: data.productThumbnail
        })

        products = await container.getAll()
        io.sockets.emit('savedProducts', products)
    })

    socket.on('addMessage', async (data) => {
        await container.saveMessage({
            email: data.email,
            date: new Date().toLocaleDateString(),
            message: data.message
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

router.get('/', async (req, res) => {
    products = await container.getAll()
    res.status(200).render('main', {
        products: products,
    })
})

router.post('/', async (req, res) => {
    const { body } = req

    if (req.body.name && req.body.price && req.body.thumbnail) {
        const product = {
            title: body.name,
            price: parseInt(body.price),
            thumbnail: body.thumbnail,
        }

        await container.save(product)

        res.status(201).render('main', {
            products: await container.getAll(),
        })
    } else {
        res.status(404).send('You must complete the fields before entering any product.')
    }

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
server.listen(PORT, () => {
    console.log(`Server has initiated on port http://localhost:${PORT}`)
})
server.on('error', (err) => console.log(err))