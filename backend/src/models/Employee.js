const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
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
    phone: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true }, //se puede agregar street, city, state postalCode, country
    notes: { type: String, trim: true, default: null },
    maritalStatus: {
      type: String,
      enum: {
        values: ["single", "married", "divorced", "widowed"],
        message: "{VALUE} no es un estado civil válido.",
      },
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    statusChangedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", employeeSchema);
