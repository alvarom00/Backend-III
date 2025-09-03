import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRouter from './routes/views.routes.js'
import sessionRouterFactory from './routes/session.routes.js'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { initializePassport } from './config/passport.config.js'

mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

const JWT_SECRET = process.env.JWT_SECRET || 'devSecret'

initializePassport(JWT_SECRET)
app.use(passport.initialize())

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionRouterFactory(JWT_SECRET))
app.use('/', viewsRouter)

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado')

  socket.on('newProduct', async (data) => {
    try {
      await Product.create(data)
      const allProducts = await Product.find().lean()
      io.emit('updateProducts', allProducts)
    } catch (error) {
      console.error('Error al crear producto:', error)
    }
  })
})

const PORT = 8080
httpServer.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
})
