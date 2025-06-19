const express = require("express");

const router = express.Router({ mergeParams: true });

const controllerAccounts = require("./controller-accounts"); //Счета
const authRouter = require("./loginAndAuthorization"); //Регистрация/авторизация
const controllerIncomesExpenses = require("./controller-incomesExpenses"); //Операции транзакций
const paginationRoute = require("./pagination-controller");

// router.use("/api", routes);
router.use("/accounts", controllerAccounts);
router.use("/auth", authRouter);
router.use("/incomesExpenses", controllerIncomesExpenses);
router.use("/incomesExpenses", paginationRoute);

// router.use("/", require("./auth"))
// router.use("/products", require("./product"))
// router.use("/users", require("./user"))
// router.use("/cart", require("./cart"))

module.exports = router;
