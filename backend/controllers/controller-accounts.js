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

//Получени данных для страницы счёта
router.get("/:id", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (e) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

//Добавление счёта
router.post("/", async (req, res) => {
  try {
    const { account, balance, cashback } = req.body;

    if (!account || !balance || !cashback) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const newAccount = new Account({
      account,
      balance,
      cashback,
    });

    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (e) {
    console.error("Ошибка при добавлении счёта:", e);
    res.status(500).json({ message: "Ошибка сервера при добавлении счёта" });
  }
});

//Изменение счёта
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { balance, cashback } = req.body;

    // Проверка, чтобы хотя бы одно из полей присутствовало
    if (balance === undefined && cashback === undefined) {
      return res
        .status(400)
        .json({ message: "Не передано ни одно поле для обновления" });
    }

    // Объект с изменениями
    const updateFields = {};
    if (balance !== undefined) updateFields.balance = balance;
    if (cashback !== undefined) updateFields.cashback = cashback;

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: "Счёт не найден" });
    }

    res.json(updatedAccount);
  } catch (error) {
    console.error("Ошибка при обновлении счёта:", error);
    res.status(500).json({ message: "Ошибка сервера при обновлении счёта" });
  }
});

//Удаление счёта
router.delete("/:id", async (req, res) => {
  try {
    const accountId = req.params.id;

    const deletedAccount = await Account.findByIdAndDelete(accountId);

    if (!deletedAccount) {
      return res.status(404).json({ message: "Счёт не найден" });
    }

    res.json({ message: "Счёт удалён", account: deletedAccount });
  } catch (e) {
    res.status(500).json({ message: "Ошибка при удалении счёта" });
  }
});

module.exports = router;
