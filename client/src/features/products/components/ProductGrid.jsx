import ProductCard from "./ProductCard";

const ProductGrid = ({
  products,
  selectedCategory,
  onSelectProduct,
  onAddToCart,
}) => {
  return (
    <section className="catalog-grid catalog-grid--immersive">
      {products.length === 0 && (
        <article className="catalog-card catalog-card--empty">
          <div className="catalog-card__body">
            <p className="product-card__category">{selectedCategory}</p>
            <h2>No hay productos en este filtro por ahora.</h2>
            <p className="catalog-card__description">
              Todavía no cargamos piezas para esta combinación.
            </p>
          </div>
        </article>
      )}

      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
        />
      ))}
    </section>
  );
};

export default ProductGrid;
