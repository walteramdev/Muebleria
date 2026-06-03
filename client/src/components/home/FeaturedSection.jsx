import React, { useState } from "react";

const FeaturedSection = ({
  sectionRef,
  backgroundImage,
  isLoading,
  error,
  featuredSlides,
  formatPrice,
  onSelectProduct,
  currentUser = null,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes("mouse") ? e.pageX : e.touches[0].pageX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    if (e.type.includes("mouse")) {
      e.preventDefault();
    }

    const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    const walk = x - startX;

    if (Math.abs(walk) > 40) {
      setIsDragging(false);
      if (walk > 0) {
        document
          .querySelector("#featuredCarousel .carousel-control-prev")
          ?.click();
      } else {
        document
          .querySelector("#featuredCarousel .carousel-control-next")
          ?.click();
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="home-screen home-screen--featured"
      id="destacados"
      style={{ "--screen-background": `url(${backgroundImage})` }}
    >
      <div className="home-screen__overlay" />
      <div className="home-screen__content home-screen__content--wide is-active-panel">
        <div className="screen-heading screen-heading--light screen-heading--compact">
          <h2>Novedades</h2>
        </div>

        {isLoading && (
          <p className="state-message state-message--light">
            Cargando productos...
          </p>
        )}
        {!isLoading && error && (
          <p className="state-message state-message--light state-error">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div
            id="featuredCarousel"
            className="carousel slide home-bootstrap-carousel"
            data-bs-ride="carousel"
            data-bs-interval="4500"
            data-bs-pause="false"
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

            <div
              className="carousel-inner"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: isDragging ? "none" : "auto",
              }}
            >
              {featuredSlides.map((slide, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={slide.map((product) => product._id).join("-")}
                >
                  <div className="home-bootstrap-carousel__track">
                    {slide.map((product) => {
                      const mainImage =
                        product.images && product.images.length > 0
                          ? product.images[0].url
                          : product.imagenUrl || "/placeholder.jpg";

                      const getCatalogSummary = (p) => {
                        const baseText =
                          p.shortDescription?.split(".")[0] ||
                          p.description?.split(".")[0] ||
                          "";
                        const trimmedText = baseText.trim();
                        if (!trimmedText) {
                          return "Pieza pensada para sumar calidez y presencia al ambiente.";
                        }
                        return trimmedText.endsWith(".")
                          ? trimmedText
                          : `${trimmedText}.`;
                      };

                      return (
                        <article
                          className="catalog-card catalog-card--immersive featured-spotlight-card"
                          key={product._id}
                        >
                          <div className="catalog-card__media">
                            <img src={mainImage} alt={product.name} draggable="false" />
                          </div>

                          <div className="catalog-card__body">
                            <p className="product-card__category">
                              {product.category}
                            </p>
                            <h2>{product.name}</h2>
                            <p className="catalog-card__description">
                              {getCatalogSummary(product)}
                            </p>
                          </div>

                          <div className="catalog-card__footer">
                            <strong>{formatPrice(product.price)}</strong>

                            <div className="catalog-card__actions">
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => onSelectProduct(product)}
                              >
                                Ver detalle
                              </button>

                              {currentUser?.role !== "admin" && (
                                <a
                                  href={`https://wa.me/5493804660709?text=${encodeURIComponent(
                                    `¡Hola Chenille! Me interesa consultar por la pieza: ${product.name}`,
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-whatsapp"
                                  style={{
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ display: "block" }}
                                  >
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                  </svg>
                                  Consultar
                                </a>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
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
