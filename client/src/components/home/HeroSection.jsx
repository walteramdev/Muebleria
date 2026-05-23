import React from "react";

const HeroSection = ({ sectionRef, backgroundImage }) => {
  return (
    <section
      ref={sectionRef}
      className="home-screen home-screen--hero"
      id="inicio"
      style={{ "--screen-background": `url(${backgroundImage})` }}
    >
      <div className="home-screen__overlay home-screen__overlay--hero" />
      <div className="home-screen__content home-screen__content--hero">
        <div className="home-immersive-hero__copy">
          <p className="eyebrow eyebrow--light">Chenille Casa y Mobiliario</p>
          <span className="hero-kicker">Coleccion curada para el hogar</span>
          <h1>Muebles pensados para habitar con calma</h1>
          <p className="home-immersive-hero__text">
            Piezas contemporaneas para living, comedor y dormitorio, con una
            seleccion pensada para espacios serenos, funcionales y propios.
          </p>
          <div className="home-immersive-hero__actions">
            <a className="hero-shop-button" href="/productos">
              Ver coleccion
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
