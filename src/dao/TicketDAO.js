import Ticket from '../models/Ticket.js'

const genCode = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

export default class TicketDAO {
  async create({ amount, purchaser }) {
    return Ticket.create({ code: genCode(), amount, purchaser })
  }
}
