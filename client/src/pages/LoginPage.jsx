import { useState } from "react";
// import { API_CONFIG } from "../config/api.js";
// import "../css/nuevo-producto.css";
function LoginPage({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta servidor:", data);

        onLoginSuccess(data.token);

        alert("Login exitoso");
      } else {
        const errorData = await response.json();
        alert(`${errorData.message}||Error al iniciar sesion`);
      }
    } catch (error) {
      console.error("login error:", error);
      alert(`Error en el login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container-global">
        <div className="container">
          <h1>Iniciar Sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis tenetur veniam possimus delectus deleniti reiciendis,
                nobis modi corporis beatae autem enim maiores officia laborum,
                nemo quis assumenda harum quae asperiores.
              </p>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Ingrese su email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Ingrese su constraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className={`btn ${loading ? "loading" : ""}`}
              id="submitBtn"
              disabled={loading}
            >
              <span>Acceder</span>
              <div className="loading"></div>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
