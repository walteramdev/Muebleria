require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

const userRouter = require("./src/routes/userRoutes");
const productRouter = require("./src/routes/productRoutes");
const clientRouter = require("./src/routes/clientRoutes");

const loggerMiddleware = require("./src/middleware/loggerMiddleware");
const cookieParser = require("cookie-parser");

const puerto = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(loggerMiddleware);
connectDB();

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/clients", clientRouter);

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
