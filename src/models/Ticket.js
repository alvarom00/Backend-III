import { Schema, model } from 'mongoose'

const ticketSchema = new Schema(
  {
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true } // email del usuario
  },
  { timestamps: true }
)

export default model('Ticket', ticketSchema)
