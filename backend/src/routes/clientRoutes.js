const express = require("express");
const clientRouter = express.Router();
const clientController = require("../controllers/ClientController");
const verifyToken = require("../middleware/authMiddleware");
const adminGuard = require("../middleware/adminGuard");

clientRouter.get("/", verifyToken, adminGuard, clientController.getClients);
clientRouter.get("/:id", verifyToken, clientController.getClientById);

clientRouter.post("/", verifyToken, clientController.createClient);
clientRouter.put("/:id", verifyToken, clientController.updateClient);
clientRouter.delete(
  "/:id",
  verifyToken,
  adminGuard,
  clientController.deleteClient,
);

clientRouter.put(
  "/:id/activate",
  verifyToken,
  adminGuard,
  clientController.activateClient,
);
clientRouter.put(
  "/:id/deactivate",
  verifyToken,
  adminGuard,
  clientController.deactivateClient,
);
clientRouter.put(
  "/:id/suspend",
  verifyToken,
  adminGuard,
  clientController.suspendClient,
);

module.exports = clientRouter;
