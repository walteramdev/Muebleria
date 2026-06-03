const adminGuard = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.includes("admin")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
};


module.exports = adminGuard;