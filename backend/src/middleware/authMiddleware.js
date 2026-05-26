const { Router } = require("express");
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const token =
      req.cookies?.authToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No estás autenticado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
// Exporto como objeto para la desestructuracion en el Router
module.exports = { protect };
