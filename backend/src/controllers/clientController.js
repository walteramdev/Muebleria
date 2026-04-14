const Client = require("../models/Client");
const User = require("../models/User");
const createClient = async (req, res, next) => {
  try {
    const { nationalId, firstName, lastName, phone, address, notes } = req.body;

    if (!nationalId || !firstName || !lastName || !phone || !address) {
      return res
        .status(400)
        .json({ message: "Todos los campos obligatorios deben completarse." });
    }

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const existingClient = await Client.findOne({ user: userId });
    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Este usuario ya tiene un perfil de cliente." });
    }

    const client = await Client.create({
      user: userId,
      nationalId,
      firstName,
      lastName,
      phone,
      address,
      notes,
    });

    res.status(201).json({
      message: "Cliente creado con éxito.",
      client,
    });
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

const updateClient = async (req, res, next) => {
  try {
    const idClient = req.params.id;
    const { nationalId, firstName, lastName, phone, address, notes } = req.body;

    if (req.user.role !== "admin" && client.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }
    const updateData = {};
    if (nationalId) updateData.nationalId = nationalId;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (notes) updateData.notes = notes;

    const updatedClient = await Client.ffindOneAndUpdate(
      { _id: idClient, isDeleted: false },
      updateData,
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedClient) {
      const error = new Error("Cliente no encontrado para actualizar.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Cliente actualizado con exito",
      Cliente: updatedClient,
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

    console.error("Error al actualizar el cliente.", error.message);
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const idClient = req.params.id;
    const deletedClient = await Client.findOneAndUpdate(
      { _id: idClient, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!deletedClient) {
      const error = new Error("Cliente no encontrado o ya eliminado.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Cliente eliminado con éxito",
      Cliente: deletedClient,
    });
  } catch (error) {
    console.error("Error al eliminar el Cliente:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de Cliente inválido." });
    }
    next(error);
  }
};

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ isDeleted: false }).populate(
      "user",
      "username email",
    );

    res
      .status(200)
      .json({ message: "Clientes recuperados con exito.", clients });
  } catch (error) {
    console.error("Error al obtener Clientes:", error.message);
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!client) {
      const error = new Error("Cliente no encontrado.");
      error.status = 404;
      return next(error);
    }

    if (req.user.role !== "admin" && client.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    res.status(200).json({ message: "Cliente recuperado con éxito.", client });
  } catch (error) {
    console.error("Error al obtener el cliente por ID:", error.message);

    if (error.name === "CastError") {
      error.status = 400;
    }

    next(error);
  }
};

const activateClient = async (req, res, next) => {
  try {
    const idClient = req.params.id;
    const activatedClient = await Client.findOneAndUpdate(
      { _id: idClient, isDeleted: false, status: { $ne: "active" } },
      { status: "active", statusChangedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!activatedClient) {
      const error = new Error("Cliente no encontrado o ya activado.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Cliente activado con éxito",
      Cliente: activatedClient,
    });
  } catch (error) {
    console.error("Error al activar el cliente:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de cliente inválido." });
    }
    next(error);
  }
};

const deactivateClient = async (req, res, next) => {
  try {
    const idClient = req.params.id;
    const deactivatedClient = await Client.findOneAndUpdate(
      { _id: idClient, isDeleted: false, status: { $ne: "inactive" } },
      { status: "inactive", statusChangedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!deactivatedClient) {
      const error = new Error("Cliente no encontrado o ya desactivado.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Cliente desactivado con éxito",
      Cliente: deactivatedClient,
    });
  } catch (error) {
    console.error("Error al desactivar el cliente:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de cliente inválido." });
    }
    next(error);
  }
};

const suspendClient = async (req, res, next) => {
  try {
    const idClient = req.params.id;
    const suspendedClient = await Client.findOneAndUpdate(
      { _id: idClient, isDeleted: false, status: { $ne: "suspended" } },
      { status: "suspended", statusChangedAt: new Date() },
      { returnDocument: "after" },
    );
    if (!suspendedClient) {
      const error = new Error("Cliente no encontrado o ya suspendido.");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Cliente suspendido con éxito",
      Cliente: suspendedClient,
    });
  } catch (error) {
    console.error("Error al suspender el cliente:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de cliente inválido." });
    }
    next(error);
  }
};

module.exports = {
  createClient,
  updateClient,
  deleteClient,
  getClients,
  getClientById,
  activateClient,
  deactivateClient,
  suspendClient,
};
