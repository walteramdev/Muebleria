import React from "react";
import { useNavigate } from "react-router-dom";

const CollectionsSection = ({
  sectionRef,
  onTouchStart,
  onTouchEnd,
  activeCollection,
  activeCollectionSlide,
  collectionHeroSlides,
  setActiveCollectionSlide,
  handleCollectionPrev,
  handleCollectionNext,
}) => {
  const navigate = useNavigate();

  return (
    <section
      ref={sectionRef}
      className="home-screen home-screen--collections"
      id="colecciones"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="collections-hero-fullscreen">
        <div className="collections-hero-fullscreen__progress">
          {activeCollection && (
            <span
              key={activeCollectionSlide}
              className="collections-hero-fullscreen__progress-bar"
              style={{ "--collection-accent": activeCollection.accent }}
            />
          )}
        </div>

        {activeCollection && (
          <div className="collections-hero-fullscreen__slides">
            <article
              key={activeCollection.key}
              className="collections-hero-slide active"
              style={{
                "--collection-bg": activeCollection.background,
                "--collection-image-panel": activeCollection.imagePanel,
                "--collection-accent": activeCollection.accent,
              }}
            >
              <div className="collections-hero-slide__content">
                <p className="collections-hero-slide__label">{activeCollection.label}</p>
                <h2 className="collections-hero-slide__title">
                  {activeCollection.title.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <p className="collections-hero-slide__description">{activeCollection.description}</p>
                <button
                  type="button"
                  className="collections-hero-slide__cta"
                  onClick={() =>
                    navigate(`/productos?categoria=${encodeURIComponent(activeCollection.categoryName)}`)
                  }
                >
                  Ver coleccion
                </button>
              </div>

              <div className="collections-hero-slide__visual">
                <img src={activeCollection.image} alt={activeCollection.label} />
              </div>
            </article>
          </div>
        )}

        <div className="collections-hero-fullscreen__dots">
          {collectionHeroSlides.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              className={index === activeCollectionSlide ? "active" : ""}
              aria-label={`Ir al slide ${index + 1}`}
              onClick={() => setActiveCollectionSlide(index)}
              style={{ "--collection-accent": slide.accent }}
            />
          ))}
        </div>

        <div className="collections-hero-fullscreen__arrows">
          <button type="button" aria-label="Anterior" onClick={handleCollectionPrev}>
            ‹
          </button>
          <button type="button" aria-label="Siguiente" onClick={handleCollectionNext}>
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
