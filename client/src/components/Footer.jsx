import "../css/footer.css";

const Footer = ({ variant = "default" }) => {
  return (
    <footer className={`env-footer env-footer--${variant}`}>
      <div className="env-footer__grid">
        <div className="env-footer__brand">
          <p className="env-footer__logo">CHENILLE</p>
          <p className="env-footer__copy">
            Muebles pensados para habitar con calma. La Rioja, Argentina.
          </p>
          <div className="env-footer__socials" aria-label="Redes sociales">
            <a
              className="env-footer__social-link"
              href="https://instagram.com/chenille.muebles"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de Chenille"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect
                  x="3.25"
                  y="3.25"
                  width="17.5"
                  height="17.5"
                  rx="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="17.3" cy="6.8" r="1.15" fill="currentColor" />
              </svg>
            </a>
            <a
              className="env-footer__social-link"
              href="https://wa.me/541145678900"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp de Chenille"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M12 3.2a8.52 8.52 0 0 0-7.4 12.74L3.4 20.8l5-1.17A8.53 8.53 0 1 0 12 3.2Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.07 8.84c-.22-.5-.46-.5-.67-.51h-.57c-.2 0-.52.08-.8.38-.27.3-1.05 1.03-1.05 2.52s1.08 2.92 1.23 3.12c.15.2 2.08 3.32 5.13 4.52 2.52.99 3.04.8 3.59.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.47-2.39-1.5-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.7-.95-2.28Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>

        <nav className="env-footer__nav" aria-label="Navegacion del footer">
          <p className="env-footer__label">Navegación</p>
          <a href="/#inicio">Inicio</a>
          <a href="/#destacados">Destacados</a>
          <a href="/productos">Productos</a>
          <a href="/nosotros">Nosotros</a>
          <a href="/contacto">Contacto</a>
        </nav>

        <div className="env-footer__contact">
          <p className="env-footer__label">Contacto</p>
          <p>Email: hola@chenille.com.ar</p>
          <p>Dirección: Av. San Juan 2847, CABA</p>
          <p>Horario: Lun–Vie 10:00–19:00 · Sáb 10:00–14:00</p>
        </div>
      </div>

      <div className="env-footer__bottom">
        <p>© 2026 Chenille. Todos los derechos reservados.</p>
        <p>Diseño artesanal, La Rioja</p>
      </div>
    </footer>
  );
};

export default Footer;
