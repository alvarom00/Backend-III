import Product from '../models/Product.js'

export default class ProductDAO {
  paginate(filter, options) { return Product.paginate(filter, options) }
  findById(id) { return Product.findById(id) }
  create(data) { return Product.create(data) }
  update(id, data) { return Product.findByIdAndUpdate(id, data, { new: true }) }
  delete(id) { return Product.findByIdAndDelete(id) }
}
