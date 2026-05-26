const express = require("express");
const productRouter = express.Router();
const productControler = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const adminGuard = require("../middleware/adminGuard");

productRouter.get("/", productControler.getProducts);
productRouter.get("/:id", productControler.getProductById);

productRouter.post("/", protect, adminGuard, productControler.createProduct);
productRouter.put("/:id", protect, adminGuard, productControler.updateProduct);
productRouter.delete(
  "/:id",
  protect,
  adminGuard,
  productControler.deleteProduct,
);

module.exports = productRouter;
