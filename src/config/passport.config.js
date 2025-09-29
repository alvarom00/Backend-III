import passport from 'passport'
import local from 'passport-local'
import jwt from 'passport-jwt'
import User from '../models/User.js'
import { createHash, isValidPassword } from '../utils/bcrypt.js'
import Cart from '../models/Cart.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) token = req.cookies['jwt']
  return token
}

export default function initializePassport(jwtSecret) {
  passport.use(
    'register',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true, session: false },
      async (req, email, password, done) => {
        try {
          const exists = await User.findOne({ email })
          if (exists) return done(null, false)

          const newCart = await Cart.create({ products: [] })

          const user = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email,
            age: req.body.age,
            password: createHash(password),
            cartId: newCart._id,
            role: 'user'
          })

          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email', session: false },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email })
          if (!user) return done(null, false)
          if (!isValidPassword(user, password)) return done(null, false)
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.use(
    'current',
    new JWTStrategy(
      { jwtFromRequest: cookieExtractor, secretOrKey: jwtSecret },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload.user)
        } catch (err) {
          return done(err, false)
        }
      }
    )
  )
}
