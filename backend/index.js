const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const accountsRouter = require("./api/getAccounts"); //Счета
const incomesExpensesRouter = require("./api/getIncomesExpenses"); //Расходы доходы
const authRouter = require("./api/loginAndAuthorization"); //Регистрация/авторизация
const deleteIncomesExpenses = require("./api/deleteIncomesExpenses"); //Удаление транзакций
const addNewTransaction = require("./api/addIncomesExpenses"); //Добавление транзакции
const editDeleteComments = require("./api/editDeleteComment"); //Изменение удаление комментариев

app.use("/accounts", accountsRouter);
app.use("/incomesExpenses", incomesExpensesRouter);
app.use("/auth", authRouter);
app.use("/incomesExpenses", deleteIncomesExpenses);
app.use("/incomesExpenses", addNewTransaction);
app.use("/incomesExpenses", editDeleteComments);

app.get("/", (req, res) => {
  res.send("Сервер работает");
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL); //Подключаю через env чтобы не пушить ключ на гит
    console.log("MongoDB подключен");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Сервер запущен");
    });
  } catch (e) {
    console.log("Ошибка при подключении сервера", e);
  }
};

start();
