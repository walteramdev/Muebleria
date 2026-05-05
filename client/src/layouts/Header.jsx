import React, { useEffect, useState } from "react";
import "../styles/header.css";

const Header = ({
  onNavigate = () => {},
  categoryDefinitions = [],
  activeView = "home",
  cartCount = 0,
  cartEnabled = true,
  isOverlay = false,
  onClearCart = () => {},
  onViewCart = () => {},
  currentUser = null,
  onLogout = () => {},
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 24) {
        setIsHeaderVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY + 8) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY - 8) {
        setIsHeaderVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const closeProductsMenu = () => {
    setIsProductsMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileProductsOpen(false);
  };

  const handleNavClick = (sectionId) => (event) => {
    event.preventDefault();
    closeProductsMenu();
    closeMobileMenu();
    onNavigate(sectionId);
  };

  const toggleProductsMenu = () => {
    setIsProductsMenuOpen((prev) => !prev);
  };

  const openProductsMenu = () => {
    setIsProductsMenuOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleMobileProducts = () => {
    setIsMobileProductsOpen((prev) => !prev);
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const isActive = (view) => activeView === view;

  return (
    <div
      className={`main-header-wrapper ${isOverlay ? "is-overlay" : ""} ${isHeaderVisible ? "" : "is-hidden"}`}
    >
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
          <button type="button" onClick={handleNavClick("destacados")}>
            Destacados
          </button>
          <div
            className="nav-dropdown"
            onMouseEnter={openProductsMenu}
            onMouseLeave={closeProductsMenu}
          >
            <button
              type="button"
              className={isActive("catalog") ? "active" : ""}
              onClick={toggleProductsMenu}
              aria-expanded={isProductsMenuOpen}
            >
              Productos
            </button>

            <div
              className={`nav-dropdown__menu ${isProductsMenuOpen ? "open" : ""}`}
            >
              <div className="nav-dropdown__topbar">
                <div className="nav-dropdown__copy">
                  <p className="nav-dropdown__eyebrow">Colecciones</p>
                  <h3>Living, comedor y dormitorio.</h3>
                </div>
                <button
                  type="button"
                  className="nav-dropdown__browse-all"
                  onClick={handleNavClick("/productos")}
                >
                  Ver toda la coleccion
                </button>
              </div>

              <div className="nav-dropdown__grid">
                {categoryDefinitions.map((category) => (
                  <article
                    key={category.name}
                    className="nav-dropdown__category-card"
                  >
                    <button
                      type="button"
                      className="nav-dropdown__heading"
                      onClick={handleNavClick(
                        `/productos?categoria=${encodeURIComponent(category.name)}`,
                      )}
                    >
                      {category.name}
                    </button>
                    <p className="nav-dropdown__category-text">
                      {category.shortDescription}
                    </p>
                    <div className="nav-dropdown__subitems">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          type="button"
                          className="nav-dropdown__subitem"
                          onClick={handleNavClick(
                            `/productos?categoria=${encodeURIComponent(category.name)}&subcategoria=${encodeURIComponent(subcategory)}`,
                          )}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className={isActive("about") ? "active" : ""}
            onClick={handleNavClick("/nosotros")}
          >
            Nosotros
          </button>
          <button
            type="button"
            className={isActive("contact") ? "active" : ""}
            onClick={handleNavClick("/contacto")}
          >
            Contacto
          </button>
          {currentUser && (
            <button type="button" onClick={handleLogoutClick}>
              Salir
            </button>
          )}
        </nav>

        <button
          type="button"
          className={`menu-toggle ${isMobileMenuOpen ? "is-open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Abrir menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="header-actions">
          <div className="header-socials" aria-label="Redes sociales">
            <a
              className="header-social-link"
              href="https://instagram.com/chenille.muebles"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de Chenille"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect
                  x="3.25"
                  y="3.25"
                  width="17.5"
                  height="17.5"
                  rx="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a
              className="header-social-link"
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp de Chenille"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M20 11.7A8 8 0 0 1 8.2 18.8L4 20l1.3-4A8 8 0 1 1 20 11.7Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8.8c.2-.4.4-.4.7-.4h.6c.2 0 .4 0 .5.4l.6 1.4c.1.3.1.5-.1.7l-.5.6c-.1.1-.1.3 0 .4.3.7 1 1.4 1.7 1.7.1.1.3.1.4 0l.6-.5c.2-.2.4-.2.7-.1l1.4.6c.4.1.4.3.4.5v.6c0 .3 0 .5-.4.7-.3.2-1 .3-1.6.2-1-.2-2.2-.9-3.2-1.8s-1.6-2.2-1.8-3.2c-.1-.6 0-1.3.2-1.6Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>

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

            <div
              className="cart-popup"
              onClick={(event) => event.stopPropagation()}
            >
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
        </div>
      </header>

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <button type="button" onClick={handleNavClick("inicio")}>
          Inicio
        </button>
        <button type="button" onClick={handleNavClick("destacados")}>
          Destacados
        </button>

        <div className="mobile-products">
          <button
            type="button"
            className={`mobile-products__trigger ${isMobileProductsOpen ? "is-open" : ""}`}
            onClick={toggleMobileProducts}
          >
            <span>Productos</span>
            <span className="mobile-products__icon">
              {isMobileProductsOpen ? "−" : "+"}
            </span>
          </button>

          <div
            className={`mobile-products__list ${isMobileProductsOpen ? "open" : ""}`}
          >
            <button type="button" onClick={handleNavClick("/productos")}>
              Ver todo
            </button>
            {categoryDefinitions.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={handleNavClick(
                  `/productos?categoria=${encodeURIComponent(category.name)}`,
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <button type="button" onClick={handleNavClick("/nosotros")}>
          Nosotros
        </button>
        <button type="button" onClick={handleNavClick("/contacto")}>
          Contacto
        </button>
        {currentUser && (
          <button type="button" onClick={handleLogoutClick}>
            Salir
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
