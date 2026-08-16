const mongoose = require("mongoose");
const Order = require("../models/Order");
const Sale = require("../models/Sale");
const { processProducts, decreaseStock } = require("./inventoryService");

const generateOrderNumber = () => {
  return `PED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const generateInvoiceNumber = () => {
  return `FAC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Crea un pedido web.
 *
 * En esta etapa:
 * - Se valida el cliente.
 * - Se procesan los productos.
 * - Se captura el precio y descuento actuales.
 * - Se calcula el total.
 * - Se crea el Order.
 *
 * NO se descuenta stock.
 * El stock se descuenta al confirmar el pedido,
 * después de que el pago haya sido aprobado.
 */
const createOrder = async ({ client, products, paymentMethod }) => {
  // ---------------------------------
  // Validar cliente
  // ---------------------------------

  if (!client || !mongoose.Types.ObjectId.isValid(client)) {
    const error = new Error("Cliente inválido.");
    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Validar productos
  // ---------------------------------

  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error("El pedido debe tener al menos un producto.");

    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Validar método de pago
  // ---------------------------------

  const allowedPaymentMethods = ["cash", "card", "transfer"];

  if (!allowedPaymentMethods.includes(paymentMethod)) {
    const error = new Error("Método de pago inválido.");
    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Procesar productos
  // ---------------------------------

  const { products: processedProducts, total } = await processProducts({
    products,
  });

  // ---------------------------------
  // Generar número de pedido
  // ---------------------------------

  const orderNumber = generateOrderNumber();

  // ---------------------------------
  // Crear Order
  // ---------------------------------

  const order = await Order.create({
    orderNumber,
    client,
    products: processedProducts,
    total,
    status: "pending",

    payment: {
      method: paymentMethod,
      status: "pending",
      amount: total,
    },
  });

  return order;
};

/**
 * Confirma un pedido después de que el pago
 * haya sido aprobado.
 *
 * Esta operación se realiza dentro de una
 * transacción MongoDB.
 */
const confirmOrder = async (orderId, employeeId) => {
  // ---------------------------------
  // Validar Order ID
  // ---------------------------------

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = new Error("ID de pedido inválido.");
    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Validar empleado
  // ---------------------------------

  if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
    const error = new Error("Empleado inválido.");
    error.status = 400;
    throw error;
  }

  const session = await mongoose.startSession();

  try {
    // ---------------------------------
    // Iniciar transacción
    // ---------------------------------

    session.startTransaction();

    // ---------------------------------
    // Obtener Order
    // ---------------------------------

    const order = await Order.findById(orderId).session(session);

    if (!order) {
      const error = new Error("Pedido no encontrado.");
      error.status = 404;
      throw error;
    }

    // ---------------------------------
    // Verificar estado del pedido
    // ---------------------------------

    if (order.status !== "pending") {
      const error = new Error(
        "El pedido no puede ser confirmado porque no está pendiente.",
      );

      error.status = 400;
      throw error;
    }

    // ---------------------------------
    // Verificar pago
    // ---------------------------------

    if (order.payment.status !== "paid") {
      const error = new Error(
        "El pedido no puede ser confirmado porque el pago no está aprobado.",
      );

      error.status = 400;
      throw error;
    }

    // ---------------------------------
    // Descontar stock
    // ---------------------------------

    await decreaseStock(order.products, session);

    // ---------------------------------
    // Crear Sale
    // ---------------------------------

    const invoiceNumber = generateInvoiceNumber();

    const sale = await Sale.create(
      [
        {
          invoiceNumber,

          client: order.client,

          employee: employeeId,

          order: order._id,

          // Snapshot tomado directamente
          // del Order.
          products: order.products,

          total: order.total,

          payments: [
            {
              method: order.payment.method,
              amount: order.payment.amount,
            },
          ],

          status: "completed",
        },
      ],
      {
        session,
      },
    );

    // ---------------------------------
    // Actualizar Order
    // ---------------------------------

    order.status = "confirmed";
    order.sale = sale[0]._id;

    await order.save({ session });

    // ---------------------------------
    // Confirmar transacción
    // ---------------------------------

    await session.commitTransaction();

    return {
      order,
      sale: sale[0],
    };
  } catch (error) {
    // ---------------------------------
    // Revertir transacción
    // ---------------------------------

    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createOrder,
  confirmOrder,
};
