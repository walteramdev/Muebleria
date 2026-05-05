import React from "react";
import "../styles/footer.css";

const Footer = ({ variant }) => {
  return (
    <footer className={`env-footer env-footer--${variant}`}>
      <div className="showroom-taller">
        <h3 className="destacado">Showroom y Taller</h3>
        <p className="sub">Chenille - Casa Taller</p>
        <p className="datos">
          Av. San Juan 2847 <br />
          C1232AAB - Barrio de San Cristobal <br />
          Ciudad Autonoma de Buenos Aires, Argentina
        </p>

        <br />

        <p className="sub">Horarios:</p>
        <p className="datos">
          Lunes a Viernes: 10:00 - 19:00 <br />
          Sabados: 10:00 - 14:00
        </p>
      </div>

      <div className="contacto-digital">
        <h3 className="destacado">Contacto Digital</h3>

        <a className="link-web" href="#inicio">
          Sitio Web: www.chenille.com.ar
        </a>

        <p className="datos">Email General: hola@chenille.com.ar</p>
        <p className="datos">Ventas: ventas@chenille.com.ar</p>
        <p className="datos">Instagram: @chenille.muebles</p>
        <p className="datos">WhatsApp: +54 11 4567-8900</p>
      </div>
    </footer>
  );
};

export default Footer;
