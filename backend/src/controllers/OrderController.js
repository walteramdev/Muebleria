const { createOrder, confirmOrder } = require("../services/orderService");

/**
 * Crear un pedido desde la web.
 */
const createOrderController = async (req, res, next) => {
  try {
    const { client, products, paymentMethod } = req.body;

    const order = await createOrder({
      client,
      products,
      paymentMethod,
    });

    return res.status(201).json({
      message: "Pedido creado correctamente.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirmar un pedido después de que el pago
 * haya sido aprobado.
 */
const confirmOrderController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { employeeId } = req.body;

    const { order, sale } = await confirmOrder(orderId, employeeId);

    return res.status(200).json({
      message: "Pedido confirmado correctamente.",
      order,
      sale,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrderController,
  confirmOrderController,
};
//
