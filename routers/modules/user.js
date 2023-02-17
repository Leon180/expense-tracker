const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'Please input all columns' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'input incorrect confirm password' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  const findUser = await User.findOne({ email })
  if (findUser) {
    errors.push({ message: 'The email has been registered' })
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({
      name,
      email,
      password: hash
    })
    // if successful register, than directly login
    req.login(user, (error) => {
      if (!error) {
        res.redirect('/');
      } else {
        console.log(error)
      }
    })
  }
  catch {
    if (error) { console.log(error) }
  }
})

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash('success_msg', 'Successfully logout')
    res.redirect('/');
  })
})

module.exports = router