const express = require("express");

const {
  createOrderController,
  confirmOrderController,
} = require("../controllers/OrderController");

const router = express.Router();

// Crear pedido desde la web
router.post("/", createOrderController);

// Confirmar pedido después de pago aprobado
router.post("/:orderId/confirm", confirmOrderController);

module.exports = router;
