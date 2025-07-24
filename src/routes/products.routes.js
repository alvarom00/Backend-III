import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

// GET /api/products?limit=&page=&sort=&query=
router.get('/', async (req, res) => {
  try {
    const { limit = 3, page = 1, sort, query } = req.query

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
    }

    const filter = query ? { category: query } : {}

    const result = await Product.paginate(filter, options)

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})


// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid)
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }
    res.json({ status: 'success', payload: product })
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'ID inválido' })
  }
})

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ status: 'success', payload: product })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
})

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true })
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }
    res.json({ status: 'success', payload: product })
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'ID inválido' })
  }
})

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.pid)
    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }
    res.json({ status: 'success', message: 'Producto eliminado' })
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'ID inválido' })
  }
})

export default router
