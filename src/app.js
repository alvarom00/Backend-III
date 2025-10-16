import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import mocksRouter from './routes/mocks.routes.js'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRouter from './routes/views.routes.js'
import sessionRouterFactory from './routes/session.routes.js'
import Product from './models/Product.js'
import initializePassport from './config/passport.config.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

initializePassport(process.env.JWT_SECRET)
app.use(passport.initialize())

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionRouterFactory(process.env.JWT_SECRET))
app.use('/api/mocks', mocksRouter)

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

const PORT = process.env.PORT || 8080
httpServer.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
})
