const express = require("express");
const incomesExpenses = require("../models/IncomesExpenses");

const router = express.Router();

router.get("/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Текущая страница, по умолчанию 1
    const limit = parseInt(req.query.limit) || 10; // Кол-во на странице, по умолчанию 10

    const skip = (page - 1) * limit;

    // Общее количество документов (для подсчёта всего страниц)
    const total = await incomesExpenses.countDocuments();

    // Получаем данные с пагинацией
    const transactions = await incomesExpenses
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 }); // сортируем, например, по дате

    res.json({
      data: transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
