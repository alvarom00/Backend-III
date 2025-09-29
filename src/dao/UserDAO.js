import User from '../models/User.js'
export default class UserDAO {
  findByEmail(email) { return User.findOne({ email }) }
  findById(id) { return User.findById(id) }
}
