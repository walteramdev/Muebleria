const express = require("express");
const usersRouter = express.Router();
const userController = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

usersRouter.post("/register", userController.registerUser);
usersRouter.post("/login", userController.loginUser);
usersRouter.post("/logout", userController.logoutUser);

// usersRouter.get("/profile", protect, userController.getUserProfile);
// usersRouter.get("/check-session", protect, userController.checkSession);

// usersRouter.put("/:id", protect, userController.updateUser);
// usersRouter.delete("/:id", protect, userController.softDeleteUser);
// usersRouter.patch(
//   "/:id/restore",
//   protect,
//   userController.restoreUser,
// ); //adminguard
module.exports = usersRouter;
