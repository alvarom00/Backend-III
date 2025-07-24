import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  code: String,
  stock: Number,
  category: String,
  thumbnails: [String],
  status: Boolean
})

productSchema.plugin(mongoosePaginate)

export default mongoose.model('Product', productSchema)
