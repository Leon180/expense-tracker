const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: 'Expense',
    index: true,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Category', categorySchema)