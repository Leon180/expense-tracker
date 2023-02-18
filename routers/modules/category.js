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
const CATEGORY_ID = {
  家居物業: "1",
  交通出行: "2",
  休閒娛樂: "3",
  餐飲食品: "4",
  其他: "5"
}

router.get('/:category', async (req, res) => {
  try {
    const userId = req.user._id
    const category = req.params.category
    const categoryId = CATEGORY_ID[category]
    let expenses = await Expense.find({ userId, categoryId }).lean()
    await Promise.all(
      expenses.map(async (expense, i) => {
        const category = await Category.findOne({ id: expense._id }).lean()
        expense.icon = CATEGORY_LIST[category.name]
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