import { Router } from 'express'
import CartDAO from '../dao/CartDAO.js'
import ProductDAO from '../dao/ProductDAO.js'
import TicketDAO from '../dao/TicketDAO.js'
import CartRepository from '../repositories/CartRepository.js'
import ProductRepository from '../repositories/ProductRepository.js'
import TicketRepository from '../repositories/TicketRepository.js'
import { ensureAuth, authorize } from '../middlewares/auth.js'

const router = Router()

const carts = new CartRepository(new CartDAO())
const products = new ProductRepository(new ProductDAO())
const tickets = new TicketRepository(new TicketDAO())

// Obtener carrito por id
router.get('/:cid', async (req, res) => {
  try {
    const cart = await carts.get(req.params.cid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    res.json({ status: 'success', payload: cart })
  } catch {
    res.status(400).json({ status: 'error', message: 'ID inválido' })
  }
})

// Agregar producto al carrito (solo user)
router.post('/:cid/product/:pid', ensureAuth, authorize('user'), async (req, res) => {
  try {
    const { cid, pid } = req.params
    const { quantity = 1 } = req.body

    const cart = await carts.get(cid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })

    const prod = await products.get(pid)
    if (!prod) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })

    const existing = cart.products.find(p => p.product.toString() === pid)
    if (existing) existing.quantity += Number(quantity)
    else cart.products.push({ product: pid, quantity: Number(quantity) })

    await carts.save(cart)
    res.json({ status: 'success', payload: cart })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
})

// Finalizar compra del carrito (solo user)
router.post('/:cid/purchase', ensureAuth, authorize('user'), async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await carts.get(cid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })

    let total = 0
    const notProcessed = []

    for (const item of cart.products) {
      const prod = item.product
      const qty = item.quantity

      if (prod.stock >= qty) {
        prod.stock -= qty
        total += prod.price * qty
        await products.update(prod._id, { stock: prod.stock })
      } else {
        notProcessed.push({ product: prod._id, requested: qty, available: prod.stock })
      }
    }

    if (total > 0) {
      const ticket = await tickets.create({ amount: total, purchaser: req.user.email })

      if (notProcessed.length > 0) {
        cart.products = cart.products.filter(i =>
          notProcessed.some(np => np.product.toString() === i.product._id.toString())
        )
      } else {
        cart.products = []
      }
      await carts.save(cart)

      return res.json({
        status: 'success',
        ticket,
        unprocessedProducts: notProcessed
      })
    }

    return res.status(409).json({
      status: 'error',
      message: 'No hay stock suficiente para procesar la compra',
      unprocessedProducts:
        notProcessed.length
          ? notProcessed
          : cart.products.map(i => ({
              product: i.product._id,
              requested: i.quantity,
              available: i.product.stock
            }))
    })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
})

export default router
