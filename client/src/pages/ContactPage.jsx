import { useState } from "react";
import Footer from "../components/Footer";

const ContactPage = () => {
  const contactHeroImage =
    "https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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

    const mailSubject = formData.subject || "Consulta desde la web";
    const mailBody = [
      `Nombre: ${formData.name || "-"}`,
      `Correo: ${formData.email || "-"}`,
      "",
      formData.message || "",
    ].join("\n");

    window.location.href = `yessica.carrizo80@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  };

  return (
    <main className="info-page info-page--contact">
      <section className="editorial-page-hero editorial-page-hero--contact">
        <div className="editorial-page-hero__media">
          <img src={contactHeroImage} alt="Interior calido y sereno" />
        </div>
        <div className="editorial-page-hero__overlay editorial-page-hero__overlay--soft" />
        <div className="editorial-page-hero__content editorial-page-hero__content--contact">
          <div className="contact-hero-copy">
            <p className="eyebrow eyebrow--light">Contacto</p>
            <h1>Contanos que estas buscando y te respondemos con calma.</h1>
            <p className="page-hero__text page-hero__text--light">
              Si queres consultar por medidas, disponibilidad o terminaciones,
              dejanos tu mensaje y seguimos la conversacion por correo.
            </p>
            <div className="editorial-page-hero__actions">
              <a className="btn-primary" href="https://wa.me/5491100000000">
                WhatsApp
              </a>
            </div>
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
              <span>Asunto</span>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Consulta por una pieza o ambiente"
                required
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

            <button type="submit" className="btn-primary contact-hero-form__submit">
              Enviar consulta
            </button>
          </form>
        </div>
      </section>

      <section className="contact-footer-screen">
        <Footer variant="immersive" />
      </section>
    </main>
  );
};

export default ContactPage;
