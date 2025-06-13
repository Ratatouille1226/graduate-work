const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

//Регистрация
router.post("/register", async (req, res) => {
  try {
    const { login, password } = req.body;

    const findUser = await User.findOne({ login });
    if (findUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ login, password: passwordHash });
    await user.save();

    res.status(201).json({ message: "Пользователь создан" });
  } catch (e) {
    res.status(500).json({ message: "Ошибка при регистрации" });
  }
});

//Авторизация
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign(
      { userId: user._id, login: user.login },
      "secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, userId: user._id, username: user.username });
  } catch (e) {
    res.status(500).json({ message: "Ошибка при авторизации" });
  }
});

module.exports = router;
