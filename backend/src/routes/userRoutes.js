const express = require("express");
const usersRouter = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

usersRouter.post("/register", userController.registerUser);
usersRouter.post("/login", userController.loginUser);
usersRouter.post("/logout", userController.logoutUser);

usersRouter.get("/profile", verifyToken, userController.getUserProfile);
usersRouter.get("/check-session", verifyToken, userController.checkSession);

usersRouter.put("/:id", verifyToken, userController.updateUser);
usersRouter.delete("/:id", verifyToken, userController.softDeleteUser);
usersRouter.patch(
  "/:id/restore",
  verifyToken,

  userController.restoreUser,
); //adminguard
module.exports = usersRouter;
