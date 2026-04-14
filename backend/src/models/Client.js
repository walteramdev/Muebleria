const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    nationalId: {
      type: String, //chequear
      trim: true,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    phone: { type: String, trim: true, required: true }, //match: [/^\+?[0-9]{7,15}$/, "Teléfono inválido"]
    address: { type: String, trim: true, required: true }, //se puede agregar street, city, state postalCode, country
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "suspended"],
      default: "active",
    },
    statusChangedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Client", clientSchema);
