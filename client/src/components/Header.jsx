import React, { useState } from "react";
import "../css/header.css";

const Header = ({
  onNavigate = () => {},
  categoryDefinitions = [],
  activeView = "home",
  cartCount = 0,
  cartEnabled = true,
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
    if (!cartEnabled) {
      return;
    }
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
              {categoryDefinitions.map((category) => (
                <div className="nav-dropdown__group" key={category.name}>
                  <button
                    type="button"
                    className="nav-dropdown__title"
                    onClick={handleNavClick(
                      `/productos?categoria=${encodeURIComponent(category.name)}`,
                    )}
                  >
                    {category.name}
                  </button>
                  <div className="nav-dropdown__tags">
                    {category.subcategories.map((subcategory) => (
                      <span key={subcategory}>{subcategory}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={handleNavClick("destacados")}>
            Destacados
          </button>
          {currentUser && (
            <button type="button" onClick={handleLogoutClick}>
              Salir
            </button>
          )}
        </nav>

        <div
          className={`cart ${isPopupOpen ? "open" : ""} ${cartEnabled ? "" : "is-disabled"}`}
          onClick={() => {
            if (!cartEnabled) {
              return;
            }
            toggleCartPopup();
          }}
        >
          <span className="icono-carro" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              role="img"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3 5h2l1.2 6.2A2 2 0 0 0 8.2 13H17a2 2 0 0 0 1.9-1.4L20.7 6H7.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="18.5" r="1.5" fill="currentColor" />
              <circle cx="17" cy="18.5" r="1.5" fill="currentColor" />
            </svg>
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
