const socket = io()

const form = document.getElementById('productForm')
const list = document.getElementById('productList')

form.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(form)
  const product = Object.fromEntries(formData.entries())
  product.price = Number(product.price)
  product.stock = Number(product.stock)
  product.thumbnails = []
  product.status = true

  socket.emit('newProduct', product)
  form.reset()
})

socket.on('updateProducts', products => {
  list.innerHTML = ''
  products.forEach(p => {
    const li = document.createElement('li')
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price}`
    list.appendChild(li)
  })
})
