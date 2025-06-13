const express = require("express");
const incomesExpenses = require("../models/IncomesExpenses");

const router = express.Router();

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

module.exports = router;
