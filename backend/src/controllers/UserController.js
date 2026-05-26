const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email inválido" });
    }
    const existUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "El email o nombre ya estan en uso." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "client",
    });
    const savedUser = await newUser.save();

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      isDeleted: false,
    }).select("+password");

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res
      .status(200)
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .json({
        message: "Login Exitoso",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    console.error(error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    // req.user viene del middleware
    res.json({
      message: `Bienvenido al perfil, ${req.user.username}`,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil." });
  }
};

const logoutUser = (req, res) => {
  res
    .clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logout exitoso" });
};
const checkSession = (req, res) => {
  res.json({
    user: req.user,
  });
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Campos permitidos
    const allowedFields = ["username", "email", "password"];
    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key]) {
        updates[key] = req.body[key];
      }
    }

    // Si actualiza password → re-hashear
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      updates,
      { returnDocument: "after" },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

const softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { returnDocument: "after" },
    );

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

const restoreUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const restoredUser = await User.findByIdAndUpdate(
      userId,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { returnDocument: "after" },
    );

    if (!restoredUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario restaurado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al restaurar usuario" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  softDeleteUser,
  restoreUser,
  getUserProfile,
  logoutUser,
  checkSession,
};
