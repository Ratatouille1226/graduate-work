const express = require("express");
const IncomesExpenses = require("../models/IncomesExpenses");

const router = express.Router();
//Получение расходов доходов
router.get("/", async (req, res) => {
  try {
    const incomesExpenses = await IncomesExpenses.find();
    res.json(incomesExpenses);
  } catch (e) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
