import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

router.get('/products', async (req, res) => {
  const { limit = 3, page = 1, sort, query } = req.query

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
    lean: true
  }

  const filter = query ? { category: query } : {}

  const result = await Product.paginate(filter, options)

  res.render('home', {
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    limit: limit,
    sort: sort
  })
})

export default router