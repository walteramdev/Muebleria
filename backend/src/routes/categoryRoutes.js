const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/CategoryController");

const { protect } = require("../middleware/authMiddleware");
const adminGuard = require("../middleware/adminGuard");

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.post("/", protect, adminGuard, categoryController.createCategory);
categoryRouter.put("/:id", protect, adminGuard, categoryController.updateCategory);
categoryRouter.delete("/:id", protect, adminGuard, categoryController.deleteCategory);

module.exports = categoryRouter;
