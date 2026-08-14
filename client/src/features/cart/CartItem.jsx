import { useEffect, useState } from "react";

const CartItem = ({
  item,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeItemFromCart,
}) => {
  const [inputValue, setInputValue] = useState(item.quantity);

  useEffect(() => {
    setInputValue(item.quantity);
  }, [item.quantity]);

  const confirmQuantity = () => {
    let value = Number(inputValue);

    if (isNaN(value) || value <= 0) {
      value = 1;
    }

    if (value > item.stock) {
      value = item.stock;
    }

    updateQuantity(item._id, value);
    setInputValue(value);
  };

  return (
    <article className="cart-item">
      <div className="cart-item-image">
        <img src={item.images[0].url} alt={item.name} />
      </div>

      <div className="cart-item-info">
        <h2>{item.name}</h2>

        <p>Precio: ${item.price}</p>

        <p>Stock: {item.stock}</p>
      </div>

      <div className="cart-item-quantity">
        <button onClick={() => decreaseQuantity(item._id)}>-</button>

        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={confirmQuantity}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              confirmQuantity();
            }
          }}
        />

        <button onClick={() => increaseQuantity(item._id)}>+</button>
      </div>

      <div className="cart-item-subtotal">
        <strong>${item.price * item.quantity}</strong>
      </div>

      <div className="cart-item-actions">
        <button onClick={() => removeItemFromCart(item._id)}>Eliminar</button>
      </div>
    </article>
  );
};

export default CartItem;
