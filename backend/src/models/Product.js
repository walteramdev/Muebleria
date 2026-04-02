const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    name: { type: String, trim: true, required: true },
    description: {
      type: String,
      trim: true,
      required: [true, "La descripción es obligatoria."],
    },
    price: {
      type: Number,
      min: [0, "El precio no puede ser negativo."],
      required: [true, "El precio es obligatorio."],
    },
    stock: {
      type: Number,
      min: [0, "La cantidad no puede ser negativa."],
      required: [true, "La cantidad es obligatoria."],
    },
    brand: {
      type: String,
      trim: true,
      required: true,
    },
    //Hacer un schema
    supplier: {
      type: String,
      trim: true,
      required: true,
    },
    //modificar
    category: {
      type: String,
      enum: [
        "engine",
        "lighting",
        "frontSuspension",
        "rearSuspension",
        "brakes",
      ],
    },
    //revisar
    features: {
      medidas: { type: String, trim: true },
      materiales: { type: String, trim: true },
      acabado: { type: String, trim: true },
      peso: { type: String, trim: true },
      capacidad: { type: String, trim: true },
      modulares: { type: String, trim: true },
      tapizado: { type: String, trim: true },
      confort: { type: String, trim: true },
      rotacion: { type: String, trim: true },
      garantia: { type: String, trim: true },
      almacenamiento: { type: String, trim: true },
      colchon: { type: String, trim: true },
      sostenibilidad: { type: String, trim: true },
      extension: { type: String, trim: true },
      apilables: { type: String, trim: true },
      incluye: { type: String, trim: true },
      cables: { type: String, trim: true },
      certificación: { type: String, trim: true },
      regulación: { type: String, trim: true },
      caracteristica: { type: String, trim: true },
    },
    imagenUrl: {
      type: String,
      trim: true,
      required: [true, "La imagen es obligatoria."],
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
