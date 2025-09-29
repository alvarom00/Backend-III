import passport from 'passport'

export const ensureAuth = passport.authenticate('current', { session: false })

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).send({ status: 'error', message: 'No autenticado' })
    if (!roles.includes(req.user.role))
      return res.status(403).send({ status: 'error', message: 'No autorizado' })
    next()
  }
