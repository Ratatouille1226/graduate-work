const express = require("express");
const incomesExpenses = require("../models/IncomesExpenses");

const router = express.Router();

//Получение расходов доходов и пагинация (фильтрация)
router.get("/", async (req, res) => {
  try {
    const { sum_gte, sum_lt, _limit = 5, _page = 1 } = req.query;

    const filter = {};
    if (sum_gte !== undefined) filter.sum = { $gte: Number(sum_gte) };
    if (sum_lt !== undefined) filter.sum = { $lt: Number(sum_lt) };

    const limit = Number(_limit);
    const page = Number(_page);
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      incomesExpenses.find(filter).skip(skip).limit(limit),
      incomesExpenses.countDocuments(filter),
    ]);

    res.set("X-Total-Count", totalCount);
    res.json(data);
  } catch (e) {
    console.error("Ошибка в GET /incomesExpenses:", e);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

//Изменение комментария
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const updated = await incomesExpenses.findByIdAndUpdate(
      id,
      { comment }
      //   { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Транзакция не найдена" });
    res.json(updated);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении комментария", error });
  }
});

//Удаление комментария
router.delete("/comment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await incomesExpenses.findByIdAndUpdate(
      id,
      { comment: "" }
      //   { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Транзакция не найдена" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении комментария", error });
  }
});

//Удаление транзакции
router.delete("/:id", async (req, res) => {
  try {
    const result = await incomesExpenses.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Транзакция не найдена" });
    }

    res.json({ message: "Транзакция удалена" });
  } catch (e) {
    res.status(500).json({ message: "Ошибка при удалении", e });
  }
});

//Добавление транзакции
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
