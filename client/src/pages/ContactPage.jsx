const ContactPage = () => {
  return (
    <main className="info-page">
      <section className="page-hero">
        <p className="eyebrow">Contacto</p>
        <h1>Estamos para ayudarte a encontrar la pieza indicada.</h1>
        <p className="page-hero__text">
          Si queres consultar por un producto, medidas, disponibilidad o
          terminaciones, podes escribirnos y seguimos la conversacion por el
          canal que te resulte mas comodo.
        </p>
      </section>

      <section className="info-section info-section--split">
        <article className="info-panel">
          <p className="eyebrow">Canales</p>
          <h2>Hablemos de tu ambiente.</h2>
          <div className="contact-list">
            <div className="contact-item">
              <span className="contact-item__label">WhatsApp</span>
              <strong>+54 9 11 0000 0000</strong>
              <p>Consultas rapidas, stock, medidas y coordinacion.</p>
            </div>
            <div className="contact-item">
              <span className="contact-item__label">Email</span>
              <strong>hola@chenille.com.ar</strong>
              <p>Ideal para pedidos detallados o consultas mas extensas.</p>
            </div>
            <div className="contact-item">
              <span className="contact-item__label">Instagram</span>
              <strong>@chenille.casa</strong>
              <p>Novedades, inspiracion y contacto directo desde redes.</p>
            </div>
          </div>
        </article>

        <article className="info-panel info-panel--accent">
          <p className="eyebrow">Atencion</p>
          <h2>Una pagina informativa, con contacto directo.</h2>
          <p>
            En esta etapa elegimos mostrar el catalogo como vidriera digital,
            para que el cliente pueda ver productos, estilos y referencias con
            claridad. Si le interesa una pieza, el siguiente paso es escribirnos
            para recibir asesoramiento y resolver la compra de forma directa.
          </p>
          <ul className="info-list">
            <li>Consultas por producto y disponibilidad.</li>
            <li>Orientacion sobre medidas y ambientes.</li>
            <li>Coordinacion de pedidos de forma personalizada.</li>
          </ul>
        </article>
      </section>
    </main>
  );
};

export default ContactPage;
