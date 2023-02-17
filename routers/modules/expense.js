const express = require('express')
const router = express.Router()

router.get('/new', (req, res) => {
  // const userId = req.user._id
  // Restaurant.find({ userId })
  //   .lean()
  //   .sort({ _id: 'asc' }) // desc
  //   .then(restaurants => res.render('index', { restaurants }))
  //   .catch(error => console.error(error))
  res.render('new')
})

module.exports = router