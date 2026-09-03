const express = require("express");

const {
  openCashRegisterController,
  getOpenCashRegisterController,
  closeCashRegisterController,
} = require("../controllers/CashRegisterController");

const router = express.Router();

router.post("/open", openCashRegisterController);
router.get("/open", getOpenCashRegisterController);
router.get("/close", closeCashRegisterController);
module.exports = router;
