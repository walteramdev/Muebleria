const ProductCard = ({ product, onSelectProduct, onAddToCart }) => {
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
  );
};

export default ProductCard;
