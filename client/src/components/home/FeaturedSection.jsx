import React from "react";

const FeaturedSection = ({
  sectionRef,
  backgroundImage,
  featuredMarqueeItems,
  isLoading,
  error,
  featuredSlides,
  formatPrice,
  onSelectProduct,
}) => {
  return (
    <section
      ref={sectionRef}
      className="home-screen home-screen--featured"
      id="destacados"
      style={{ "--screen-background": `url(${backgroundImage})` }}
    >
      <div className="home-screen__overlay" />
      <div className="featured-marquee" aria-hidden="true">
        <div className="featured-marquee__track">
          {[...featuredMarqueeItems, ...featuredMarqueeItems].map((item, index) => (
            <span className="featured-marquee__item" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="home-screen__content home-screen__content--wide is-active-panel">
        <div className="screen-heading screen-heading--light screen-heading--compact">
          <p className="eyebrow eyebrow--light">Destacados</p>
          <h2>Selección que define a Chenille.</h2>
        </div>

        {isLoading && <p className="state-message state-message--light">Cargando productos...</p>}
        {!isLoading && error && (
          <p className="state-message state-message--light state-error">{error}</p>
        )}

        {!isLoading && !error && (
          <div
            id="featuredCarousel"
            className="carousel slide home-bootstrap-carousel"
            data-bs-ride="carousel"
            data-bs-interval="4500"
          >
            <div className="carousel-indicators home-bootstrap-carousel__indicators">
              {featuredSlides.map((slide, index) => (
                <button
                  key={slide.map((product) => product._id).join("-")}
                  type="button"
                  data-bs-target="#featuredCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : undefined}
                  aria-label={`Grupo de destacados ${index + 1}`}
                />
              ))}
            </div>

            <div className="carousel-inner">
              {featuredSlides.map((slide, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={slide.map((product) => product._id).join("-")}
                >
                  <div className="home-bootstrap-carousel__track">
                    {slide.map((product) => (
                      <article className="featured-spotlight-card" key={product._id}>
                        <div className="featured-spotlight-card__media">
                          <img src={product.imagenUrl} alt={product.name} />
                        </div>
                        <div className="featured-spotlight-card__body">
                          <p className="product-card__category product-card__category--light">
                            {product.category}
                          </p>
                          <h3>{product.name}</h3>
                          <p className="featured-spotlight-card__description">
                            {product.description}
                          </p>
                          <div className="featured-spotlight-card__footer">
                            <strong>{formatPrice(product.price)}</strong>
                            <button
                              type="button"
                              className="featured-spotlight-card__link"
                              onClick={() => onSelectProduct(product)}
                            >
                              Ver detalle
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev home-bootstrap-carousel__control"
              type="button"
              data-bs-target="#featuredCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next home-bootstrap-carousel__control"
              type="button"
              data-bs-target="#featuredCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
