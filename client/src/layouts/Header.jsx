import React, { useEffect, useRef, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/header.css";

const featuredMarqueeItems = [
  "Envios a todo el pais",
  "Financiacion en cuotas",
  "Madera maciza certificada",
  "Fabricacion artesanal",
  "Atencion personalizada",
];

const Header = ({
  onNavigate = () => {},
  categoryDefinitions = [],

  activeView = "home",
  isOverlay = false,
  currentUser = null,
  onLogout = () => {},
  locationPathname = "",
}) => {
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const closeProductsMenuTimeoutRef = useRef(null);
  const productsMenuRef = useRef(null);

  const { cartItems } = useContext(CartContext);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const scrollContainer =
      activeView === "home"
        ? document.querySelector(".home-page--immersive")
        : window;

    const getScrollTop = () =>
      scrollContainer === window
        ? window.scrollY
        : (scrollContainer?.scrollTop ?? 0);

    let lastScrollY = getScrollTop();

    const handleScroll = () => {
      const currentScrollY = getScrollTop();

      if (currentScrollY <= 120) {
        setIsHeaderVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY + 8) {
        setIsHeaderVisible(false);
        setIsProductsMenuOpen(false);
      } else if (currentScrollY < lastScrollY - 8) {
        setIsHeaderVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    scrollContainer?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [activeView, locationPathname]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 0;
      setHeaderHeight(height);
      document.documentElement.style.setProperty(
        "--header-height",
        `${height}px`,
      );
    };

    updateHeaderHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateHeaderHeight)
        : null;

    if (headerRef.current && resizeObserver) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    setIsHeaderVisible(true);
  }, [locationPathname]);

  useEffect(
    () => () => {
      if (closeProductsMenuTimeoutRef.current) {
        window.clearTimeout(closeProductsMenuTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProductsMenuOpen &&
        productsMenuRef.current &&
        !productsMenuRef.current.contains(event.target) &&
        !event.target.closest(".nav-dropdown")
      ) {
        setIsProductsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProductsMenuOpen]);

  const clearProductsMenuCloseTimeout = () => {
    if (closeProductsMenuTimeoutRef.current) {
      window.clearTimeout(closeProductsMenuTimeoutRef.current);
      closeProductsMenuTimeoutRef.current = null;
    }
  };

  const closeProductsMenu = () => {
    clearProductsMenuCloseTimeout();
    setIsProductsMenuOpen(false);
  };

  const scheduleProductsMenuClose = () => {
    clearProductsMenuCloseTimeout();
    closeProductsMenuTimeoutRef.current = window.setTimeout(() => {
      setIsProductsMenuOpen(false);
      closeProductsMenuTimeoutRef.current = null;
    }, 60);
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
    if (isProductsMenuOpen) {
      closeProductsMenu();
      return;
    }

    clearProductsMenuCloseTimeout();
    setIsProductsMenuOpen(true);
  };

  const openProductsMenu = () => {
    clearProductsMenuCloseTimeout();
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
      ref={headerRef}
      className={`main-header-wrapper ${isOverlay ? "is-overlay" : ""} ${isHeaderVisible ? "" : "is-hidden"}`}
    >
      <div className="featured-marquee" aria-hidden="true">
        <div className="featured-marquee__track">
          {[...featuredMarqueeItems, ...featuredMarqueeItems].map(
            (item, index) => (
              <span className="featured-marquee__item" key={`${item}-${index}`}>
                {item}
              </span>
            ),
          )}
        </div>
      </div>
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
          <div className="nav-dropdown">
            <button
              type="button"
              className={isActive("catalog") ? "active" : ""}
              onClick={toggleProductsMenu}
              aria-expanded={isProductsMenuOpen}
            >
              Productos
            </button>
          </div>
          {/* {currentUser && (
            <button
              type="button"
              className={isActive("sales") ? "active" : ""}
              onClick={handleNavClick("/ventas")}
            >
              Ventas
            </button>
          )} */}
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

          {currentUser?.role === "client" && (
            <button
              type="button"
              className={`cart-button ${isActive("cart") ? "active" : ""}`}
              onClick={handleNavClick("/carrito")}
              aria-label={`Abrir carrito (${totalItems} productos)`}
            >
              <div className="cart-icon-container">
                <img
                  className="iconCart"
                  src="/carrito.svg"
                  alt=""
                  aria-hidden="true"
                />

                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </div>
            </button>
          )}

          {currentUser ? (
            <>
              {/* <button
                type="button"
                className={isActive("profile") ? "active" : ""}
                onClick={handleNavClick("profile")}
              >
                PERFIL
              </button> */}
              <button
                type="button"
                onClick={(event) => {
                  handleLogoutClick();
                  handleNavClick("/iniciar-sesion")(event);
                }}
              >
                Cerrar Sesion
              </button>
            </>
          ) : (
            <>
              {/* <button
                type="button"
                className={isActive("register") ? "active" : ""}
                onClick={handleNavClick("register")}
              >
                REGISTRO
              </button> */}
              <button
                type="button"
                className={isActive("login") ? "active" : ""}
                onClick={handleNavClick("/iniciar-sesion")}
              >
                ACCEDER
              </button>
            </>
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
              href="https://www.instagram.com/chenillemuebles?igsh=dDZ2aTN3MTd5OWZ0"
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
              href="https://wa.me/5493804660709"
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
        </div>
      </header>

      <div
        className={`nav-dropdown__menu ${isProductsMenuOpen ? "open" : ""}`}
        ref={productsMenuRef}
      >
        <div className="nav-dropdown__bar">
          {categoryDefinitions.map((category, index) => (
            <button
              key={category.name}
              type="button"
              className={`nav-dropdown__item ${
                index === 0
                  ? "nav-dropdown__item--start"
                  : index === categoryDefinitions.length - 1
                    ? "nav-dropdown__item--end"
                    : "nav-dropdown__item--middle"
              }`}
              onClick={handleNavClick(
                `/productos?categoria=${encodeURIComponent(category.name)}`,
              )}
            >
              <span className="nav-dropdown__item-name">{category.name}</span>
              <span className="nav-dropdown__item-link">Ver coleccion</span>
            </button>
          ))}
          <button
            type="button"
            className="nav-dropdown__all"
            onClick={handleNavClick("/productos")}
          >
            Ver todo
          </button>
        </div>
      </div>

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
              {isMobileProductsOpen ? "-" : "+"}
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
        {/* {currentUser && (
          <button type="button" onClick={handleNavClick("/ventas")}>
            Ventas
          </button>
        )} */}
        <button type="button" onClick={handleNavClick("/contacto")}>
          Contacto
        </button>
        {currentUser ? (
          <button type="button" onClick={handleLogoutClick}>
            Salir
          </button>
        ) : (
          <button type="button" onClick={handleNavClick("/iniciar-sesion")}>
            Acceder
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
