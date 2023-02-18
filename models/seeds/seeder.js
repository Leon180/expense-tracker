const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const Expense = require('../expense')
const Category = require('../category')
const User = require('../user')
SEED_USER1 = {
  name: 'example1',
  email: 'example1@gmail.com',
  password: '12345678'
}
const CATEGORY_LIST = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']


db.once('open', async () => {
  console.log('creating seeds')
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(SEED_USER1.password, salt)
  const user = await User.create({
    name: SEED_USER1.name,
    email: SEED_USER1.email,
    password: hash
  })
  const expense = await Expense.create({
    name: '晚餐',
    date: '2023-05-10',
    categoryId: 4,
    amount: 180,
    userId: user._id
  })
  await Category.create({
    id: expense._id,
    name: CATEGORY_LIST[Number(expense.categoryId) - 1]
  })
  console.log('done!')
  process.exit()
})