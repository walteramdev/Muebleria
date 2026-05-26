const express = require("express");
const clientRouter = express.Router();
const clientController = require("../controllers/ClientController");
const { protect } = require("../middleware/authMiddleware");
const adminGuard = require("../middleware/adminGuard");

clientRouter.get("/", protect, adminGuard, clientController.getClients);
clientRouter.get("/:id", protect, clientController.getClientById);

clientRouter.post("/", protect, clientController.createClient);
clientRouter.put("/:id", protect, clientController.updateClient);
clientRouter.delete("/:id", protect, adminGuard, clientController.deleteClient);

clientRouter.put(
  "/:id/activate",
  protect,
  adminGuard,
  clientController.activateClient,
);
clientRouter.put(
  "/:id/deactivate",
  protect,
  adminGuard,
  clientController.deactivateClient,
);
clientRouter.put(
  "/:id/suspend",
  protect,
  adminGuard,
  clientController.suspendClient,
);

module.exports = clientRouter;
