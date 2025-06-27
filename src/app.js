import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRouter from './routes/views.routes.js'

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

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado')

  socket.on('newProduct', async (data) => {
    const { readJSON, writeJSON } = await import('./utils/fileManager.js')
    const { randomUUID } = await import('crypto')
    const products = await readJSON('productos.json')

    const newProduct = {
      id: randomUUID(),
      ...data
    }

    products.push(newProduct)
    await writeJSON('productos.json', products)

    io.emit('updateProducts', products)
  })
})

const PORT = 8080
httpServer.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
})
