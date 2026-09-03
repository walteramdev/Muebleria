const express = require("express");
const { createSaleController } = require("../controllers/SaleController");

const router = express.Router();

router.post("/", createSaleController);

module.exports = router;

// const express = require("express");
// const saleRouter = express.Router();
// const saleController = require("../controllers/SalesController");
// // const verifytoken = require("../middleware/authMiddleware");

// saleRouter.get("/", saleController.getSales);
// saleRouter.get("/:id", saleController.getSaleById);
// saleRouter.post("/", saleController.createSale);
// saleRouter.put("/:id", saleController.updateSale);
// saleRouter.delete("/:id", saleController.deleteSale);

// module.exports = saleRouter;
