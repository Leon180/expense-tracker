const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')
const CATEGORY_LIST = {
  家居物業: "fa-solid fa-house",
  交通出行: "fa-solid fa-van-shuttle",
  休閒娛樂: "fa-solid fa-face-grin-beam",
  餐飲食品: "fa-solid fa-utensils",
  其他: "fa-solid fa-pen"
}

router.get('/:category', async (req, res) => {
  try {
    const category = req.params.category
    const categoryMatch = await Category.find({ name: category }).lean()
    const expenses = await Promise.all(
      categoryMatch.map(async (match) => {
        let expense = await Expense.findOne({ _id: match.id }).lean()
        expense.icon = CATEGORY_LIST[match.name]
        return expense
      })
    )
    const totalAmount = expenses.reduce((total, expense) =>
      total + Number(expense.amount), 0)
    res.render('index', { expenses, totalAmount })
  }
  catch {
    if (error) { console.error(error) }
  }
})


module.exports = router