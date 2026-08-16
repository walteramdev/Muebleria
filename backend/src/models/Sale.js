const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      index: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
      index: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        brand: {
          type: String,
          default: "",
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        discount: {
          type: Number,
          default: 0,
          min: 0,
        },

        discountType: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "fixed",
        },

        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    totalDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    payments: [
      {
        method: {
          type: String,
          enum: ["cash", "card", "transfer"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    status: {
      type: String,
      enum: ["completed", "cancelled"],
      default: "completed",
      index: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Sale", saleSchema);
