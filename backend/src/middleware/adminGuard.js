const adminGuard = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado." });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminGuard;
