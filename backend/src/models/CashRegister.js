const mongoose = require("mongoose");

const cashRegisterSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  openingAmount: { type: Number, required: true },
  closingAmount: { type: Number },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
    index: true,
  },

  movements: [
    {
      type: {
        type: String,
        enum: ["sale", "expense"],
      },
      amount: Number,
      method: String,
      reference: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("CashRegister", cashRegisterSchema);
