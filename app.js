const express = require('express')
const useExphbs = require('./config/hbs')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const routes = require('./routers/index')
// .env
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
require('./config/mongoose')
const port = process.env.PORT || 3000
const app = express()
// Setting express-handlebars
useExphbs(app)
// Setting Static file path
app.use(express.static('public'))
// Setting Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
// Setting Bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
// Setting Methodoverride
app.use(methodOverride('_method'))
// Setting Passport
usePassport(app)
// Setting flash
app.use(flash())
// Setting varibles for all views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
// Setting routes
app.use(routes)

app.listen(port, () => {
  console.log(`Listening port:${port}`)
})