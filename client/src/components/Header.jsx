import React, { useEffect, useMemo, useState } from "react";
import "../css/header.css";

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
  const [activeProductsCategory, setActiveProductsCategory] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

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
    setActiveProductsCategory("");
  };

  const handleNavClick = (sectionId) => (event) => {
    event.preventDefault();
    closeProductsMenu();
    onNavigate(sectionId);
  };

  const toggleProductsMenu = () => {
    setIsProductsMenuOpen((prev) => {
      const nextState = !prev;

      if (!nextState) {
        setActiveProductsCategory("");
      }

      return nextState;
    });
  };

  const openProductsMenu = () => {
    setIsProductsMenuOpen(true);
  };

  const resolvedProductsCategory = useMemo(() => {
    if (
      activeProductsCategory &&
      categoryDefinitions.some((category) => category.name === activeProductsCategory)
    ) {
      return activeProductsCategory;
    }

    return "";
  }, [activeProductsCategory, categoryDefinitions]);

  const activeCategoryData = categoryDefinitions.find(
    (category) => category.name === resolvedProductsCategory,
  );

  const handleCategoryPanelToggle = (categoryName) => {
    setActiveProductsCategory((currentCategory) =>
      currentCategory === categoryName ? "" : categoryName,
    );
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
              className={`nav-dropdown__menu ${isProductsMenuOpen ? "open" : ""} ${activeCategoryData ? "has-detail" : ""}`}
            >
              <div className="nav-dropdown__panel nav-dropdown__panel--primary">
                {categoryDefinitions.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    className={`nav-dropdown__item ${resolvedProductsCategory === category.name ? "is-active" : ""}`}
                    onMouseEnter={() => setActiveProductsCategory(category.name)}
                    onFocus={() => setActiveProductsCategory(category.name)}
                    onClick={() => handleCategoryPanelToggle(category.name)}
                  >
                    <span>{category.name}</span>
                    <span className="nav-dropdown__arrow" aria-hidden="true">
                      {">"}
                    </span>
                  </button>
                ))}
              </div>

              {activeCategoryData && (
                <div className="nav-dropdown__panel nav-dropdown__panel--secondary">
                  <button
                    type="button"
                    className="nav-dropdown__heading"
                    onClick={handleNavClick(
                      `/productos?categoria=${encodeURIComponent(activeCategoryData.name)}`,
                    )}
                  >
                    {activeCategoryData.name}
                  </button>
                  <div className="nav-dropdown__subitems">
                    {activeCategoryData.subcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        type="button"
                        className="nav-dropdown__subitem"
                        onClick={handleNavClick(
                          `/productos?categoria=${encodeURIComponent(activeCategoryData.name)}`,
                        )}
                      >
                        {subcategory}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="nav-dropdown__subitem nav-dropdown__subitem--view-all"
                      onClick={handleNavClick(
                        `/productos?categoria=${encodeURIComponent(activeCategoryData.name)}`,
                      )}
                    >
                      Ver todo {activeCategoryData.name}
                    </button>
                  </div>
                </div>
              )}
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
