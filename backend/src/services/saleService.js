const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const CashRegister = require("../models/CashRegister");
const { processProducts, decreaseStock } = require("./inventoryService");

const generateInvoiceNumber = () => {
  return `FAC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Crea una venta de mostrador.
 *
 * Flujo:
 * 1. Valida los datos básicos.
 * 2. Inicia una transacción.
 * 3. Comprueba que exista una caja abierta.
 * 4. Procesa productos.
 * 5. Comprueba stock.
 * 6. Calcula subtotales y total.
 * 7. Descuenta stock.
 * 8. Crea la Sale.
 * 9. Registra los movimientos en la caja.
 * 10. Confirma la transacción.
 *
 * No utiliza Order.
 */
const createSale = async ({ client = null, employee, products, payments }) => {
  // ---------------------------------
  // Validar empleado
  // ---------------------------------

  if (!employee || !mongoose.Types.ObjectId.isValid(employee)) {
    const error = new Error("Empleado inválido.");
    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Validar cliente
  // ---------------------------------

  if (client !== null) {
    if (!mongoose.Types.ObjectId.isValid(client)) {
      const error = new Error("Cliente inválido.");
      error.status = 400;
      throw error;
    }
  }

  // ---------------------------------
  // Validar productos
  // ---------------------------------

  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error("La venta debe tener al menos un producto.");

    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Validar pagos
  // ---------------------------------

  if (!Array.isArray(payments) || payments.length === 0) {
    const error = new Error("Debe haber al menos un método de pago.");

    error.status = 400;
    throw error;
  }

  const allowedPaymentMethods = ["cash", "card", "transfer"];

  for (const payment of payments) {
    if (!allowedPaymentMethods.includes(payment.method)) {
      const error = new Error(`Método de pago inválido: ${payment.method}`);

      error.status = 400;
      throw error;
    }

    const amount = Number(payment.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      const error = new Error(
        "Los montos de pago deben ser números válidos mayores o iguales a 0.",
      );

      error.status = 400;
      throw error;
    }
  }

  // ---------------------------------
  // Iniciar transacción
  // ---------------------------------

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ---------------------------------
    // Comprobar caja abierta
    // ---------------------------------

    const cashRegister = await CashRegister.findOne({
      status: "open",
    }).session(session);

    if (!cashRegister) {
      const error = new Error(
        "No hay una caja abierta. Debe abrir una caja antes de realizar una venta.",
      );

      error.status = 400;
      throw error;
    }

    // ---------------------------------
    // Procesar productos
    // ---------------------------------

    const { products: processedProducts, total } = await processProducts({
      products,
      session,
    });

    // ---------------------------------
    // Calcular total pagado
    // ---------------------------------

    const totalPaid = payments.reduce(
      (acc, payment) => acc + Number(payment.amount),
      0,
    );

    if (totalPaid < total) {
      const error = new Error("El monto pagado es insuficiente.");

      error.status = 400;
      throw error;
    }

    // ---------------------------------
    // Calcular vuelto
    // ---------------------------------

    let change = 0;

    const cashPayment = payments.find((payment) => payment.method === "cash");

    if (cashPayment) {
      const cashAmount = Number(cashPayment.amount);

      if (cashAmount > total) {
        change = Number((cashAmount - total).toFixed(2));
      }
    }

    // ---------------------------------
    // Descontar stock
    // ---------------------------------

    await decreaseStock(processedProducts, session);

    // ---------------------------------
    // Generar factura
    // ---------------------------------

    const invoiceNumber = generateInvoiceNumber();

    // ---------------------------------
    // Crear Sale
    // ---------------------------------

    const sale = await Sale.create(
      [
        {
          invoiceNumber,
          client,
          employee,
          order: null,
          products: processedProducts,
          total,
          payments,
          status: "completed",
        },
      ],
      {
        session,
      },
    );

    // ---------------------------------
    // Registrar movimientos en caja
    // ---------------------------------

    for (const payment of payments) {
      cashRegister.movements.push({
        type: "sale",
        amount: Number(payment.amount),
        method: payment.method,
        reference: invoiceNumber,
      });
    }

    await cashRegister.save({
      session,
    });

    // ---------------------------------
    // Confirmar transacción
    // ---------------------------------

    await session.commitTransaction();

    return {
      sale: sale[0],
      change,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createSale,
};
