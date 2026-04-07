const CartPage = ({
  cartItems = [],
  totalLabel = "$ 0",
  onContinueShopping = () => {},
  onClearCart = () => {},
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
}) => {
  const isEmpty = cartItems.length === 0;

  return (
    <main className="cart-page">
      <section className="page-hero">
        <p className="eyebrow">Carrito</p>
        <h1>Revisa lo que elegiste antes de seguir.</h1>
        <p className="page-hero__text">
          Todavia no conectamos el pago real, pero esta vista ya deja armado el
          recorrido de compra.
        </p>
      </section>

      {isEmpty ? (
        // Estado vacio: se muestra cuando todavia no agregaron nada al carrito.
        <section className="empty-state cart-empty">
          <h2>Tu carrito esta vacio.</h2>
          <p className="state-message">
            Cuando agregues productos desde el catalogo o desde el detalle, van
            a aparecer aca.
          </p>
          <button type="button" className="btn-primary" onClick={onContinueShopping}>
            Ir al catalogo
          </button>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-list">
            {/* Cada item del carrito puede aumentar, bajar o quitarse. */}
            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <img className="cart-item__image" src={item.image} alt={item.name} />

                <div className="cart-item__content">
                  <p className="product-card__category">{item.category}</p>
                  <h2>{item.name}</h2>
                  <p className="cart-item__material">{item.material}</p>
                  <strong>{item.priceLabel}</strong>
                </div>

                <div className="cart-item__controls">
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-link"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            {/* Resumen general del carrito. Mas adelante puede sumar envio, stock y pago real. */}
            <p className="eyebrow">Resumen</p>
            <h2>Total estimado</h2>
            <p className="cart-summary__total">{totalLabel}</p>
            <p className="state-message">
              Este total es visual por ahora. Cuando el backend este listo,
              podemos sumar stock real, envio y pago.
            </p>
            <div className="cart-summary__actions">
              <button
                type="button"
                className="btn-primary"
                onClick={onContinueShopping}
              >
                Seguir comprando
              </button>
              <button type="button" className="btn-secondary" onClick={onClearCart}>
                Vaciar carrito
              </button>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
};

export default CartPage;
