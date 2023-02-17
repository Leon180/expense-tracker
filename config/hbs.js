const exphbs = require('express-handlebars')

module.exports = app => {
  app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    // helper
    helpers: {
      selected: (sortSelecting) => {
        if (sortSelecting) return "selected"
      }
    }
  }))
  app.set('view engine', 'hbs')
}
