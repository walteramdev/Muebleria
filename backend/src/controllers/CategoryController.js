const Category = require("../models/Category");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    console.log("createCategory recibida en backend - name:", name, "image:", image);

    if (!name) {
      return res.status(400).json({ error: "El nombre de la categoría es obligatorio." });
    }

    const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${escapedName}$`, "i") },
    });

    if (existingCategory) {
      if (existingCategory.isDeleted) {
        console.log("createCategory - Categoría soft-deleted reactivada:", existingCategory);
        existingCategory.isDeleted = false;
        existingCategory.deletedAt = null;
        if (image !== undefined) {
          existingCategory.image = image;
        }
        await existingCategory.save();
        return res.status(201).json({
          message: "Categoría reactivada con éxito.",
          category: existingCategory,
        });
      } else {
        console.log("createCategory - Categoría duplicada activa encontrada:", existingCategory);
        return res.status(400).json({ error: "Ya existe una categoría con ese nombre." });
      }
    }

    const category = await Category.create({
      name: name.trim(),
      image: image || "",
    });

    res.status(201).json({
      message: "Categoría creada con éxito.",
      category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const category = await Category.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada." });
    }

    if (name) {
      const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${escapedName}$`, "i") },
        _id: { $ne: id },
        isDeleted: { $ne: true },
      });
      if (existingCategory) {
        return res.status(400).json({ error: "Ya existe otra categoría con ese nombre." });
      }
      category.name = name.trim();
    }

    if (image !== undefined) {
      category.image = image;
    }

    await category.save();
    res.status(200).json({
      message: "Categoría actualizada con éxito.",
      category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada o ya eliminada." });
    }
    res.status(200).json({ message: "Categoría eliminada con éxito." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
