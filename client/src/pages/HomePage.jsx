import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import Footer from "../components/Footer";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const sectionIds = ["inicio", "colecciones", "destacados", "manifiesto", "cierre"];
const indicatorIds = sectionIds.slice(0, 4);
const featuredMarqueeItems = [
  "Envios a todo el pais",
  "Financiacion en cuotas",
  "Madera maciza certificada",
  "Fabricacion artesanal",
  "Atencion personalizada",
];
const collectionSharedBackground = "linear-gradient(180deg, #14110f 0%, #211b18 100%)";
const chunkItems = (items, size) =>
  items.reduce((groups, item, index) => {
    if (index % size === 0) {
      groups.push(items.slice(index, index + size));
    }
    return groups;
  }, []);

const backgroundImages = {
  hero:
    "https://wrfefas.my.canva.site/_assets/media/787090af7cd9a097a130f1f82951a959.jpg",
  collections:
    "https://images.pexels.com/photos/29109688/pexels-photo-29109688.jpeg?auto=compress&cs=tinysrgb&w=1600",
  featured:
    "https://images.pexels.com/photos/7539830/pexels-photo-7539830.jpeg?auto=compress&cs=tinysrgb&w=1600",
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
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const collectionTouchStartRef = useRef(null);
  const activeSectionRef = useRef("inicio");
  const wheelLockRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimeoutRef = useRef(null);
  const [activeSection, setActiveSection] = useState("inicio");
  const [carouselItemsPerSlide, setCarouselItemsPerSlide] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 960 ? 2 : 4,
  );
  const [activeCollectionSlide, setActiveCollectionSlide] = useState(0);

  const categoryShowcase = useMemo(
    () =>
      categoryDefinitions.map((category) => ({
        ...category,
        featuredProduct: products.find((product) => product.category === category.name),
      })),
    [categoryDefinitions, products],
  );

  const collectionHeroSlides = useMemo(() => {
    const slideConfig = {
      Comedor: {
        label: "Coleccion Comedor",
        title: "El lugar donde\nse comparte todo",
        description:
          "Mesas, sillas y apoyos pensados para encuentros largos, sobremesas tranquilas y rituales cotidianos con calidez.",
        background: collectionSharedBackground,
        imagePanel: collectionSharedBackground,
        accent: "#c8814a",
      },
      Living: {
        label: "Coleccion Living",
        title: "Diseñado para\nvivir de verdad",
        description:
          "Sillones, consolas y piezas nobles para recibir, descansar y construir una escena serena todos los dias.",
        background: collectionSharedBackground,
        imagePanel: collectionSharedBackground,
        accent: "#c8814a",
      },
      Dormitorio: {
        label: "Coleccion Dormitorio",
        title: "Descanso con\ncarácter propio",
        description:
          "Respaldos, mesas de luz y comodas que abrigan el descanso con una presencia suave, intima y funcional.",
        background: collectionSharedBackground,
        imagePanel: collectionSharedBackground,
        accent: "#c8814a",
      },
    };

    return ["Comedor", "Living", "Dormitorio"]
      .map((categoryName) => {
        const category = categoryShowcase.find((item) => item.name === categoryName);
        const config = slideConfig[categoryName];

        if (!category || !config) {
          return null;
        }

        return {
          ...config,
          key: categoryName,
          categoryName,
          image: category.featuredProduct?.imagenUrl || backgroundImages.collections,
          subcategories: category.subcategories,
        };
      })
      .filter(Boolean);
  }, [categoryShowcase]);

  const featuredSlides = useMemo(
    () => chunkItems(products.slice(0, 8), carouselItemsPerSlide),
    [products, carouselItemsPerSlide],
  );
  const activeCollection = collectionHeroSlides[activeCollectionSlide] || null;

  useEffect(() => {
    const updateItemsPerSlide = () => {
      setCarouselItemsPerSlide(window.innerWidth <= 960 ? 2 : 4);
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  useEffect(() => {
    if (collectionHeroSlides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveCollectionSlide((current) => (current + 1) % collectionHeroSlides.length);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [collectionHeroSlides.length]);

  useEffect(() => {
    if (activeCollectionSlide >= collectionHeroSlides.length && collectionHeroSlides.length > 0) {
      setActiveCollectionSlide(0);
    }
  }, [activeCollectionSlide, collectionHeroSlides.length]);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 961px)").matches;
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
        root: isDesktop ? homeRef.current : null,
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
    const isDesktop = window.matchMedia("(min-width: 961px)").matches;
    const wrapper = homeRef.current;
    const content = contentRef.current;

    if (!wrapper || !content || !isDesktop) {
      return undefined;
    }

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    let animationFrameId = null;

    const onFrame = (time) => {
      lenis.raf(time);
      animationFrameId = window.requestAnimationFrame(onFrame);
    };

    animationFrameId = window.requestAnimationFrame(onFrame);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const wrapper = homeRef.current;

    if (!wrapper) {
      return undefined;
    }

    const goToSection = (sectionId) => {
      const targetSection = sectionRefs.current[sectionId];

      if (!targetSection || !lenisRef.current) {
        return;
      }

      lenisRef.current.scrollTo(targetSection, {
        duration: 1.1,
        easing: (value) => 1 - Math.pow(1 - value, 3),
      });
    };

    const stepSection = (direction) => {
      const currentIndex = sectionIds.findIndex(
        (sectionId) => sectionId === activeSectionRef.current,
      );

      if (currentIndex === -1) {
        return;
      }

      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        sectionIds.length - 1,
      );

      if (nextIndex === currentIndex) {
        return;
      }

      wheelLockRef.current = true;
      wheelDeltaRef.current = 0;
      goToSection(sectionIds[nextIndex]);

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 880);
    };

    const handleWheel = (event) => {
      const isDesktop = window.matchMedia("(min-width: 961px)").matches;

      if (!isDesktop) {
        return;
      }

      event.preventDefault();

      if (wheelLockRef.current) {
        return;
      }

      const isTouchpadLike =
        event.deltaMode === 0 && Math.abs(event.deltaY) < 40;
      const wheelThreshold = isTouchpadLike ? 34 : 90;
      const resetDelay = isTouchpadLike ? 220 : 140;

      wheelDeltaRef.current += event.deltaY;

      if (wheelResetTimeoutRef.current) {
        window.clearTimeout(wheelResetTimeoutRef.current);
      }

      wheelResetTimeoutRef.current = window.setTimeout(() => {
        wheelDeltaRef.current = 0;
      }, resetDelay);

      if (Math.abs(wheelDeltaRef.current) < wheelThreshold) {
        return;
      }

      stepSection(wheelDeltaRef.current > 0 ? 1 : -1);
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
      if (wheelResetTimeoutRef.current) {
        window.clearTimeout(wheelResetTimeoutRef.current);
      }
    };
  }, []);

  const handleSectionJump = (sectionId) => {
    const targetSection = sectionRefs.current[sectionId];

    if (!targetSection) {
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetSection, {
        duration: 1.1,
        easing: (value) => 1 - Math.pow(1 - value, 3),
      });
      return;
    }

    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCollectionPrev = () => {
    if (!collectionHeroSlides.length) {
      return;
    }

    setActiveCollectionSlide((current) =>
      current === 0 ? collectionHeroSlides.length - 1 : current - 1,
    );
  };

  const handleCollectionNext = () => {
    if (!collectionHeroSlides.length) {
      return;
    }

    setActiveCollectionSlide((current) => (current + 1) % collectionHeroSlides.length);
  };

  const handleCollectionTouchStart = (event) => {
    collectionTouchStartRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleCollectionTouchEnd = (event) => {
    const startX = collectionTouchStartRef.current;
    const endX = event.changedTouches[0]?.clientX ?? null;

    if (startX === null || endX === null) {
      collectionTouchStartRef.current = null;
      return;
    }

    const deltaX = endX - startX;

    if (Math.abs(deltaX) < 50) {
      collectionTouchStartRef.current = null;
      return;
    }

    if (deltaX < 0) {
      handleCollectionNext();
    } else {
      handleCollectionPrev();
    }

    collectionTouchStartRef.current = null;
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

      <div className="home-page__scroll-content" ref={contentRef}>
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
            <h1>Muebles pensados para habitar con calma</h1>
            <p className="home-immersive-hero__text">
              Piezas contemporaneas para living, comedor y dormitorio, con una
              seleccion pensada para espacios serenos, funcionales y propios.
            </p>
            <div className="home-immersive-hero__actions">
              <a className="hero-shop-button" href="/productos">
                Ver coleccion
              </a>
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
        onTouchStart={handleCollectionTouchStart}
        onTouchEnd={handleCollectionTouchEnd}
      >
        <div className="collections-hero-fullscreen">
          <div className="collections-hero-fullscreen__progress">
            {activeCollection && (
              <span
                key={activeCollectionSlide}
                className="collections-hero-fullscreen__progress-bar"
                style={{ "--collection-accent": activeCollection.accent }}
              />
            )}
          </div>

          {activeCollection && (
            <div className="collections-hero-fullscreen__slides">
              <article
                key={activeCollection.key}
                className="collections-hero-slide active"
                style={{
                  "--collection-bg": activeCollection.background,
                  "--collection-image-panel": activeCollection.imagePanel,
                  "--collection-accent": activeCollection.accent,
                }}
              >
                <div className="collections-hero-slide__content">
                  <p className="collections-hero-slide__label">{activeCollection.label}</p>
                  <h2 className="collections-hero-slide__title">
                    {activeCollection.title.split("\n").map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h2>
                  <p className="collections-hero-slide__description">{activeCollection.description}</p>
                  <button
                    type="button"
                    className="collections-hero-slide__cta"
                    onClick={() =>
                      handleNavigate(`/productos?categoria=${encodeURIComponent(activeCollection.categoryName)}`)
                    }
                  >
                    Ver coleccion
                  </button>
                </div>

                <div className="collections-hero-slide__visual">
                  <img src={activeCollection.image} alt={activeCollection.label} />
                </div>
              </article>
            </div>
          )}

          <div className="collections-hero-fullscreen__dots">
            {collectionHeroSlides.map((slide, index) => (
              <button
                key={slide.key}
                type="button"
                className={index === activeCollectionSlide ? "active" : ""}
                aria-label={`Ir al slide ${index + 1}`}
                onClick={() => setActiveCollectionSlide(index)}
                style={{ "--collection-accent": slide.accent }}
              />
            ))}
          </div>

          <div className="collections-hero-fullscreen__arrows">
            <button type="button" aria-label="Anterior" onClick={handleCollectionPrev}>
              ‹
            </button>
            <button type="button" aria-label="Siguiente" onClick={handleCollectionNext}>
              ›
            </button>
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
        <div className="featured-marquee" aria-hidden="true">
          <div className="featured-marquee__track">
            {[...featuredMarqueeItems, ...featuredMarqueeItems].map((item, index) => (
              <span className="featured-marquee__item" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
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
            <div
              id="featuredCarousel"
              className="carousel slide home-bootstrap-carousel"
              data-bs-ride="carousel"
              data-bs-interval="4500"
            >
              <div className="carousel-indicators home-bootstrap-carousel__indicators">
                {featuredSlides.map((slide, index) => (
                  <button
                    key={slide.map((product) => product._id).join("-")}
                    type="button"
                    data-bs-target="#featuredCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : undefined}
                    aria-label={`Grupo de destacados ${index + 1}`}
                  />
                ))}
              </div>

              <div className="carousel-inner">
                {featuredSlides.map((slide, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={slide.map((product) => product._id).join("-")}
                  >
                    <div className="home-bootstrap-carousel__track">
                      {slide.map((product) => (
                        <article className="featured-spotlight-card" key={product._id}>
                          <div className="featured-spotlight-card__media">
                            <img src={product.imagenUrl} alt={product.name} />
                          </div>
                          <div className="featured-spotlight-card__body">
                            <p className="product-card__category product-card__category--light">
                              {product.category}
                            </p>
                            <h3>{product.name}</h3>
                            <p className="featured-spotlight-card__description">
                              {product.description}
                            </p>
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
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev home-bootstrap-carousel__control"
                type="button"
                data-bs-target="#featuredCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next home-bootstrap-carousel__control"
                type="button"
                data-bs-target="#featuredCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Siguiente</span>
              </button>
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
      </div>
    </main>
  );
};

export default HomePage;
