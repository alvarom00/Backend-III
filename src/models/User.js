import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true, index: true },
  age:        { type: Number, required: true },
  password:   { type: String, required: true },
  cartId:     { type: Schema.Types.ObjectId, ref: 'Cart', default: null },
  role:       { type: String, enum: ['user', 'admin', 'premium'], default: 'user' }
}, { timestamps: true })

export default model('User', userSchema)
