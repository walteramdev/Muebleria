const Employee = require("../models/Employee");
const User = require("../models/User");

const createEmployee = async (req, res, next) => {
  try {
    const {
      userId,
      nationalId,
      firstName,
      lastName,
      phone,
      address,
      maritalStatus,
    } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "El userId es obligatorio." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (!user.roles.includes("employee")) {
      return res
        .status(403)
        .json({ message: "El usuario no tiene rol de empleado." });
    }

    const existingEmployee = await Employee.findOne({ user: userId });

    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Este usuario ya está asociado a un empleado." });
    }

    const employee = await Employee.create({
      user: userId,
      nationalId,
      firstName,
      lastName,
      phone,
      address,
      maritalStatus,
    });
    res.status(201).json({ message: "Empleado creado con éxito.", employee });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "El número de documento ya está en uso." });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const idEmployee = req.params.id;
    const { nationalId, firstName, lastName, phone, address, maritalStatus } =
      req.body;

    const updateData = {};
    if (nationalId !== undefined) updateData.nationalId = nationalId;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;

    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: idEmployee, isDeleted: false },
      updateData,
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedEmployee) {
      const error = new Error("Empleado no encontrado para actualizar.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Empleado actualizado con exito",
      empleado: updatedEmployee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "El número de documento ya está en uso." });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(",") });
    }

    console.error("Error al actualizar el empleado.", error.message);
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const idEmployee = req.params.id;
    const deletedEmployee = await Employee.findOneAndUpdate(
      { _id: idEmployee, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!deletedEmployee) {
      const error = new Error("Empleado no encontrado o ya eliminado.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Empleado eliminado con éxito",
      empleado: deletedEmployee,
    });
  } catch (error) {
    console.error("Error al eliminar el empleado:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de empleado inválido." });
    }
    next(error);
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ isDeleted: false }).populate(
      "user",
      "username email role",
    );

    res
      .status(200)
      .json({ message: "Empleados recuperados con exito.", employees });
  } catch (error) {
    console.error("Error al obtener empleados:", error.message);
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("user", "username email role");

    if (!employee) {
      const error = new Error("Empleado no encontrado.");
      error.status = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ message: "Empleado recuperado con éxito.", employee });
  } catch (error) {
    console.error("Error al obtener el empleado por ID:", error.message);

    if (error.name === "CastError") {
      error.status = 400;
    }

    next(error);
  }
};

const activateEmployee = async (req, res, next) => {
  try {
    const idEmployee = req.params.id;
    const activatedEmployee = await Employee.findOneAndUpdate(
      { _id: idEmployee, isDeleted: false, status: { $ne: "active" } },
      { status: "active", statusChangedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!activatedEmployee) {
      const error = new Error("Empleado no encontrado o ya activado.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Empleado activado con éxito",
      empleado: activatedEmployee,
    });
  } catch (error) {
    console.error("Error al activar el empleado:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de empleado inválido." });
    }
    next(error);
  }
};
// check funcion combinada
const deactivateEmployee = async (req, res, next) => {
  try {
    const idEmployee = req.params.id;
    const deactivatedEmployee = await Employee.findOneAndUpdate(
      { _id: idEmployee, isDeleted: false, status: { $ne: "inactive" } },
      { status: "inactive", statusChangedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!deactivatedEmployee) {
      const error = new Error("Empleado no encontrado o ya desactivado.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Empleado desactivado con éxito",
      empleado: deactivatedEmployee,
    });
  } catch (error) {
    console.error("Error al desactivar el empleado:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de empleado inválido." });
    }
    next(error);
  }
};

const suspendEmployee = async (req, res, next) => {
  try {
    const idEmployee = req.params.id;
    const suspendedEmployee = await Employee.findOneAndUpdate(
      { _id: idEmployee, isDeleted: false, status: { $ne: "suspended" } },
      { status: "suspended", statusChangedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!suspendedEmployee) {
      const error = new Error("Empleado no encontrado o ya suspendido.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Empleado suspendido con éxito",
      empleado: suspendedEmployee,
    });
  } catch (error) {
    console.error("Error al suspender el empleado:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de empleado inválido." });
    }
    next(error);
  }
};

module.exports = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  activateEmployee,
  deactivateEmployee,
  suspendEmployee,
};

// const changeEmployeeStatus = async (req, res, next) => {
//   try {
//     const { status } = req.body;

//     const allowedStatuses = ["active", "inactive", "suspended"];

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({ message: "Estado inválido." });
//     }

//     const employee = await Employee.findOneAndUpdate(
//       { _id: req.params.id, isDeleted: false },
//       { status, statusChangedAt: new Date() },
//       { returnDocument: "after" }
//     );

//     if (!employee) {
//       return res.status(404).json({ message: "Empleado no encontrado." });
//     }

//     res.status(200).json({
//       message: "Estado actualizado correctamente.",
//       employee,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
