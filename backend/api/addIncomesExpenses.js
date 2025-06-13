const express = require("express");
const incomesExpenses = require("../models/IncomesExpenses");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { categories, sum, date, comment } = req.body;
    const newTransaction = new incomesExpenses({
      categories,
      sum,
      date: date ? new Date(date) : new Date(),
      comment,
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (e) {
    res.status(500).json({ message: "Ошибка при добавлении транзакции", e });
  }
});

module.exports = router;
