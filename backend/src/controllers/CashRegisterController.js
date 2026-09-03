const {
  openCashRegister,
  getOpenCashRegister,
  addExpense,
  closeCashRegister,
} = require("../services/cashRegisterService");

/**
 * Abre una nueva caja.
 */
const openCashRegisterController = async (req, res, next) => {
  try {
    const { openingAmount } = req.body;

    const cashRegister = await openCashRegister(openingAmount);

    return res.status(201).json({
      message: "Caja abierta correctamente.",
      cashRegister,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene la caja actualmente abierta.
 */
const getOpenCashRegisterController = async (req, res, next) => {
  try {
    const cashRegister = await getOpenCashRegister();

    if (!cashRegister) {
      return res.status(200).json({
        message: "No hay ninguna caja abierta.",
        cashRegister: null,
      });
    }

    return res.status(200).json({
      cashRegister,
    });
  } catch (error) {
    next(error);
  }
};

const addExpenseController = async (req, res, next) => {
  try {
    const { amount, method, reference } = req.body;

    const cashRegister = await addExpense({
      amount,
      method,
      reference,
    });

    return res.status(201).json({
      message: "Gasto registrado correctamente.",
      cashRegister,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cierra la caja actualmente abierta.
 */
const closeCashRegisterController = async (req, res, next) => {
  try {
    const { closingAmount } = req.body;

    const result = await closeCashRegister(closingAmount);

    return res.status(200).json({
      message: "Caja cerrada correctamente.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  openCashRegisterController,
  getOpenCashRegisterController,
  addExpenseController,
  closeCashRegisterController,
};
