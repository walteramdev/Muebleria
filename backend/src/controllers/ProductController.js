const Product = require("../models/Product");

const createProduct = async (req, res, next) => {
  try {
    // Log de datos recibidos
    console.log("📨 Datos recibidos:", JSON.stringify(req.body, null, 2));

    // Validar que hay imágenes
    if (!req.body.images || !Array.isArray(req.body.images)) {
      console.warn("⚠️ No hay imágenes o no es array");
      return res.status(400).json({
        message: "Debe haber al menos una imagen.",
        details: "Las imágenes deben ser un array",
      });
    }

    if (req.body.images.length === 0) {
      console.warn("⚠️ Array de imágenes vacío");
      return res.status(400).json({
        message: "Debe haber al menos una imagen.",
        details: "El array de imágenes está vacío",
      });
    }

    // Validar estructura de imágenes
    const invalidImages = req.body.images.filter(
      (img, idx) =>
        !(
          (typeof img === "object" && img.url && img.public_id) ||
          typeof img === "string"
        ) && `Imagen ${idx}: estructura inválida`,
    );

    if (invalidImages.length > 0) {
      console.warn("⚠️ Imágenes con estructura inválida:", invalidImages);
      return res.status(400).json({
        message: "Las imágenes deben tener formato válido (url y public_id).",
        details: "Cada imagen debe tener: url (string) y public_id (string)",
        received: req.body.images,
      });
    }

    console.log("✅ Validación de imágenes OK");
    const product = await Product.create(req.body);

    console.log("✅ Producto creado:", product._id);
    res.status(201).json({
      mensaje: "Producto creado con éxito.",
      product,
    });
  } catch (error) {
    console.error("❌ Error en createProduct:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "El código de barra ya está en uso.",
        details: error.message,
      });
    }

    // Error de validación de MongoDB
    if (error.name === "ValidationError") {
      const messages = Object.entries(error.errors).map(
        ([field, err]) => `${field}: ${err.message}`,
      );
      return res.status(400).json({
        message: "Error de validación",
        details: messages,
      });
    }

    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const idProduct = req.params.id;
    const updateDate = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      idProduct,
      updateDate,
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      const error = new Error("Producto no encontrado para actualizar.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Producto actualizado con éxito.",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "El codigo de barra ya esta en uso" });
    }
    console.error("Error al actualizar el producto", error.message);
    // error.status = 404;
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const idProduct = req.params.id;
    const deletedProduct = await Product.findOneAndUpdate(
      { _id: idProduct, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
    if (!deletedProduct) {
      const error = new Error("Producto no encontrado o ya eliminado.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Producto eliminado con éxito",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);

    if (error.name === "CastError") {
      error.status = 400;
    }
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res
      .status(200)
      .json({ message: "Productos recuperados con éxito.", products });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    next(error);
  }
};
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      const error = new Error("Producto no encontrado.");
      error.status = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ message: "Producto recuperado con éxito.", product });
  } catch (error) {
    console.error("Error al obtener el producto por ID:", error.message);

    if (error.name === "CastError") {
      error.status = 400;
    }

    next(error);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
};
