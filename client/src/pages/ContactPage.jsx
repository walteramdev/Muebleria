import { useState } from "react";
import { API_BASE_URL } from "../config";
import "../styles/contact.css";

const ContactPage = () => {
  const contactHeroImage =
    "https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/contact/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      setStatus("success");
      setFormData({ name: "", message: "" });
    } catch (error) {
      console.error("Error al enviar consulta:", error);
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  const generateWhatsAppUrl = () => {
    let text = "¡Hola! Me gustaría hacer una consulta.";
    if (formData.name || formData.message) {
      text = `¡Hola! Mi nombre es ${formData.name || "..."}.\n\nMi consulta es: ${formData.message || "..."}`;
    }
    return `https://wa.me/5493804660709?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className="info-page info-page--contact" style={{ paddingBottom: 0 }}>
      <section className="editorial-page-hero editorial-page-hero--contact">
        <div className="editorial-page-hero__media">
          <img src={contactHeroImage} alt="Interior calido y sereno" />
        </div>
        <div className="editorial-page-hero__overlay editorial-page-hero__overlay--soft" />
        <div className="editorial-page-hero__content editorial-page-hero__content--contact">
          <div className="contact-hero-header">
            <p className="eyebrow eyebrow--light">Contacto</p>
            <h1>Contanos que estas buscando</h1>
          </div>

          <div className="contact-hero-body">
            <div className="contact-hero-sidebar">
              <p className="page-hero__text page-hero__text--light">
                Si queres consultar por medidas, disponibilidad o terminaciones,
                dejanos tu mensaje por correo o whatsapp.
              </p>
            </div>

            <form className="contact-hero-form" onSubmit={handleSubmit}>
              <p className="contact-hero-form__eyebrow">Consulta directa</p>

              <label className="contact-hero-form__field">
                <span>Nombre</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
              </label>

              <label className="contact-hero-form__field">
                <span>Mensaje</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Contanos que necesitas"
                  required
                />
              </label>

              <div className="contact-hero-form__actions">
                <button type="submit" className="btn-primary" disabled={status === "loading"}>
                  {status === "loading" ? "Enviando..." : "Enviar consulta"}
                </button>
                <a href={generateWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                  WhatsApp
                </a>
              </div>
              
              {status === "success" && (
                <p style={{ color: "#4caf50", marginTop: "16px", fontWeight: "600", fontSize: "0.95rem", textAlign: "center" }}>
                  ¡Tu consulta fue enviada con éxito! Te contactaremos pronto.
                </p>
              )}
              {status === "error" && (
                <p style={{ color: "#c95d4e", marginTop: "16px", fontWeight: "600", fontSize: "0.95rem", textAlign: "center" }}>
                  No se pudo enviar: {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
