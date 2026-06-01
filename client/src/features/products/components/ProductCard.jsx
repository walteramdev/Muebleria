const ProductCard = ({ product, onSelectProduct, currentUser = null }) => {
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);

  const getCatalogSummary = (product) => {
    const baseText = product.shortDescription?.split(".")[0] || "";
    const trimmedText = baseText.trim();

    if (!trimmedText) {
      return "Pieza pensada para sumar calidez y presencia al ambiente.";
    }

    return trimmedText.endsWith(".") ? trimmedText : `${trimmedText}.`;
  };

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "/placeholder.jpg"; // opcional: imagen por defecto

  return (
    <article className="catalog-card catalog-card--immersive">
      <div className="catalog-card__media">
        <img src={mainImage} alt={product.name} />
      </div>

      <div className="catalog-card__body">
        <p className="product-card__category">{product.category}</p>
        <p className="catalog-card__subcategory">{product.subcategory}</p>
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
                `¡Hola Chenille! Me interesa consultar por la pieza: ${product.name}`
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
};

export default ProductCard;
