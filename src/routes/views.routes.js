import { Router } from 'express'
import { readJSON } from '../utils/fileManager.js'

const router = Router()

router.get('/products', async (req, res) => {
  const products = await readJSON('productos.json')
  res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
  const products = await readJSON('productos.json')
  res.render('realTimeProducts', { products })
})

export default router
