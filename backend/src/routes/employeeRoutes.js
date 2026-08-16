const express = require("express");
const employeeRouter = express.Router();
const employeeController = require("../controllers/EmployeeController");
// const {protect} = require("../middleware/authMiddleware");

employeeRouter.get("/", employeeController.getEmployees);
employeeRouter.get("/:id", employeeController.getEmployeeById);

employeeRouter.post("/", employeeController.createEmployee);
employeeRouter.put("/:id", employeeController.updateEmployee);
employeeRouter.delete("/:id", employeeController.deleteEmployee);

employeeRouter.put("/:id/activate", employeeController.activateEmployee);
employeeRouter.put("/:id/deactivate", employeeController.deactivateEmployee);
employeeRouter.put("/:id/suspend", employeeController.suspendEmployee);

module.exports = employeeRouter;
