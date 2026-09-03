const mongoose = require("mongoose");

const cashRegisterSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },

    openingAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    closingAmount: {
      type: Number,
      min: 0,
    },

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
          required: true,
        },

        amount: {
          type: Number,
          required: true,
          min: 0,
        },

        method: {
          type: String,
          enum: ["cash", "card", "transfer"],
          required: true,
        },

        reference: {
          type: String,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CashRegister", cashRegisterSchema);
