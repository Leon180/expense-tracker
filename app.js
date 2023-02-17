const express = require('express')
const useExphbs = require('./config/hbs')
const routes = require('./routers/index')
// .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('./config/mongoose')



const app = express()
const port = 3000


useExphbs(app)
app.use(express.static('public'))
app.use(routes)

app.listen(port, () => {
  console.log(`Listening port:${port}`)
})