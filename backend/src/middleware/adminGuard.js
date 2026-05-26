const adminGuard = (req, res, next) => {
  // Cambiado de req.usuario a req.user para coincidir con authMiddleware
  if (req.user && req.user.rol && req.user.rol.includes("admin")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
};

module.exports = adminGuard;
