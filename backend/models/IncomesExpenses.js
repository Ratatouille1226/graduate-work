const mongoose = require("mongoose");

const incomesExpensesSchema = new mongoose.Schema({
  categories: { type: String, required: true },
  sum: { type: Number, required: true },
  date: { type: Date, required: true },
  comment: { type: String, default: "" },
});

module.exports = mongoose.model(
  "IncomesExpenses",
  incomesExpensesSchema,
  "incomesExpenses"
); //Передаю в 3 агументе название пути, потому что монго приводит всё к нижнему регистру
