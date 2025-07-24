import { Router } from 'express'
import Cart from '../models/Cart.js'

const router = Router()

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] })
    res.status(201).json(newCart)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' })
  }
})

// Obtener carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await Cart.findById(cid).populate('products.product')
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el carrito' })
  }
})

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cart = await Cart.findById(cid)
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

    const existingProduct = cart.products.find((p) => p.product.toString() === pid)

    if (existingProduct) {
      existingProduct.quantity += 1
    } else {
      cart.products.push({ product: pid, quantity: 1 })
    }

    await cart.save()
    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' })
  }
})

// Reemplazar el contenido del carrito por un nuevo array de productos
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const { products } = req.body

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Se espera un array de productos' })
    }

    const cart = await Cart.findById(cid)
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

    cart.products = products
    await cart.save()

    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el carrito' })
  }
})

// Vaciar el carrito (eliminar todos los productos)
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params

    const cart = await Cart.findById(cid)
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

    cart.products = []
    await cart.save()

    res.status(200).json({ message: 'Carrito vaciado exitosamente', cart })
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' })
  }
})


export default router
