/**
 * Calcula el subtotal de un producto.
 *
 * @param {Number} price
 * @param {Number} quantity
 * @param {Number} discount
 * @param {String} discountType
 *
 * @returns {Number}
 */
const calculateSubtotal = (
  price,
  quantity,
  discount = 0,
  discountType = "fixed",
) => {
  const parsedPrice = Number(price);
  const parsedQuantity = Number(quantity);
  const parsedDiscount = Number(discount);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    const error = new Error("El precio del producto es inválido.");

    error.status = 400;
    throw error;
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    const error = new Error("La cantidad debe ser un número entero mayor a 0.");

    error.status = 400;
    throw error;
  }

  if (!Number.isFinite(parsedDiscount) || parsedDiscount < 0) {
    const error = new Error("El descuento es inválido.");

    error.status = 400;
    throw error;
  }

  if (discountType !== "fixed" && discountType !== "percentage") {
    const error = new Error("El tipo de descuento es inválido.");

    error.status = 400;
    throw error;
  }

  if (discountType === "percentage" && parsedDiscount > 100) {
    const error = new Error(
      "El descuento porcentual no puede superar el 100%.",
    );

    error.status = 400;
    throw error;
  }

  const baseAmount = parsedPrice * parsedQuantity;

  let subtotal;

  if (discountType === "percentage") {
    subtotal = baseAmount * (1 - parsedDiscount / 100);
  } else {
    subtotal = baseAmount - parsedDiscount;
  }

  // Evitamos subtotales negativos.
  subtotal = Math.max(0, subtotal);

  return subtotal;
};

/**
 * Calcula productos y total de una operación.
 *
 * Recibe productos previamente validados
 * por inventoryService.
 *
 * @param {Array} products
 *
 * @returns {Object}
 */
const calculateOrderTotals = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error("No hay productos para calcular.");

    error.status = 400;
    throw error;
  }

  let total = 0;

  const processedProducts = products.map((item) => {
    const productDB = item.product;
    const quantity = item.quantity;

    const discount = item.discount ?? 0;

    const discountType = item.discountType ?? "fixed";

    const price = Number(productDB.price);

    const subtotal = calculateSubtotal(price, quantity, discount, discountType);

    total += subtotal;

    return {
      product: productDB._id,
      name: productDB.name,
      brand: productDB.brand || "",
      quantity,
      price,
      discount,
      discountType,
      subtotal,
    };
  });

  return {
    products: processedProducts,
    total,
  };
};

module.exports = {
  calculateSubtotal,
  calculateOrderTotals,
};
