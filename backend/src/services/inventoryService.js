const Product = require("../models/Product");

/**
 * Procesa los productos de una operación.
 *
 * Responsabilidades:
 * - Validar productos y cantidades.
 * - Obtener los productos actuales de la BD.
 * - Comprobar stock disponible.
 * - Obtener el precio actual.
 * - Aplicar descuentos.
 * - Calcular subtotales.
 * - Calcular total.
 * - Crear snapshots de los productos.
 *
 * NO descuenta stock.
 */
const processProducts = async ({ products, session = null }) => {
  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error("Debe haber al menos un producto.");
    error.status = 400;
    throw error;
  }

  let total = 0;
  const processedProducts = [];

  for (const item of products) {
    const {
      product: productId,
      quantity,
      discount = 0,
      discountType = "fixed",
    } = item;

    const qty = Number(quantity);
    const disc = Number(discount);

    // -----------------------------
    // Validar producto
    // -----------------------------

    if (!productId) {
      const error = new Error("El producto es obligatorio.");
      error.status = 400;
      throw error;
    }

    // -----------------------------
    // Validar cantidad
    // -----------------------------

    if (!Number.isInteger(qty) || qty <= 0) {
      const error = new Error(
        "La cantidad debe ser un número entero mayor a 0.",
      );

      error.status = 400;
      throw error;
    }

    // -----------------------------
    // Validar descuento
    // -----------------------------

    if (!Number.isFinite(disc) || disc < 0) {
      const error = new Error(
        "El descuento debe ser un número mayor o igual a 0.",
      );

      error.status = 400;
      throw error;
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      const error = new Error("Tipo de descuento inválido.");
      error.status = 400;
      throw error;
    }

    if (discountType === "percentage" && disc > 100) {
      const error = new Error(
        "El descuento porcentual no puede superar el 100%.",
      );

      error.status = 400;
      throw error;
    }

    // -----------------------------
    // Buscar producto
    // -----------------------------

    const query = Product.findById(productId);

    if (session) {
      query.session(session);
    }

    const productDB = await query;

    if (!productDB) {
      const error = new Error(`Producto no encontrado: ${productId}`);
      error.status = 404;
      throw error;
    }

    // -----------------------------
    // Obtener precio
    // -----------------------------

    const price = Number(productDB.price);

    if (!Number.isFinite(price) || price < 0) {
      const error = new Error(
        `El precio del producto ${productDB.name} no es válido.`,
      );

      error.status = 500;
      throw error;
    }

    // -----------------------------
    // Comprobar stock
    // -----------------------------

    if (productDB.stock < qty) {
      const error = new Error(
        `Stock insuficiente para ${productDB.name}. ` +
          `Stock disponible: ${productDB.stock}.`,
      );

      error.status = 400;
      throw error;
    }

    // -----------------------------
    // Calcular subtotal
    // -----------------------------

    const subtotalWithoutDiscount = price * qty;

    let subtotal;

    if (discountType === "percentage") {
      subtotal = subtotalWithoutDiscount * (1 - disc / 100);
    } else {
      subtotal = subtotalWithoutDiscount - disc;
    }

    if (subtotal < 0) {
      subtotal = 0;
    }

    subtotal = Number(subtotal.toFixed(2));

    total += subtotal;

    // -----------------------------
    // Crear snapshot
    // -----------------------------

    processedProducts.push({
      product: productDB._id,
      name: productDB.name,
      brand: productDB.brand || "",
      quantity: qty,
      price,
      discount: disc,
      discountType,
      subtotal,
    });
  }

  total = Number(total.toFixed(2));

  return {
    products: processedProducts,
    total,
  };
};

/**
 * Descuenta stock de los productos.
 *
 * Debe ejecutarse dentro de una transacción.
 */
const decreaseStock = async (products, session) => {
  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error("No hay productos para descontar del inventario.");

    error.status = 400;
    throw error;
  }

  if (!session) {
    const error = new Error(
      "La operación de inventario requiere una transacción.",
    );

    error.status = 500;
    throw error;
  }

  for (const item of products) {
    const productId = item.product;
    const quantity = Number(item.quantity);

    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      const error = new Error(
        "Producto o cantidad inválida para descontar stock.",
      );

      error.status = 400;
      throw error;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        stock: { $gte: quantity },
      },
      {
        $inc: {
          stock: -quantity,
        },
      },
      {
        new: true,
        session,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      const error = new Error(
        `El stock de ${productId} cambió mientras se procesaba la operación. ` +
          "Intente nuevamente.",
      );

      error.status = 409;
      throw error;
    }
  }
};

module.exports = {
  processProducts,
  decreaseStock,
};
