export default class CartRepository {
  constructor(dao) { this.dao = dao }
  get(id) { return this.dao.findById(id) }
  update(id, data) { return this.dao.update(id, data) }
  save(doc) { return this.dao.save(doc) }
}
