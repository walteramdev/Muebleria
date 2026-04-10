const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const heroImage =
  "https://wrfefas.my.canva.site/_assets/media/787090af7cd9a097a130f1f82951a959.jpg";

const HomePage = ({
  categoryDefinitions = [],
  onSelectProduct = () => {},
  products = [],
  isLoading = false,
  error = null,
}) => {
  const spotlightProducts = products.slice(0, 3);

  return (
    <main className="home-page">
      <section
        className="home-immersive-hero"
        id="inicio"
        style={{ "--hero-image": `url(${heroImage})` }}
      >
        <div className="home-immersive-hero__overlay" />
        <div className="home-immersive-hero__inner">
          <div className="home-immersive-hero__copy">
            <p className="eyebrow eyebrow--light">Chenille Casa y Mobiliario</p>
            <span className="hero-kicker">Coleccion curada para el hogar</span>
            <h1>Handmade calm for the spaces you live every day.</h1>
            <p className="home-immersive-hero__text">
              Tomamos la energia del diseño que te gusto y la llevamos a Chenille:
              una portada mas cinematografica, limpia y visual para que la marca se
              sienta editorial desde el primer segundo.
            </p>
            <div className="home-immersive-hero__actions">
              <a className="hero-shop-button" href="/productos">
                Shop now
              </a>
              <span className="hero-note">Living, comedor y dormitorio</span>
            </div>
          </div>

          <aside className="home-immersive-hero__aside">
            <article className="hero-floating-card hero-floating-card--intro">
              <p className="eyebrow">Nueva temporada</p>
              <strong>Texturas nobles, formas suaves y una tienda mas visual.</strong>
            </article>

            {spotlightProducts.slice(0, 2).map((product) => (
              <article className="hero-floating-card" key={product._id}>
                <img src={product.imagenUrl} alt={product.name} />
                <div>
                  <p className="product-card__category">
                    {product.category} / {product.subcategory}
                  </p>
                  <h3>{product.name}</h3>
                  <p>{formatPrice(product.price)}</p>
                </div>
              </article>
            ))}
          </aside>
        </div>
      </section>

      <section className="home-section home-section--catalog" id="colecciones">
        <div className="section-heading">
          <p className="eyebrow">Colecciones</p>
          <h2>Una base elegante para ordenar el catalogo antes de personalizarlo.</h2>
          <p>
            Las tres categorias siguen siendo provisorias, pero ya viven dentro de
            un lenguaje mas refinado y cercano a una tienda real.
          </p>
        </div>

        <div className="collection-grid">
          {categoryDefinitions.map((category) => (
            <article className="collection-card" key={category.name}>
              <span className="collection-card__number">{category.name}</span>
              <p className="collection-card__text">{category.shortDescription}</p>
              <ul className="collection-card__tags">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory}>{subcategory}</li>
                ))}
              </ul>
              <a
                className="collection-card__link"
                href={`/productos?categoria=${encodeURIComponent(category.name)}`}
              >
                Ver coleccion
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--featured" id="destacados">
        <div className="section-heading">
          <p className="eyebrow">Destacados</p>
          <h2>Piezas seleccionadas para que la vidriera ya tenga presencia propia.</h2>
        </div>

        {isLoading && <p className="state-message">Cargando productos...</p>}

        {!isLoading && error && (
          <p className="state-message state-error">{error}</p>
        )}

        {!isLoading && !error && (
          <div className="editorial-grid">
            {products.slice(0, 6).map((product) => (
              <article className="editorial-card" key={product._id}>
                <div className="editorial-card__media">
                  <img src={product.imagenUrl} alt={product.name} />
                </div>
                <div className="editorial-card__body">
                  <p className="product-card__category">
                    {product.category} / {product.subcategory}
                  </p>
                  <h3>{product.name}</h3>
                  <p className="product-card__description">{product.description}</p>
                  <div className="product-card__footer">
                    <strong>{formatPrice(product.price)}</strong>
                    <button
                      type="button"
                      className="product-card__button"
                      onClick={() => onSelectProduct(product)}
                    >
                      Ver mas
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="home-section home-section--quote" id="contacto">
        <article className="story-card story-card--quote">
          <p className="eyebrow">Texto de marca</p>
          <h2>Chenille propone interiores serenos, tactiles y faciles de habitar.</h2>
          <p className="story-copy">
            La idea no es solo mostrar muebles: es dejar una impresion de marca mas
            cuidada, para que despues ustedes personalicen fotos, productos y
            categorias sin tener que rehacer la base visual.
          </p>
        </article>
      </section>
    </main>
  );
};

export default HomePage;
