export default class ProductRepository {
  constructor(dao) { this.dao = dao }
  paginate(filter, options) { return this.dao.paginate(filter, options) }
  get(id) { return this.dao.findById(id) }
  create(data) { return this.dao.create(data) }
  update(id, data) { return this.dao.update(id, data) }
  delete(id) { return this.dao.delete(id) }
}
