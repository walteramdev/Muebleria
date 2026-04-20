import { useEffect, useMemo, useRef, useState } from "react";
import Footer from "../components/Footer";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const sectionIds = ["inicio", "colecciones", "destacados", "manifiesto", "cierre"];
const indicatorIds = sectionIds.slice(0, 4);

const backgroundImages = {
  hero:
    "https://wrfefas.my.canva.site/_assets/media/787090af7cd9a097a130f1f82951a959.jpg",
  collections:
    "https://images.pexels.com/photos/29252626/pexels-photo-29252626.jpeg?auto=compress&cs=tinysrgb&w=1600",
  featured:
    "https://images.pexels.com/photos/1537750/pexels-photo-1537750.jpeg?auto=compress&cs=tinysrgb&w=1600",
  manifesto:
    "https://images.pexels.com/photos/2983198/pexels-photo-2983198.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const HomePage = ({
  categoryDefinitions = [],
  onSelectProduct = () => {},
  products = [],
  isLoading = false,
  error = null,
}) => {
  const sectionRefs = useRef({});
  const homeRef = useRef(null);
  const scrollLockRef = useRef(false);
  const animationFrameRef = useRef(null);
  const touchStartRef = useRef(null);
  const [activeSection, setActiveSection] = useState("inicio");

  const categoryShowcase = useMemo(
    () =>
      categoryDefinitions.map((category) => ({
        ...category,
        featuredProduct: products.find((product) => product.category === category.name),
      })),
    [categoryDefinitions, products],
  );

  const featuredRow = products.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.45, 0.6, 0.78],
      },
    );

    const sections = sectionIds
      .map((sectionId) => sectionRefs.current[sectionId])
      .filter(Boolean);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const stopAnimation = () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const getSections = () =>
      sectionIds
        .map((sectionId) => sectionRefs.current[sectionId])
        .filter(Boolean);

    const getCurrentSectionIndex = () => {
      const sections = getSections();
      const viewportAnchor = window.scrollY + window.innerHeight * 0.35;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, index) => {
        const distance = Math.abs(section.offsetTop - viewportAnchor);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    const animateScrollTo = (targetSectionId) => {
      const targetSection = sectionRefs.current[targetSectionId];

      if (!targetSection) {
        return;
      }

      stopAnimation();
      scrollLockRef.current = true;

      const startY = window.scrollY;
      const targetY = targetSection.offsetTop;
      const distance = targetY - startY;

      if (Math.abs(distance) < 4) {
        window.scrollTo({ top: targetY, behavior: "auto" });
        setActiveSection(targetSectionId);
        scrollLockRef.current = false;
        return;
      }

      const duration = 1150;
      const startTime = performance.now();
      const easeInOutCubic = (progress) =>
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo({
          top: startY + distance * easedProgress,
          behavior: "auto",
        });

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(step);
          return;
        }

        animationFrameRef.current = null;
        setActiveSection(targetSectionId);
        scrollLockRef.current = false;
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    };

    const isDesktop = () => window.matchMedia("(min-width: 961px)").matches;

    const jumpToSection = (direction) => {
      const currentIndex = getCurrentSectionIndex();
      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        sectionIds.length - 1,
      );

      if (nextIndex === currentIndex) {
        return;
      }

      animateScrollTo(sectionIds[nextIndex]);
    };

    const handleWheel = (event) => {
      if (!isDesktop()) {
        return;
      }

      if (!homeRef.current?.contains(event.target)) {
        return;
      }

      if (scrollLockRef.current) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < 22) {
        return;
      }

      event.preventDefault();
      jumpToSection(event.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (event) => {
      touchStartRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event) => {
      if (!isDesktop()) {
        return;
      }

      const touchStart = touchStartRef.current;
      const touchEnd = event.changedTouches[0]?.clientY ?? null;

      if (touchStart === null || touchEnd === null || scrollLockRef.current) {
        return;
      }

      const delta = touchStart - touchEnd;

      if (Math.abs(delta) < 42) {
        return;
      }

      jumpToSection(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      stopAnimation();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const handleSectionJump = (sectionId) => {
    const targetSection = sectionRefs.current[sectionId];

    if (!targetSection) {
      return;
    }

    scrollLockRef.current = true;

    const startY = window.scrollY;
    const targetY = targetSection.offsetTop;
    const distance = targetY - startY;
    const duration = 1150;
    let startTime = null;
    const easeInOutCubic = (progress) =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const step = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo({
        top: startY + distance * easedProgress,
        behavior: "auto",
      });

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      animationFrameRef.current = null;
      setActiveSection(sectionId);
      scrollLockRef.current = false;
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  };

  return (
    <main className="home-page home-page--immersive" ref={homeRef}>
      <nav className="home-side-nav" aria-label="Secciones del inicio">
        {indicatorIds.map((sectionId, index) => (
          <button
            key={sectionId}
            type="button"
            className={`home-side-nav__dot ${activeSection === sectionId ? "is-active" : ""}`}
            onClick={() => handleSectionJump(sectionId)}
            aria-label={`Ir a la seccion ${index + 1}`}
          />
        ))}
      </nav>

      <section
        ref={(element) => {
          sectionRefs.current.inicio = element;
        }}
        className="home-screen home-screen--hero"
        id="inicio"
        style={{ "--screen-background": `url(${backgroundImages.hero})` }}
      >
        <div className="home-screen__overlay home-screen__overlay--hero" />
        <div className="home-screen__content home-screen__content--hero">
          <div className="home-immersive-hero__copy">
            <p className="eyebrow eyebrow--light">Chenille Casa y Mobiliario</p>
            <span className="hero-kicker">Coleccion curada para el hogar</span>
            <h1>Muebles pensados para habitar con calma.</h1>
            <p className="home-immersive-hero__text">
              Piezas contemporaneas para living, comedor y dormitorio, con una
              seleccion pensada para espacios serenos, funcionales y propios.
            </p>
            <div className="home-immersive-hero__actions">
              <a className="hero-shop-button" href="/productos">
                Ver coleccion
              </a>
              <span className="hero-note">Living, comedor y dormitorio</span>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={(element) => {
          sectionRefs.current.colecciones = element;
        }}
        className="home-screen home-screen--collections"
        id="colecciones"
        style={{ "--screen-background": `url(${backgroundImages.collections})` }}
      >
        <div className="home-screen__overlay" />
        <div className="home-screen__content home-screen__content--wide is-active-panel">
          <div className="screen-heading screen-heading--light screen-heading--compact">
            <p className="eyebrow eyebrow--light">Colecciones</p>
            <h2>Tres atmósferas para habitar la casa.</h2>
          </div>

          <div className="category-spotlight-row">
            {categoryShowcase.map((category) => (
              <article className="category-spotlight-card" key={category.name}>
                <div className="category-spotlight-card__media">
                  <img
                    src={category.featuredProduct?.imagenUrl || backgroundImages.collections}
                    alt={category.name}
                  />
                </div>
                <div className="category-spotlight-card__body">
                  <h3>{category.name}</h3>
                  <p>{category.shortDescription}</p>
                  <ul className="category-spotlight-card__tags">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory}>{subcategory}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={(element) => {
          sectionRefs.current.destacados = element;
        }}
        className="home-screen home-screen--featured"
        id="destacados"
        style={{ "--screen-background": `url(${backgroundImages.featured})` }}
      >
        <div className="home-screen__overlay" />
        <div className="home-screen__content home-screen__content--wide is-active-panel">
          <div className="screen-heading screen-heading--light screen-heading--compact">
            <p className="eyebrow eyebrow--light">Destacados</p>
            <h2>Selección que define a Chenille.</h2>
          </div>

          {isLoading && <p className="state-message state-message--light">Cargando productos...</p>}
          {!isLoading && error && (
            <p className="state-message state-message--light state-error">{error}</p>
          )}

          {!isLoading && !error && (
            <div className="featured-spotlight-row">
              {featuredRow.map((product) => (
                <article className="featured-spotlight-card" key={product._id}>
                  <div className="featured-spotlight-card__media">
                    <img src={product.imagenUrl} alt={product.name} />
                  </div>
                  <div className="featured-spotlight-card__body">
                    <p className="product-card__category product-card__category--light">
                      {product.category}
                    </p>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="featured-spotlight-card__footer">
                      <strong>{formatPrice(product.price)}</strong>
                      <button
                        type="button"
                        className="featured-spotlight-card__link"
                        onClick={() => onSelectProduct(product)}
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        ref={(element) => {
          sectionRefs.current.manifiesto = element;
        }}
        className="home-screen home-screen--manifesto"
        id="manifiesto"
        style={{ "--screen-background": `url(${backgroundImages.manifesto})` }}
      >
        <div className="home-screen__overlay home-screen__overlay--soft" />
        <div className="home-screen__content home-screen__content--manifesto">
          <div className="manifesto-mark" aria-hidden="true">
            <svg viewBox="0 0 120 120" role="img">
              <path
                d="M28 68c0-20 13-34 32-34s32 14 32 34"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M24 68h72v24c0 6.6-5.4 12-12 12H36c-6.6 0-12-5.4-12-12z"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M42 50v-8c0-10 8-18 18-18s18 8 18 18v8"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="eyebrow eyebrow--light">Manifiesto</p>
          <h2>Diseño calido para espacios que se viven de verdad.</h2>
          <p className="story-copy story-copy--light">
            Menos ruido visual, mas hogar. Chenille busca proponer interiores
            serenos, táctiles y nobles, donde cada pieza acompaña lo cotidiano con
            equilibrio y calma.
          </p>
        </div>
      </section>

      <section
        ref={(element) => {
          sectionRefs.current.cierre = element;
        }}
        className="home-screen home-screen--footer"
        id="cierre"
      >
        <div className="home-screen__content home-screen__content--footer">
          <Footer variant="immersive" />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
