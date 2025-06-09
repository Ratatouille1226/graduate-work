const express = require("express");
const Account = require("../models/Accounts");

const router = express.Router();
//Получение счетов
router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (e) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
