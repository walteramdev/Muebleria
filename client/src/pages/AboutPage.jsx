const AboutPage = () => {
  const aboutHeroImage =
    "https://images.pexels.com/photos/15558971/pexels-photo-15558971.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <main className="info-page info-page--brand">
      <section className="editorial-page-hero editorial-page-hero--about">
        <div className="editorial-page-hero__media">
          <img src={aboutHeroImage} alt="Interior cálido con texturas naturales" />
        </div>
        <div className="editorial-page-hero__overlay editorial-page-hero__overlay--soft" />
        <div className="editorial-page-hero__content">
          <p className="eyebrow eyebrow--light">Nosotros</p>
          <h1>Diseño cálido para espacios que se viven de verdad.</h1>
          <p className="page-hero__text page-hero__text--light">
            Chenille reúne piezas serenas, táctiles y nobles para que la casa se
            sienta propia, equilibrada y habitable todos los días.
          </p>
        </div>
      </section>

      <section className="info-section info-section--split info-section--story">
        <article className="info-panel info-panel--dark">
          <p className="eyebrow eyebrow--light">Nuestra mirada</p>
          <h2>Una casa bien armada cambia la forma de habitarla.</h2>
          <p>
            Nos interesan los muebles que resuelven lo cotidiano sin perder
            presencia. La colección está pensada para construir ambientes serenos,
            con materiales cálidos, líneas contemporáneas y una identidad que no
            necesita exceso para sentirse fuerte.
          </p>
        </article>

        <article className="info-panel info-panel--quote">
          <p className="eyebrow">Manifiesto</p>
          <h2>Menos ruido visual, más hogar.</h2>
          <p>
            Chenille no busca llenar espacios, sino acompañarlos. Queremos piezas
            con carácter tranquilo: muebles que duren, se usen y dialoguen con la
            vida diaria.
          </p>
        </article>
      </section>

      <section className="info-section">
        <div className="section-heading">
          <p className="eyebrow">Qué cuidamos</p>
          <h2>Tres criterios para construir la colección.</h2>
          <p>
            Cada selección parte de la misma idea: equilibrio entre presencia,
            funcionalidad y calidez visual.
          </p>
        </div>

        <div className="info-grid">
          <article className="info-card">
            <span className="info-card__number">01</span>
            <h3>Materialidad noble</h3>
            <p>Maderas, tapizados y texturas que aportan profundidad y abrigo.</p>
          </article>
          <article className="info-card">
            <span className="info-card__number">02</span>
            <h3>Uso real</h3>
            <p>Piezas pensadas para vivir la casa, no solo para mirarla.</p>
          </article>
          <article className="info-card">
            <span className="info-card__number">03</span>
            <h3>Calma visual</h3>
            <p>Composiciones simples, con aire y proporción, para que todo respire.</p>
          </article>
        </div>
      </section>

      <section className="info-section info-section--process">
        <div className="section-heading">
          <p className="eyebrow">Cómo trabajamos</p>
          <h2>Una curaduría simple, clara y cercana.</h2>
        </div>

        <div className="process-band">
          <article className="process-step">
            <span>01</span>
            <h3>Seleccionamos</h3>
            <p>Buscamos piezas que funcionen en living, comedor y dormitorio.</p>
          </article>
          <article className="process-step">
            <span>02</span>
            <h3>Ordenamos</h3>
            <p>Agrupamos la colección para que recorrerla sea simple e intuitivo.</p>
          </article>
          <article className="process-step">
            <span>03</span>
            <h3>Acompañamos</h3>
            <p>Ayudamos a elegir medidas, categorías y combinaciones con criterio.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
