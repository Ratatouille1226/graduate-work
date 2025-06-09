const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  account: { type: String, required: true },
  balance: { type: Number, required: true },
  cashback: { type: Number, default: "" },
});

module.exports = mongoose.model("Accounts", accountSchema);
