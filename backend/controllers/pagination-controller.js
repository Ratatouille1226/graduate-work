const express = require("express");
const incomesExpenses = require("../models/IncomesExpenses");

const router = express.Router();

router.get("/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type;

    const filter = type ? { type } : {}; // если передан тип — фильтруем

    const totalCount = await incomesExpenses.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);
    const data = await incomesExpenses
      .find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Ошибка при пагинации:", err);
    res.status(500).json({ error: "Ошибка сервера при пагинации" });
  }
});

module.exports = router;
