// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')
const CATEGORY_LIST = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']

// New
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', async (req, res) => {
  const errors = []
  if (req.body.date === '') {
    errors.push({ message: 'Please input a Date' })
  }
  if (req.body.categoryId === 'Select') {
    errors.push({ message: 'Please Select a Category' })
  }
  if (isNaN(req.body.amount)) {
    errors.push({ message: 'Please input a Number in amount column' })
  }
  if (errors.length) {
    return res.render('new', { errors, expense: req.body })
  }
  try {
    const userId = req.user._id
    const expense = await Expense.create({
      name: req.body.name,
      date: req.body.date,
      categoryId: req.body.categoryId,
      amount: req.body.amount,
      userId
    })
    await Category.create({
      id: expense._id,
      name: CATEGORY_LIST[Number(req.body.categoryId) - 1]
    })
    return res.redirect('/')
  }
  catch {
    console.log(error)
  }
})

// Edit
router.get('/:expenseId/edit', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.expenseId
  try {
    const expense = await Expense.findOne({ _id, userId }).lean()
    return res.render('edit', { expense })
  }
  catch {
    if (error) { console.log(error) }
  }
})

router.put('/:expenseId', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.expenseId
  const errors = []
  if (req.body.date === '') {
    errors.push({ message: 'Please input a Date' })
  }

  if (isNaN(req.body.amount)) {
    errors.push({ message: 'Please input a Number in amount column' })
  }
  if (errors.length) {
    let expense = req.body
    expense._id = _id
    expense.userId = userId
    return res.render('edit', { errors, expense })
  }
  try {
    await Expense.findByIdAndUpdate({ _id, userId }, req.body)
    const expense = await Expense.findOne({ _id, userId }).lean()
    await Category.findOneAndUpdate({ id: expense._id }, {
      name: CATEGORY_LIST[Number(expense.categoryId) - 1]
    })
    return res.redirect('/')
  }
  catch {
    if (error) { console.log(error) }
  }
})

// Delete
router.delete('/:expenseId', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.expenseId
  try {
    await Expense.findOneAndRemove({ _id, userId })
    res.redirect('/')
  }
  catch { console.log(error) }
})

module.exports = router