const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const controllerAccounts = require("./controllers/controller-accounts"); //Счета
const authRouter = require("./controllers/loginAndAuthorization"); //Регистрация/авторизация
const controllerIncomesExpenses = require("./controllers/controller-incomesExpenses"); //Операции транзакций
const paginationRoute = require("./controllers/pagination-controller");

app.use("/accounts", controllerAccounts);
app.use("/auth", authRouter);
app.use("/incomesExpenses", controllerIncomesExpenses);
app.use("/incomesExpenses", paginationRoute);

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
