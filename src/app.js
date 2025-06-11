import express from 'express'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 8080

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
