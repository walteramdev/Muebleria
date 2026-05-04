import { useMemo, useState } from "react";

const PRODUCTS_PER_PAGE = 6;

const heroImages = {
  Todos:
    "https://images.pexels.com/photos/5824903/pexels-photo-5824903.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Living:
    "https://images.pexels.com/photos/6207949/pexels-photo-6207949.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Comedor:
    "https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Dormitorio:
    "https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const heroCopy = {
  Todos: {
    eyebrow: "Coleccion",
    title: "Piezas pensadas para vivir la casa con calma.",
    text: "Living, comedor y dormitorio reunidos en una selección cálida, funcional y serena.",
  },
  Living: {
    eyebrow: "Living",
    title: "Recibir, descansar y habitar con identidad.",
    text: "Sillones, consolas y mesas ratonas para construir una atmósfera tranquila y propia.",
  },
  Comedor: {
    eyebrow: "Comedor",
    title: "Muebles para compartir todos los días.",
    text: "Mesas, sillas y apoyos con presencia cálida para acompañar reuniones, uso diario y rituales cotidianos.",
  },
  Dormitorio: {
    eyebrow: "Dormitorio",
    title: "Soluciones cálidas para bajar el ritmo.",
    text: "Respaldos, mesas de luz y cómodas pensados para ordenar, abrigar y descansar mejor.",
  },
};

const CatalogPageContent = ({
  categoryDefinitions = [],
  products = [],
  selectedCategory = "Todos",
  selectedSubcategory = "",
  availableSubcategories = [],
  categories = [],
  onSelectProduct = () => {},
  onAddToCart = () => {},
  onCategorySelect = () => {},
  onSubcategorySelect = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);

  const getCatalogSummary = (product) => {
    const baseText = product.description?.split(".")[0] || "";
    const trimmedText = baseText.trim();

    if (!trimmedText) {
      return "Pieza pensada para sumar calidez y presencia al ambiente.";
    }

    return trimmedText.endsWith(".") ? trimmedText : `${trimmedText}.`;
  };

  const selectedCategoryDefinition = categoryDefinitions.find(
    (category) => category.name === selectedCategory,
  );

  const resolvedHero = heroCopy[selectedCategory] ?? heroCopy.Todos;
  const heroImage = heroImages[selectedCategory] ?? heroImages.Todos;

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [products, safeCurrentPage]);

  const paginationItems = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <main className="catalog-page catalog-page--immersive">
      <section className="catalog-screen catalog-screen--hero">
        <div className="catalog-hero" style={{ "--catalog-hero-image": `url(${heroImage})` }}>
          <div className="catalog-hero__overlay" />
          <div className="catalog-hero__content">
            <p className="eyebrow eyebrow--light">{resolvedHero.eyebrow}</p>
            <h1>{resolvedHero.title}</h1>
            <p className="catalog-hero__text">{resolvedHero.text}</p>

            <div className="catalog-hero__filters">
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
          </div>
        </div>
      </section>

      <section className="catalog-screen catalog-screen--products">
        <div className="catalog-collection-shell">
          <div className="catalog-collection-shell__header">
            <div>
              <p className="eyebrow">Coleccion</p>
              <h2>
                {selectedCategory === "Todos"
                  ? "Toda la colección"
                  : selectedSubcategory
                    ? `${selectedCategory} / ${selectedSubcategory}`
                    : selectedCategory}
              </h2>
            </div>
            <p className="catalog-collection-shell__text">
              {selectedCategoryDefinition?.shortDescription ||
                "Un recorrido editorial por las piezas principales de Chenille."}
            </p>
          </div>

          {selectedCategoryDefinition && (
            <div className="catalog-subcategory-filters catalog-subcategory-filters--inline">
              <button
                type="button"
                className={selectedSubcategory ? "" : "is-selected"}
                onClick={() => onSubcategorySelect("")}
              >
                Todo {selectedCategoryDefinition.name}
              </button>
              {availableSubcategories.map((subcategory) => (
                <button
                  type="button"
                  key={subcategory}
                  className={subcategory === selectedSubcategory ? "is-selected" : ""}
                  onClick={() => onSubcategorySelect(subcategory)}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          )}

          <section className="catalog-grid catalog-grid--immersive">
            {products.length === 0 && (
              <article className="catalog-card catalog-card--empty">
                <div className="catalog-card__body">
                  <p className="product-card__category">{selectedCategory}</p>
                  <h2>No hay productos en este filtro por ahora.</h2>
                  <p className="catalog-card__description">
                    Todavía no cargamos piezas para esta combinación, pero la estructura
                    ya queda lista para seguir ampliando la colección.
                  </p>
                </div>
              </article>
            )}

            {paginatedProducts.map((product) => (
              <article className="catalog-card catalog-card--immersive" key={product._id}>
                <div className="catalog-card__media">
                  <img src={product.imagenUrl} alt={product.name} />
                </div>

                <div className="catalog-card__body">
                  <p className="product-card__category">{product.category}</p>
                  <p className="catalog-card__subcategory">{product.subcategory}</p>
                  <h2>{product.name}</h2>
                  <p className="catalog-card__description">{getCatalogSummary(product)}</p>
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

          <nav className="catalog-pagination" aria-label="Paginacion de productos">
              <button
                type="button"
                className="catalog-pagination__arrow"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
              >
                Anterior
              </button>

              <div className="catalog-pagination__pages">
                {paginationItems.map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={page === safeCurrentPage ? "is-selected" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="catalog-pagination__arrow"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safeCurrentPage === totalPages}
              >
                Siguiente
              </button>
            </nav>
          </div>
      </section>
    </main>
  );
};

const CatalogPage = (props) => {
  const {
    selectedCategory = "Todos",
    selectedSubcategory = "",
  } = props;

  return (
    <CatalogPageContent
      key={`${selectedCategory}::${selectedSubcategory}`}
      {...props}
    />
  );
};

export default CatalogPage;
