import bcrypt from 'bcrypt'

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, plainPassword) => {
  return bcrypt.compareSync(plainPassword, user.password)
}
