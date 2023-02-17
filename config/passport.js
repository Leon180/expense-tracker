const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // Middleware
  app.use(passport.initialize())
  app.use(passport.session())
  // LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        const findUser = await User.findOne({ email })
        // if not found
        if (!findUser) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        const compareResult = await bcrypt.compare(password, findUser.password)
        if (!compareResult) {
          return done(null, false, { message: 'Email or Password incorrect.' })
        }
        return done(null, findUser)
      }
      catch {
        if (error) { done(error, false) }
      }
    }));
  // Facebook
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']// Request Facebook's public data
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { name, email } = profile._json
      const findUser = await User.findOne({ email })
      if (findUser) return done(null, findUser)
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(randomPassword, salt)
      const user = await User.create({
        name, email, password: hash
      })
      done(null, user)
    }
    catch {
      if (error) { done(error, false) }
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      done(null, user)
    }
    catch {
      if (error) { done(error, null) }
    }
  })
}