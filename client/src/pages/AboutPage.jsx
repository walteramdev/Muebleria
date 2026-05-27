const AboutPage = () => {
  const bgImage = "https://images.pexels.com/photos/15558971/pexels-photo-15558971.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <main className="info-page info-page--brand" style={{ paddingBottom: 0 }}>
      
      <section className="editorial-page-hero editorial-page-hero--about">
        <div className="editorial-page-hero__media">
          <img src={bgImage} alt="Mueblería interior" />
        </div>
        <div className="editorial-page-hero__overlay editorial-page-hero__overlay--soft" />
        
        <div className="editorial-page-hero__content editorial-page-hero__content--about">
          
          {/* Left Column: Header */}
          <div className="about-hero-left">
            <p className="eyebrow eyebrow--light">NOSOTROS</p>
            <h1>Una mirada<br />sobre el hogar.</h1>
            <p className="about-header__text about-header__text--light">
              Seleccionamos piezas con criterio, pensadas para que cada ambiente se sienta sereno,
              funcional y propio.
            </p>
          </div>

          {/* Right Column: Manifesto & Steps */}
          <div className="about-hero-right">
            <div className="about-hero-manifesto">
              <h2 className="about-hero-manifesto__quote">
                "Menos ruido visual, más hogar."
              </h2>
              <p className="about-hero-manifesto__text">
                Chenille no busca llenar espacios, sino
                acompañarlos. Muebles que duren, se usen y
                dialoguen con la vida diaria.
              </p>
            </div>

            <div className="about-hero-steps">
              <article className="about-hero-step">
                <span className="about-hero-step__number">01</span>
                <div className="about-hero-step__content">
                  <h3>Seleccionamos</h3>
                  <p>Buscamos piezas que funcionen en living, comedor y dormitorio.</p>
                </div>
              </article>
              <article className="about-hero-step">
                <span className="about-hero-step__number">02</span>
                <div className="about-hero-step__content">
                  <h3>Ordenamos</h3>
                  <p>Agrupamos la colección para que recorrerla sea simple e intuitivo.</p>
                </div>
              </article>
              <article className="about-hero-step">
                <span className="about-hero-step__number">03</span>
                <div className="about-hero-step__content">
                  <h3>Acompañamos</h3>
                  <p>Ayudamos a elegir medidas, categorías y combinaciones con criterio.</p>
                </div>
              </article>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
};

export default AboutPage;
