const exphbs = require('express-handlebars')

module.exports = app => {
  app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    // helper
    helpers: {
      selected: (categoryId, reqCategoryId) => {
        if (categoryId === reqCategoryId) return "selected"
      },
      
    }
  }))
  app.set('view engine', 'hbs')
}
