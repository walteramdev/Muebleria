import React, { useEffect, useState } from "react";
import "../styles/SalesPage.css";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  const [payments, setPayments] = useState([{ method: "cash", amount: "" }]);

  // ==============================
  // FETCH INICIAL
  // ==============================

  useEffect(() => {
    fetchProducts();
    fetchEmployees();
    fetchClients();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        credentials: "include",
      });
      const data = await res.json();

      const filtered = data.products.filter(
        (item) => !item.isDeleted && item.stock > 0,
      );

      setProducts(filtered);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        credentials: "include",
      });
      const data = await res.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/clients", {
        credentials: "include",
      });
      const data = await res.json();
      setClients(data.clients);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  // ==============================
  // FILTRO PRODUCTOS
  // ==============================

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ==============================
  // CARRITO
  // ==============================

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        if (existing.quantity + 1 > product.stock) return prev;

        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, qty) => {
    const quantity = Number(qty);
    if (quantity <= 0) return;

    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item)),
    );
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ==============================
  // PAGOS
  // ==============================

  const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const cashPayment = payments.find((p) => p.method === "cash");

  const change =
    cashPayment && Number(cashPayment.amount) > total
      ? Number(cashPayment.amount) - total
      : 0;

  const addPayment = () => {
    setPayments([...payments, { method: "cash", amount: "" }]);
  };

  const updatePayment = (index, field, value) => {
    const updated = [...payments];
    updated[index][field] = value;
    setPayments(updated);
  };

  const removePayment = (index) => {
    if (payments.length === 1) return;
    const updated = payments.filter((_, i) => i !== index);
    setPayments(updated);
  };

  // ==============================
  // CONFIRMAR VENTA
  // ==============================

  const handleConfirmSale = async () => {
    try {
      if (cart.length === 0) {
        alert("No hay productos en la venta");
        return;
      }

      if (!selectedEmployee) {
        alert("Debes seleccionar un empleado");
        return;
      }

      if (totalPaid < total) {
        alert("El monto pagado es insuficiente");
        return;
      }

      setLoading(true);

      const body = {
        employee: selectedEmployee,
        client: selectedClient || null,
        products: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        payments: payments.map((p) => ({
          method: p.method,
          amount: Number(p.amount),
        })),
      };

      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      alert("Venta realizada con éxito");

      // Reset
      setCart([]);
      setPayments([{ method: "cash", amount: "" }]);
      setSelectedClient("");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al realizar la venta");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <div className="sales-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sales-content">
        <div className="products-list">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="product-item"
              onClick={() => addToCart(product)}
            >
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              <small>Stock: {product.stock}</small>
            </div>
          ))}
        </div>

        <div className="cart">
          <h3>Venta</h3>

          {/* Empleado */}
          <label>Empleado:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Seleccionar empleado</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>

          {/* Cliente */}
          <label>Cliente:</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Consumidor final</option>
            {clients.map((cli) => (
              <option key={cli._id} value={cli._id}>
                {cli.firstName} {cli.lastName}
              </option>
            ))}
          </select>

          {/* Productos */}
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <span>{item.name}</span>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item._id, e.target.value)}
              />

              <span>${item.price * item.quantity}</span>

              <button onClick={() => removeFromCart(item._id)}>❌</button>
            </div>
          ))}

          <h2>Total: ${total}</h2>

          {/* PAGOS */}
          <h3>Pagos</h3>

          {payments.map((p, index) => (
            <div key={index} className="payment-row">
              <select
                value={p.method}
                onChange={(e) => updatePayment(index, "method", e.target.value)}
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
              </select>

              <input
                type="number"
                placeholder="Monto"
                value={p.amount}
                onChange={(e) => updatePayment(index, "amount", e.target.value)}
              />

              <button onClick={() => removePayment(index)}>❌</button>
            </div>
          ))}

          <button onClick={addPayment}>+ Agregar pago</button>

          <h3>Total pagado: ${totalPaid}</h3>
          <h3>Cambio: ${change}</h3>

          <button
            className="btn-confirm"
            onClick={handleConfirmSale}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar Venta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
