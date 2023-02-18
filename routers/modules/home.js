const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

router.get('/', async (req, res) => {
  const userId = req.user._id
  try {
    const expenses = await Expense.find({ userId }).lean().sort()
    const totalAmount = expenses.reduce((total, expense) => 
      total + Number(expense.amount), 0)
    res.render('index', { expenses, totalAmount })
  }
  catch {
    if (error) { console.error(error) }
  }
})

module.exports = router
