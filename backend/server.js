require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

const userRouter = require("./src/routes/userRoutes");
const productRouter = require("./src/routes/productRoutes");
const clientRouter = require("./src/routes/clientRoutes");
const categoryRouter = require("./src/routes/categoryRoutes");

const loggerMiddleware = require("./src/middleware/loggerMiddleware");
const cookieParser = require("cookie-parser");

const puerto = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir cualquier origen dinámicamente en desarrollo para móviles
      callback(null, true);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(loggerMiddleware);

const seedCategories = async () => {
  try {
    const Category = require("./src/models/Category");
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log("🌱 Sembrando categorías por defecto...");
      const defaultCategories = [
        {
          name: "Outdoor",
          image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
        },
        {
          name: "Living",
          image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
        },
        {
          name: "Sofás",
          image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
        },
        {
          name: "Comedor",
          image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80",
        },
        {
          name: "Dormitorio",
          image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
        },
      ];
      await Category.insertMany(defaultCategories);
      console.log("✅ Categorías sembradas correctamente.");
    }
  } catch (err) {
    console.error("❌ Error al sembrar categorías:", err.message);
  }
};

connectDB().then(() => {
  seedCategories();
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/clients", clientRouter);
app.use("/api/categories", categoryRouter);

// Manejo centralizado para rutas inexistentes.
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Middleware de manejo de errores: uniforma estructura de respuesta y loguea detalles.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error de servidor.";
  console.error({ statusCode, message, stack: err.stack });
  res.status(statusCode).json({ error: message });
});

app.listen(puerto, () => {
  console.log("El servidor esta corriendo en el puerto", puerto);
});
