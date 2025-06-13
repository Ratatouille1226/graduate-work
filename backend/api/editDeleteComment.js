const express = require("express");
const incomesExpenses = require("../models/IncomesExpenses");

const router = express.Router();

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

module.exports = router;
