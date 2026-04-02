import React from "react";
const HomePage = (
  onSelectProduct,
  products = [],
  isLoading = false,
  error = null,
) => {
  return (
    <>
      <div className="container-home">
        <section className="hero-banner">
          <div className="hero-banner-overlay">
            <div className="hero-banner-quote-box">
              <h1 className="hero-banner-quote">
                “Cada pieza cuenta la historia de manos expertas y materiales
                nobles”
              </h1>
              <p className="hero-banner-author">— Hnos Jota</p>
            </div>
          </div>
        </section>
        <hr />
        <section className="new-products">
          <h2 className="subtitle">Productos Nuevos</h2>

          {isLoading && (
            <p className="state-message">Cargando productos nuevos...</p>
          )}

          {!isLoading && error && (
            <p className="state-message state-error">{error}</p>
          )}

          {!isLoading && !error && (
            <FeaturedProduct
              products={products}
              onSelectProduct={onSelectProduct}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default HomePage;
