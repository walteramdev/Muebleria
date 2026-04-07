const CatalogPage = ({
  categoryDefinitions = [],
  products = [],
  selectedCategory = "Todos",
  categories = [],
  onSelectProduct = () => {},
  onAddToCart = () => {},
  onCategorySelect = () => {},
}) => {
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);

  const selectedCategoryDefinition = categoryDefinitions.find(
    (category) => category.name === selectedCategory,
  );

  return (
    <main className="catalog-page">
      <section className="page-hero">
        <p className="eyebrow">Catalogo</p>
        <h1>Explora piezas pensadas para vivir mejor la casa.</h1>
        <p className="page-hero__text">
          Esta pagina ya queda lista para mostrar productos reales cuando el
          backend empiece a devolverlos.
        </p>

        {selectedCategoryDefinition && (
          <div className="catalog-subcategories">
            {selectedCategoryDefinition.subcategories.map((subcategory) => (
              <span key={subcategory}>{subcategory}</span>
            ))}
          </div>
        )}

        <div className="catalog-filters">
          {/* Botones rapidos para cambiar de categoria sin volver al header. */}
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={category === selectedCategory ? "is-selected" : ""}
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="catalog-grid">
        {/* Si no hay productos en la categoria elegida, mostramos un estado vacio. */}
        {products.length === 0 && (
          <article className="catalog-card catalog-card--empty">
            <div className="catalog-card__body">
              <p className="product-card__category">{selectedCategory}</p>
              <h2>No hay productos en esta categoria por ahora.</h2>
              <p className="catalog-card__description">
                La estructura ya esta lista para que despues aparezcan aca los
                productos reales de la base de datos.
              </p>
            </div>
          </article>
        )}
        {/* Cada tarjeta resume el producto y deja dos acciones: ver o agregar. */}
        {products.map((product) => (
          <article className="catalog-card" key={product._id}>
            <div className="catalog-card__media">
              <img src={product.imagenUrl} alt={product.name} />
            </div>

            <div className="catalog-card__body">
              <p className="product-card__category">{product.category}</p>
              <p className="catalog-card__subcategory">{product.subcategory}</p>
              <h2>{product.name}</h2>
              <p className="catalog-card__description">{product.description}</p>
              <p className="catalog-card__meta">
                {product.features?.materiales || "Material a definir"}
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
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => onAddToCart(product)}
                >
                  Agregar
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default CatalogPage;
