const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const routes = require("./controllers");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("../frontend/dist"));

app.use("/api", routes);

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
