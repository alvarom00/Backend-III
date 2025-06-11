import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fileManager.js'
import { randomUUID } from 'crypto'

const router = Router()
const CARTS_FILE = 'carrito.json'
const PRODUCTS_FILE = 'productos.json'

router.post('/', async (req, res) => {
    const carts = await readJSON(CARTS_FILE)
    const newCart = {
        id: randomUUID(),
        products: []
    }

    carts.push(newCart)
    await writeJSON(CARTS_FILE, carts)
    res.status(201).json({ status: 'success', payload: newCart })
})

router.get('/:cid', async (req, res) => {
    const carts = await readJSON(CARTS_FILE)
    const cart = carts.find(c => c.id === req.params.cid)

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    }

    res.json({ status: 'success', payload: cart.products })
})

router.post('/:cid/product/:pid', async (req, res) => {
    const carts = await readJSON(CARTS_FILE)
    const products = await readJSON(PRODUCTS_FILE)

    const cart = carts.find(c => c.id === req.params.cid)
    const product = products.find(p => p.id === req.params.pid)

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    }

    if (!product) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }

    const existingProduct = cart.products.find(p => p.product === req.params.pid)

    if (existingProduct) {
        existingProduct.quantity++
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 })
    }

    await writeJSON(CARTS_FILE, carts)
    res.status(200).json({ status: 'success', payload: cart })
})

export default router;