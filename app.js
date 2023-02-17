const express = require('express')
const useExphbs = require('./config/hbs')
const routes = require('./routers/index')
const app = express()
const port = 3000

useExphbs(app)
app.use(express.static('public'))
app.use(routes)

app.listen(port, () => {
  console.log(`Listening port:${port}`)
})