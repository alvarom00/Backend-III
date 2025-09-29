import { Router } from 'express'
import ProductDAO from '../dao/ProductDAO.js'
import ProductRepository from '../repositories/ProductRepository.js'
import { ensureAuth, authorize } from '../middlewares/auth.js'

const router = Router()
const repo = new ProductRepository(new ProductDAO())

router.get('/', async (req, res) => {
  try {
    const { limit = 3, page = 1, sort, query } = req.query
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
    }
    const filter = query ? { category: query } : {}
    const result = await repo.paginate(filter, options)

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

router.get('/:pid', async (req, res) => {
  try {
    const product = await repo.get(req.params.pid)
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    res.json({ status: 'success', payload: product })
  } catch {
    res.status(400).json({ status: 'error', message: 'ID inválido' })
  }
})

router.post('/', ensureAuth, authorize('admin'), async (req, res) => {
  try {
    const product = await repo.create(req.body)
    res.status(201).json({ status: 'success', payload: product })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
})

router.put('/:pid', ensureAuth, authorize('admin'), async (req, res) => {
  try {
    const product = await repo.update(req.params.pid, req.body)
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    res.json({ status: 'success', payload: product })
  } catch {
    res.status(400).json({ status: 'error', message: 'ID inválido' })
  }
})

router.delete('/:pid', ensureAuth, authorize('admin'), async (req, res) => {
  try {
    const result = await repo.delete(req.params.pid)
    if (!result) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    res.json({ status: 'success', message: 'Producto eliminado' })
  } catch {
    res.status(400).json({ status: 'error', message: 'ID inválido' })
  }
})

export default router
