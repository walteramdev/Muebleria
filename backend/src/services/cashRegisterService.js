const mongoose = require("mongoose");
const CashRegister = require("../models/CashRegister");

/**
 * Abre una nueva caja.
 *
 * Solo puede existir una caja abierta
 * al mismo tiempo.
 */
const openCashRegister = async (openingAmount) => {
  // ---------------------------------
  // Validar monto inicial
  // ---------------------------------

  const amount = Number(openingAmount);

  if (!Number.isFinite(amount) || amount < 0) {
    const error = new Error(
      "El monto inicial de la caja debe ser un número mayor o igual a 0.",
    );

    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Comprobar si ya existe una caja abierta
  // ---------------------------------

  const existingCashRegister = await CashRegister.findOne({
    status: "open",
  });

  if (existingCashRegister) {
    const error = new Error(
      "Ya existe una caja abierta. Debe cerrarla antes de abrir una nueva.",
    );

    error.status = 409;
    throw error;
  }

  // ---------------------------------
  // Crear caja
  // ---------------------------------

  const cashRegister = await CashRegister.create({
    openingAmount: amount,
    status: "open",
    movements: [],
  });

  return cashRegister;
};
/**
 * Obtiene la caja actualmente abierta.
 */
const getOpenCashRegister = async () => {
  const cashRegister = await CashRegister.findOne({
    status: "open",
  });

  return cashRegister;
};

const addExpense = async ({ amount, method, reference = "" }) => {
  const expenseAmount = Number(amount);

  // ---------------------------------
  // Validar monto
  // ---------------------------------

  if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
    const error = new Error("El monto del gasto debe ser un número mayor a 0.");

    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Validar método
  // ---------------------------------

  const allowedPaymentMethods = ["cash", "card", "transfer"];

  if (!allowedPaymentMethods.includes(method)) {
    const error = new Error("Método de pago inválido.");

    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Buscar caja abierta
  // ---------------------------------

  const cashRegister = await CashRegister.findOne({
    status: "open",
  });

  if (!cashRegister) {
    const error = new Error(
      "No hay ninguna caja abierta para registrar el gasto.",
    );

    error.status = 404;
    throw error;
  }

  // ---------------------------------
  // Registrar movimiento
  // ---------------------------------

  cashRegister.movements.push({
    type: "expense",
    amount: Number(expenseAmount.toFixed(2)),
    method,
    reference: reference.trim(),
  });

  await cashRegister.save();

  return cashRegister;
};

/**
 * Cierra la caja actualmente abierta.
 *
 * closingAmount representa el dinero contado
 * físicamente al momento del cierre.
 */

const closeCashRegister = async (closingAmount) => {
  // ---------------------------------
  // Validar monto de cierre
  // ---------------------------------

  const amount = Number(closingAmount);

  if (!Number.isFinite(amount) || amount < 0) {
    const error = new Error(
      "El monto de cierre debe ser un número mayor o igual a 0.",
    );

    error.status = 400;
    throw error;
  }

  // ---------------------------------
  // Buscar caja abierta
  // ---------------------------------

  const cashRegister = await CashRegister.findOne({
    status: "open",
  });

  if (!cashRegister) {
    const error = new Error("No hay ninguna caja abierta para cerrar.");

    error.status = 404;
    throw error;
  }

  // ---------------------------------
  // Calcular monto esperado
  // ---------------------------------

  let expectedAmount = Number(cashRegister.openingAmount);

  for (const movement of cashRegister.movements) {
    const movementAmount = Number(movement.amount);

    if (movement.method !== "cash") {
      continue;
    }

    if (movement.type === "sale") {
      expectedAmount += movementAmount;
    }

    if (movement.type === "expense") {
      expectedAmount -= movementAmount;
    }
  }

  expectedAmount = Number(expectedAmount.toFixed(2));

  // ---------------------------------
  // Calcular diferencia
  // ---------------------------------

  const difference = Number((amount - expectedAmount).toFixed(2));

  // ---------------------------------
  // Actualizar caja
  // ---------------------------------

  cashRegister.closingAmount = amount;
  cashRegister.status = "closed";

  await cashRegister.save();

  return {
    cashRegister,
    expectedAmount,
    difference,
  };
};
module.exports = {
  openCashRegister,
  getOpenCashRegister,
  addExpense,
  closeCashRegister,
};
