const express = require("express");
const productRouter = express.Router();
const productControler = require("../controllers/productController");
// const verifyToken = require("../middleware/authMiddleware");

productRouter.get("/", productControler.getProducts);
productRouter.get("/:id", productControler.getProductById);

productRouter.post("/", productControler.createProduct);
productRouter.put("/:id", productControler.updateProduct);
productRouter.delete("/:id", productControler.deleteProduct);

module.exports = productRouter;
