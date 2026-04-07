const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

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
      <section className="showcase-hero" id="inicio">
        <div className="showcase-hero__lead">
          <p className="eyebrow">Chenille Casa y Mobiliario</p>
          <h1>Muebles contemporaneos para vivir, compartir y descansar mejor.</h1>
          <p className="showcase-hero__text">
            Diseñamos una vidriera digital con lenguaje de tienda real: categorias
            claras, productos destacados y una presentacion mas comercial para
            despues personalizar con la identidad final de la marca.
          </p>
          <div className="showcase-hero__actions">
            <a className="btn-primary" href="/productos">
              Ver tienda
            </a>
          </div>
        </div>

        <div className="showcase-hero__grid">
          {spotlightProducts.map((product) => (
            <article className="showcase-hero__card" key={product._id}>
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
        </div>
      </section>

      <section className="home-strip">
        <article>
          <p className="eyebrow">Marca</p>
          <strong>Diseño sobrio, materiales nobles y una experiencia de compra clara.</strong>
        </article>
        <article>
          <p className="eyebrow">Categorias</p>
          <strong>Living, comedor y dormitorio como base para crecer sin rehacer.</strong>
        </article>
        <article>
          <p className="eyebrow">Modo de trabajo</p>
          <strong>Frontend comercial hoy, integracion real con backend despues.</strong>
        </article>
      </section>

      <section className="home-section home-section--catalog" id="colecciones">
        <div className="section-heading">
          <p className="eyebrow">Colecciones</p>
          <h2>Una estructura general para despues personalizar con el catalogo real</h2>
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
          <h2>Una seleccion inicial para mostrar la tienda como si ya estuviera en marcha</h2>
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

      <section className="home-section" id="contacto">
        <article className="story-card">
          <p className="eyebrow">Texto de marca</p>
          <h2>Chenille acompaña espacios cotidianos con muebles honestos, calidos y duraderos.</h2>
          <p className="story-copy">
            Esta propuesta busca una estetica limpia, comercial y confiable,
            pensada para mostrar producto y facilitar la eleccion desde el primer
            vistazo.
          </p>
        </article>
      </section>
    </main>
  );
};

export default HomePage;
