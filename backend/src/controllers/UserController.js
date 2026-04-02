const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, roles } = req.body;
    const existUSer = await Usuario.findOne({ $or: [{ email }, { username }] });
    if (existUSer) {
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
      roles,
    });
    const savedUser = await newUser.save();

    res.status(201).json({
      _id: savedUSer._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales invalidas." });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Credenciales invalidas." });
    }

    const token = jwt.sign(
      { id: user._id, username: suer.username, rol: user.roles },
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
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
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
  // verifyToken ya cargó el usuario en req.user
  res.json({
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  checkSession,
};
