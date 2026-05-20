const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token =
      req.cookies?.authToken ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "No estás autenticado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.isDeleted) {
      return res.status(401).json({ message: "Usuario no válido." });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

module.exports = verifyToken;
