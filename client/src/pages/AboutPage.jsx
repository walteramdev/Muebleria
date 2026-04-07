const AboutPage = () => {
  return (
    <main className="info-page">
      <section className="page-hero">
        <p className="eyebrow">Nosotros</p>
        <h1>Muebles pensados para acompañar la vida diaria.</h1>
        <p className="page-hero__text">
          En Chenille trabajamos una seleccion de muebles con mirada calida,
          lineas contemporaneas y materiales que buscan durar en el tiempo.
          Nos interesa construir espacios que se sientan vividos, comodos y
          propios.
        </p>
      </section>

      <section className="info-section info-section--split">
        <article className="info-panel">
          <p className="eyebrow">Nuestra mirada</p>
          <h2>Una casa bien armada cambia la forma de habitarla.</h2>
          <p>
            Creemos en muebles que resuelven lo cotidiano sin perder identidad.
            Por eso armamos una propuesta general que combina living, comedor y
            dormitorio con una estetica serena, funcional y facil de adaptar a
            distintos hogares.
          </p>
          <p>
            Esta primera version del sitio esta pensada como una vidriera
            digital: mostrar mejor los productos, ordenar categorias y dar una
            presentacion clara mientras terminamos de personalizar cada detalle
            de la marca.
          </p>
        </article>

        <article className="info-panel info-panel--accent">
          <p className="eyebrow">Que buscamos transmitir</p>
          <ul className="info-list">
            <li>Diseno calido y contemporaneo.</li>
            <li>Productos pensados para uso real, no solo para decorar.</li>
            <li>Una seleccion simple de recorrer y facil de entender.</li>
            <li>Ambientes con identidad, equilibrio y comodidad.</li>
          </ul>
        </article>
      </section>

      <section className="info-section">
        <div className="section-heading">
          <p className="eyebrow">Como trabajamos hoy</p>
          <h2>Una base general para despues personalizar.</h2>
          <p>
            Hoy el sitio muestra una estructura inicial de categorias y
            subcategorias para ordenar mejor la experiencia. La idea es contar
            con una base prolija y profesional que luego podamos ajustar a los
            productos, imagenes y decisiones finales de la muebleria.
          </p>
        </div>

        <div className="info-grid">
          <article className="info-card">
            <span className="info-card__number">01</span>
            <h3>Living</h3>
            <p>Sillones, mesas ratonas y consolas para recibir y descansar.</p>
          </article>
          <article className="info-card">
            <span className="info-card__number">02</span>
            <h3>Comedor</h3>
            <p>Mesas, sillas y piezas de apoyo para compartir todos los dias.</p>
          </article>
          <article className="info-card">
            <span className="info-card__number">03</span>
            <h3>Dormitorio</h3>
            <p>Respaldos, mesas de luz y comodas para sumar abrigo y orden.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
