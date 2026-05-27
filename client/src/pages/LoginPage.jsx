import { useState } from "react";

function LoginPage({ onLoginSuccess }) {
  const loginHeroImage =
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data.token);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Credenciales incorrectas o error al iniciar sesión.");
      }
    } catch (err) {
      console.error("login error:", err);
      setError(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    const bgImage = "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600";
    return (
      <main className="info-page info-page--brand" style={{ paddingBottom: 0 }}>
        <section className="editorial-page-hero">
          <div className="editorial-page-hero__media" style={{ filter: 'grayscale(100%) brightness(0.4)' }}>
            <img src={bgImage} alt="Fondo de estado" />
          </div>
          <div className="editorial-page-hero__overlay editorial-page-hero__overlay--soft" />
          
          <div className="editorial-page-hero__content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 0, margin: '0 auto', maxWidth: 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFF8F2', margin: '0 0 16px' }}>No pudimos conectar</h2>
            <p style={{ color: 'rgba(255, 248, 242, 0.8)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '500px' }}>{error}</p>
            <button type="button" className="btn-primary" onClick={() => setError(null)}>
              Intentar nuevamente
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="info-page info-page--contact" style={{ paddingBottom: 0 }}>
      <section className="editorial-page-hero editorial-page-hero--contact">
        <div className="editorial-page-hero__media">
          <img src={loginHeroImage} alt="Interior elegante" />
        </div>
        <div className="editorial-page-hero__overlay editorial-page-hero__overlay--soft" />
        <div 
          className="editorial-page-hero__content"
          style={{
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "none",
            width: "100%",
            margin: "0 auto"
          }}
        >
          <form 
            className="contact-hero-form" 
            onSubmit={handleSubmit}
            style={{ width: "min(100%, 420px)", margin: 0 }}
          >
            <p className="contact-hero-form__eyebrow" style={{ textAlign: "center", marginBottom: "16px" }}>
              Iniciar sesión
            </p>

            <label className="contact-hero-form__field">
              <span>Correo</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tuemail@ejemplo.com"
                required
              />
            </label>

            <label className="contact-hero-form__field">
              <span>Contraseña</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                required
              />
            </label>

            <button
              type="submit"
              className="btn-primary contact-hero-form__submit"
              disabled={loading}
              style={{ marginTop: "10px" }}
            >
              {loading ? "Cargando..." : "Acceder"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
