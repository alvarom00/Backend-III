import mongoose from 'mongoose'

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true }
}, { timestamps: true })

export default mongoose.model('Pet', petSchema)
