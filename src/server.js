import express from 'express';
import ProductsContainerMongoDB from './containers/ProductsContainerMongoDB.js';
import CartsContainerMongoDB from './containers/CartsContainerMongoDB.js';
import { engine } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsContainer = new ProductsContainerMongoDB();
const cartsContainer = new CartsContainerMongoDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productsRouter = express.Router();
const cartsRouter = express.Router();

dotenv.config();

let products = [];
let productsInCart = [];
let messages = [];
let carts = [];

io.on('connection', async (socket) => {
    console.log('User connected...');
    products = await productsContainer.getAll();
    messages = await productsContainer.getAllMessages();

    io.sockets.emit('savedProducts', products);
    io.sockets.emit('savedMessages', messages);

    socket.on('addProduct', async (data) => {
        await productsContainer.save({
            timestamp: Date.now(),
            name: data.productName,
            description: data.productDescription,
            code: data.productCode,
            price: data.productPrice,
            stock: data.productStock,
            image: data.productImage,
        });

        products = await productsContainer.getAll();
        io.sockets.emit('savedProducts', products);
    });

    socket.on('addMessage', async (data) => {
        await productsContainer.saveMessage({
            email: data.email,
            date: new Date().toLocaleDateString(),
            message: data.message,
        });

        messages = await productsContainer.getAllMessages();
        io.sockets.emit('savedMessages', messages);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected...');
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

app.set('views', './src/views');
app.set('view engine', 'hbs');

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
    }),
);

///////////////////////// Products API ///////////////////////

productsRouter.get('/', async (req, res) => {
    products = await productsContainer.getAll();
    res.status(200).render('main', {
        products: products,
    });
});

productsRouter.post('/', async (req, res) => {
    const { body } = req;

    if (req.body.name && req.body.price && req.body.image && req.body.description && req.body.code && req.body.stock) {
        const product = {
            timestamp: Date.now(),
            name: body.name,
            description: body.description,
            code: body.code,
            image: body.image,
            price: parseInt(body.price),
            stock: parseInt(body.stock),
        };

        await productsContainer.save(product);

        res.status(201).render('main', {
            products: await productsContainer.getAll(),
        });
    } else {
        res.status(404).send('You must complete the fields before entering any product.');
    }
});

productsRouter.get('/:code', async (req, res) => {
    const { code } = req.params;

    const product = await productsContainer.getByCode(code);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ error: 'Product code may be not inappropriate.' });
    }

});

productsRouter.put('/:code', async (req, res) => {
    const { code } = req.params;
    const { body } = req;

    const newProduct = {
        timestamp: Date.now(),
        name: body.name,
        description: body.description,
        code: body.code,
        image: body.image,
        price: parseInt(body.price),
        stock: parseInt(body.stock),
    };

    await productsContainer.updateProductByCode(code, newProduct);

    res.status(200).send('The product has been updated.');
});

productsRouter.delete('/:code', async (req, res) => {
    const { code } = req.params;

    await productsContainer.deleteByCode(code);
    res.status(200).send(`The product with code: ${code}, has been deleted.`);
});

///////////////////////// Carts API ///////////////////////

cartsRouter.get('/', async (req, res) => {
    carts = await cartsContainer.getAll();
    res.status(200).json(carts);
});

cartsRouter.post('/', async (req, res) => {

    if (req.body.products) {
        req.body.products.map((product) => {
            const prod = {
                timestamp: Date.now(),
                name: product.name,
                description: product.description,
                code: product.code,
                image: product.image,
                price: parseInt(product.price),
                stock: parseInt(product.stock),
            };

            productsInCart.push(prod);
        });

        const cart = {
            timestamp: Date.now(),
            products: productsInCart,
        };

        await cartsContainer.save(cart);
        productsInCart = [];

        res.status(201).send('The cart has been created.');
    } else {
        res.status(404).send('You must complete the fields before entering any product.');
    }
});

cartsRouter.get('/:id/products', async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        throw new Error('The id is not a number.');
    } else if (parseInt(id) > cartsContainer.maxId || parseInt(id) <= 0) {
        throw new Error('The id is out of range.');
    } else {
        const cart = await cartsContainer.getById(parseInt(id));

        if (cart) {
            res.status(200).json(cart.products);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    }
});

cartsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    await cartsContainer.deleteById(parseInt(id));
    res.status(200).send(`The cart with id: ${id}, has been deleted.`);

});

cartsRouter.delete('/:idCart/products/:productCode', async (req, res) => {
    const { idCart, productCode } = req.params;

    await cartsContainer.deleteProductInCartByCode(parseInt(idCart), productCode);
    res.status(200).send(`The product with code: ${productCode}, has been deleted in the cart with id: ${idCart}.`);
});

cartsRouter.post('/:id/products', async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    if (req.body) {
        const prod = {
            timestamp: Date.now(),
            name: body.name,
            description: body.description,
            code: body.code,
            image: body.image,
            price: parseInt(body.price),
            stock: parseInt(body.stock),
        };

        await cartsContainer.saveNewProductInCart(parseInt(id), prod);

        res.status(201).send('The cart has been updated.');
    } else {
        res.status(404).send('Something went wrong, please check your json body.');
    }
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server has initiated on port http://localhost:${PORT}`);
});
server.on('error', (err) => console.log(err));