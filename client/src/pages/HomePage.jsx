import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import Footer from "../layouts/Footer";
import HeroSection from "../components/home/HeroSection";
import CollectionsSection from "../components/home/CollectionsSection";
import FeaturedSection from "../components/home/FeaturedSection";
import ManifestoSection from "../components/home/ManifestoSection";

import { formatPrice } from "../utils/formatters.js";

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
      <HeroSection
        sectionRef={(element) => {
          sectionRefs.current.inicio = element;
        }}
        backgroundImage={backgroundImages.hero}
      />

      <CollectionsSection
        sectionRef={(element) => {
          sectionRefs.current.colecciones = element;
        }}
        onTouchStart={handleCollectionTouchStart}
        onTouchEnd={handleCollectionTouchEnd}
        activeCollection={activeCollection}
        activeCollectionSlide={activeCollectionSlide}
        collectionHeroSlides={collectionHeroSlides}
        setActiveCollectionSlide={setActiveCollectionSlide}
        handleCollectionPrev={handleCollectionPrev}
        handleCollectionNext={handleCollectionNext}
      />

      <FeaturedSection
        sectionRef={(element) => {
          sectionRefs.current.destacados = element;
        }}
        backgroundImage={backgroundImages.featured}
        featuredMarqueeItems={featuredMarqueeItems}
        isLoading={isLoading}
        error={error}
        featuredSlides={featuredSlides}
        formatPrice={formatPrice}
        onSelectProduct={onSelectProduct}
      />

      <ManifestoSection
        sectionRef={(element) => {
          sectionRefs.current.manifiesto = element;
        }}
        backgroundImage={backgroundImages.manifesto}
      />

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
