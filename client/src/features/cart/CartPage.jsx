import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import CartItem from "./CartItem";

const CartPage = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    removeItemFromCart,
    totalPrice,
    totalItems,
  } = useContext(CartContext);

  return (
    <>
      <span>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis
        distinctio quis, accusamus, quos explicabo fuga ad ab hic sint
        reiciendis odit pariatur necessitatibus iure id obcaecati ex consectetur
        sit voluptatum.
      </span>
      <span>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis
        distinctio quis, accusamus, quos explicabo fuga ad ab hic sint
        reiciendis odit pariatur necessitatibus iure id obcaecati ex consectetur
        sit voluptatum.
      </span>{" "}
      <span>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis
        distinctio quis, accusamus, quos explicabo fuga ad ab hic sint
        reiciendis odit pariatur necessitatibus iure id obcaecati ex consectetur
        sit voluptatum.
      </span>
      <h1>Carrito</h1>
      {cartItems.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          updateQuantity={updateQuantity}
          removeItemFromCart={removeItemFromCart}
        />
      ))}
      <hr />
      <h2>
        Total de productos: <span>{totalItems}</span>
      </h2>
      <h2>
        Total: <span>${totalPrice}</span>
      </h2>
    </>
  );
};

export default CartPage;
