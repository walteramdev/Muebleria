import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item._id === productToAdd._id,
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === productToAdd._id
            ? {
                ...item,
                quantity:
                  item.quantity < item.stock
                    ? item.quantity + 1
                    : item.quantity,
              }
            : item,
        );
      }

      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
  };

  const removeItemFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                item.quantity < item.stock ? item.quantity + 1 : item.quantity,
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item._id !== id) return item;

        if (item.quantity === 1) return [];
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }),
    );
  };

  const updateQuantity = (id, quantity) => {
    const value = Number(quantity);

    if (isNaN(value)) return;

    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item._id !== id) return item;

        if (value <= 0) return [];
        return {
          ...item,
          quantity: Math.min(value, item.stock),
        };
      }),
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItemFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
