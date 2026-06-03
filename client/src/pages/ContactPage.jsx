import { useState } from "react";
import "../styles/contact.css";

const ContactPage = () => {
  const contactHeroImage =
    "https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const mailSubject = "Consulta desde la web";
    const mailBody = [
      `Nombre: ${formData.name || "-"}`,
      `Correo: ${formData.email || "-"}`,
      "",
      formData.message || "",
    ].join("\n");

    window.location.href = `yessica.carrizo80@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
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

              <div className="contact-hero-form__row">
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
              </div>

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
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Enviar consulta
                </button>
                <a href="https://wa.me/5491100000000" className="btn-whatsapp">
                  WhatsApp
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
