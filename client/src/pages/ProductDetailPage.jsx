const ProductDetailPage = ({
  product,
  onBack = () => {},
  onAddToCart = () => {},
}) => {
  // Si no encontramos el producto por id, evitamos que la pantalla quede rota.
  if (!product) {
    return (
      <main className="detail-page">
        <section className="empty-state">
          <p className="eyebrow">Producto</p>
          <h1>No encontramos ese producto.</h1>
          <button type="button" className="btn-primary" onClick={onBack}>
            Volver al catalogo
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="detail-page">
      {/* Boton simple para volver al catalogo sin depender del navegador */}
      <button type="button" className="back-link" onClick={onBack}>
        Volver al catalogo
      </button>

      <section className="detail-layout">
        <div className="detail-media">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-content">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{product.priceLabel}</p>
          <p className="detail-description">{product.description}</p>

          <div className="detail-summary">
            {/* Este bloque junta los datos mas utiles del producto en una vista rapida. */}
            <div>
              <span className="detail-summary__label">Material</span>
              <strong>{product.material}</strong>
            </div>
            <div>
              <span className="detail-summary__label">Medidas</span>
              <strong>{product.size}</strong>
            </div>
            <div>
              <span className="detail-summary__label">Stock</span>
              <strong>{product.stock}</strong>
            </div>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => onAddToCart(product)}
            >
              Agregar al carrito
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>
              Seguir mirando
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
