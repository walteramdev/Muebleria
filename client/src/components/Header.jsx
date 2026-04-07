import React, { useState } from "react";
import "../css/header.css";

const Header = ({
  onNavigate = () => {},
  productTypes = [],
  activeView = "home",
  cartCount = 0,
  onClearCart = () => {},
  onViewCart = () => {},
  currentUser = null,
  onLogout = () => {},
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // Controla el desplegable de categorias dentro del boton "Productos".
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  const toggleCartPopup = (open) => {
    if (typeof open === "boolean") {
      setIsPopupOpen(open);
      return;
    }
    setIsPopupOpen((prev) => !prev);
  };

  const handleClearCart = (event) => {
    event.stopPropagation();
    onClearCart();
    toggleCartPopup(false);
  };

  const handleCheckout = (event) => {
    event.stopPropagation();
    onViewCart();
    toggleCartPopup(false);
  };

  const handleNavClick = (sectionId) => (event) => {
    event.preventDefault();
    // Cada vez que navegamos, cerramos el menu para no dejarlo abierto.
    setIsProductsMenuOpen(false);
    onNavigate(sectionId);
  };

  const toggleProductsMenu = () => {
    setIsProductsMenuOpen((prev) => !prev);
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const isActive = (view) => activeView === view;

  return (
    <div className="main-header-wrapper">
      <header className="main-header">
        <button
          type="button"
          className="recuadro-logo"
          onClick={handleNavClick("inicio")}
        >
          <span className="logo-mark">Chenille</span>
        </button>

        <nav className="menu-navegacion">
          <button
            type="button"
            className={isActive("home") ? "active" : ""}
            onClick={handleNavClick("inicio")}
          >
            Inicio
          </button>
          <div className="nav-dropdown">
            {/* Este bloque abre un submenu con tipos de producto. */}
            <button
              type="button"
              className={isActive("catalog") ? "active" : ""}
              onClick={toggleProductsMenu}
            >
              Productos
            </button>

            <div
              className={`nav-dropdown__menu ${isProductsMenuOpen ? "open" : ""}`}
            >
              {/* "Todos" limpia la categoria y muestra el catalogo completo. */}
              <button type="button" onClick={handleNavClick("/productos")}>
                Todos
              </button>
              {productTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={handleNavClick(
                    `/productos?categoria=${encodeURIComponent(type)}`,
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={handleNavClick("destacados")}>
            Destacados
          </button>
          <button type="button" onClick={handleNavClick("contacto")}>
            Siguiente paso
          </button>
          <button
            type="button"
            className={isActive("cart") ? "active" : ""}
            onClick={handleNavClick("/carrito")}
          >
            Carrito
          </button>
          {currentUser && (
            <button type="button" onClick={handleLogoutClick}>
              Salir
            </button>
          )}
        </nav>

        <div
          className={`cart ${isPopupOpen ? "open" : ""}`}
          onClick={() => toggleCartPopup()}
        >
          <span className="icono-carro" aria-hidden="true">
            Carrito
          </span>

          <span id="cart-count">{cartCount}</span>

          <div className="cart-popup" onClick={(event) => event.stopPropagation()}>
            {/* Este popup es un acceso rapido; el carrito completo vive en /carrito */}
            <button
              id="clear-cart"
              type="button"
              className="popup-btn"
              onClick={handleClearCart}
            >
              Vaciar carrito
            </button>
            <button
              id="checkout"
              type="button"
              className="popup-btn"
              onClick={handleCheckout}
            >
              Ver carrito
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
