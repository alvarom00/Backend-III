import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router()

const buildUserDTO = (user) => ({
  _id: user._id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  age: user.age,
  role: user.role,
  cartId: user.cartId
})

export default (jwtSecret) => {
  router.post(
    '/register',
    passport.authenticate('register', { session: false }),
    (req, res) => {
      res.status(201).send({ status: 'success', payload: buildUserDTO(req.user) })
    }
  )

  router.post(
    '/login',
    passport.authenticate('login', { session: false }),
    (req, res) => {
      const userDTO = buildUserDTO(req.user)
      const token = jwt.sign({ user: userDTO }, jwtSecret, { expiresIn: '1d' })

      res
        .cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000
        })
        .send({ status: 'success', payload: userDTO })
    }
  )

  router.get(
    '/current',
    passport.authenticate('current', { session: false }),
    (req, res) => {
      res.send({ status: 'success', payload: req.user })
    }
  )

  router.post('/logout', (req, res) => {
    res.clearCookie('jwt').send({ status: 'success', message: 'Logout ok' })
  })

  return router
}
