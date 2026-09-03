const { createSale } = require("../services/saleService");

const createSaleController = async (req, res, next) => {
  try {
    const { client, employee, products, payments } = req.body;

    const result = await createSale({
      client,
      employee,
      products,
      payments,
    });

    return res.status(201).json({
      message: "Venta realizada con éxito.",
      sale: result.sale,
      change: result.change,
    });
  } catch (error) {
    console.error("Error al crear la venta:", error);

    next(error);
  }
};

module.exports = {
  createSaleController,
};

// const Sale = require("../models/Sale");
// const Product = require("../models/Product");
// const CashRegister = require("../models/CashRegister");

// const createSale = async (req, res, next) => {
//   try {
//     const { client, employee, products, payments } = req.body;

//     if (!products || !Array.isArray(products) || products.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "La venta debe tener al menos un producto." });
//     }

//     if (!employee) {
//       return res
//         .status(400)
//         .json({ message: "La venta debe tener un empleado." });
//     }

//     if (!payments || !Array.isArray(payments) || payments.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Debe haber al menos un método de pago." });
//     }

//     const invoiceNumber = `FAC-${Date.now()}`;
//     let total = 0;
//     const processedProducts = [];

//     for (const item of products) {
//       const {
//         product: productId,
//         quantity,
//         discount = 0,
//         discountType = "fixed",
//       } = item;

//       const qty = Number(quantity);
//       const disc = Number(discount);

//       if (!productId || isNaN(qty) || qty <= 0) {
//         return res
//           .status(400)
//           .json({ message: "Producto o cantidad inválida." });
//       }

//       const productDB = await Product.findById(productId);

//       if (!productDB) {
//         return res
//           .status(404)
//           .json({ message: `Producto no encontrado: ${productId}` });
//       }

//       if (productDB.stock < qty) {
//         return res
//           .status(400)
//           .json({ message: `Stock insuficiente para ${productDB.name}` });
//       }

//       const price = Number(productDB.price);
//       if (isNaN(price)) {
//         return res
//           .status(500)
//           .json({ message: "Error en el precio del producto." });
//       }

//       let subtotal =
//         discountType === "percentage"
//           ? price * qty * (1 - disc / 100)
//           : price * qty - disc;

//       if (isNaN(subtotal)) {
//         return res.status(500).json({ message: "Error al calcular subtotal." });
//       }

//       if (subtotal < 0) subtotal = 0;

//       total += subtotal;

//       processedProducts.push({
//         product: productDB._id,
//         name: productDB.name,
//         brand: productDB.brand || "",
//         quantity: qty,
//         price,
//         discount: disc,
//         discountType,
//         subtotal,
//       });

//       productDB.stock -= qty;
//       await productDB.save();
//     }

//     if (isNaN(total)) {
//       return res.status(500).json({ message: "Error al calcular total." });
//     }

//     if (
//       payments.some(
//         (p) =>
//           p.amount === undefined ||
//           p.amount === null ||
//           isNaN(Number(p.amount)) ||
//           Number(p.amount) < 0,
//       )
//     ) {
//       return res.status(400).json({ message: "Montos de pago inválidos." });
//     }

//     const totalPaid = payments.reduce(
//       (acc, p) => acc + Number(p.amount || 0),
//       0,
//     );

//     if (totalPaid < total) {
//       return res
//         .status(400)
//         .json({ message: "El monto pagado es insuficiente." });
//     }

//     let change = 0;
//     const cashPayment = payments.find((p) => p.method === "cash");

//     if (cashPayment) {
//       const cashAmount = Number(cashPayment.amount);
//       if (cashAmount > total) {
//         change = cashAmount - total;
//       }
//     }

//     const sale = await Sale.create({
//       invoiceNumber,
//       client: client || null,
//       employee,
//       products: processedProducts,
//       total,
//       payments,
//       change,
//     });

//     const cashRegister = await CashRegister.findOne({ status: "open" });

//     if (cashRegister) {
//       payments.forEach((p) => {
//         cashRegister.movements.push({
//           type: "sale",
//           amount: Number(p.amount),
//           method: p.method,
//           reference: invoiceNumber,
//         });
//       });
//       await cashRegister.save();
//     }

//     return res
//       .status(201)
//       .json({ message: "Venta realizada con éxito.", sale });
//   } catch (error) {
//     console.error("Error al crear la venta:", error);

//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "ID inválido en la venta." });
//     }

//     next(error);
//   }
// };

// const getSales = async (req, res, next) => {
//   try {
//     const sales = await Sale.find({ status: "completed" }).sort({
//       createdAt: -1,
//     });
//     return res.status(200).json({ sales });
//   } catch (error) {
//     next(error);
//   }
// };

// const getSaleById = async (req, res, next) => {
//   try {
//     const sale = await Sale.findById(req.params.id);

//     if (!sale) {
//       const error = new Error("Venta no encontrada.");
//       error.status = 404;
//       return next(error);
//     }

//     return res.status(200).json({ sale });
//   } catch (error) {
//     if (error.name === "CastError") {
//       error.status = 400;
//     }
//     next(error);
//   }
// };

// const updateSale = async (req, res, next) => {
//   try {
//     const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!sale) {
//       const error = new Error("Venta no encontrada para actualizar.");
//       error.status = 404;
//       return next(error);
//     }

//     return res
//       .status(200)
//       .json({ message: "Venta actualizada con éxito.", sale });
//   } catch (error) {
//     if (error.name === "CastError") {
//       error.status = 400;
//     }
//     next(error);
//   }
// };

// const deleteSale = async (req, res, next) => {
//   try {
//     const sale = await Sale.findByIdAndDelete(req.params.id);

//     if (!sale) {
//       const error = new Error("Venta no encontrada para eliminar.");
//       error.status = 404;
//       return next(error);
//     }

//     return res
//       .status(200)
//       .json({ message: "Venta eliminada con éxito.", sale });
//   } catch (error) {
//     if (error.name === "CastError") {
//       error.status = 400;
//     }
//     next(error);
//   }
// };

// module.exports = {
//   createSale,
//   getSales,
//   getSaleById,
//   updateSale,
//   deleteSale,
// };
