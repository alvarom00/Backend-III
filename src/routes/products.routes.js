import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/fileManager.js'
import { randomUUID } from 'crypto'

const router = Router()
const FILE = 'productos.json'

// GET /api/products?limit=
router.get('/', async (req, res) => {
    const products = await readJSON(FILE)
    const limit = parseInt(req.query.limit)
    const result = isNaN(limit) ? products : products.slice(0, limit)
    res.json({ status: 'success', payload: result })
})

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    const products = await readJSON(FILE)
    const product = products.find(p => p.id === req.params.pid)
    if (!product) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }
    res.json({ status: 'success', payload: product })
})

// POST /api/products
router.post('/', async (req, res) => {
    const {
        title, description, code,
        price, stock, category,
        thumbnails = [], status = true
    } = req.body

    if (!title || !description || !code || price == null || stock == null || !category) {
        return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' })
    }

    const products = await readJSON(FILE)
    const id = randomUUID()
    const newProduct = {
        id, title, description, code,
        price, status, stock, category,
        thumbnails
    }

    products.push(newProduct)
    await writeJSON(FILE, products)
    res.status(201).json({ status: 'success', payload: newProduct })
})

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const updates = req.body
    const products = await readJSON(FILE)
    const index = products.findIndex(p => p.id === pid)

    if (index === -1) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }

    if (updates.id && updates.id !== pid) {
        return res.status(400).json({ status: 'error', message: 'No se puede modificar el ID' })
    }

    products[index] = { ...products[index], ...updates }
    await writeJSON(FILE, products)
    res.json({ status: 'success', payload: products[index] })
})

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    let products = await readJSON(FILE)
    const exists = products.some(p => p.id === pid)

    if (!exists) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }

    products = products.filter(p => p.id !== pid)
    await writeJSON(FILE, products)
    res.json({ status: 'success', message: 'Producto eliminado' })
})

export default router
