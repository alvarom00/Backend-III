import Cart from '../models/Cart.js'

export default class CartDAO {
  findById(id) { return Cart.findById(id).populate('products.product').lean(false) }
  update(id, data) { return Cart.findByIdAndUpdate(id, data, { new: true }) }
  save(doc) { return doc.save() }
}
