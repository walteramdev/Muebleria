import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import Footer from "../layouts/Footer";
import HeroSection from "../components/home/HeroSection";
import CollectionsSection from "../components/home/CollectionsSection";
import FeaturedSection from "../components/home/FeaturedSection";
import ManifestoSection from "../components/home/ManifestoSection";

import { formatPrice } from "../utils/formatters.js";
import "../styles/home.css";

const sectionIds = [
  "inicio",
  "colecciones",
  "destacados",
  "manifiesto",
  "cierre",
];
const indicatorIds = sectionIds.slice(0, 4);
const chunkItems = (items, size) =>
  items.reduce((groups, item, index) => {
    if (index % size === 0) {
      groups.push(items.slice(index, index + size));
    }
    return groups;
  }, []);

const backgroundImages = {
  hero: "https://wrfefas.my.canva.site/_assets/media/787090af7cd9a097a130f1f82951a959.jpg",
  collections:
    "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&w=1600&q=80",
  featured:
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=80",
  manifesto:
    "https://images.pexels.com/photos/2983198/pexels-photo-2983198.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const collectionCategories = [
  {
    name: "Outdoor",
    fallbackImage:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-25T00:00:00Z", // Menos de 2 semanas (Nueva)
  },
  {
    name: "Living",
    fallbackImage:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-10T00:00:00Z", // Más de 2 semanas
  },
  {
    name: "Sofás",
    fallbackImage:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-10T00:00:00Z",
  },
  {
    name: "Comedor",
    fallbackImage:
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-10T00:00:00Z",
  },
  {
    name: "Dormitorio",
    fallbackImage:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-10T00:00:00Z",
  },
];

const HomePage = ({
  categoryDefinitions = [],
  onSelectProduct = () => {},
  products = [],
  isLoading = false,
  error = null,
  currentUser = null,
}) => {
  const sectionRefs = useRef({});
  const homeRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const activeSectionRef = useRef("inicio");
  const wheelLockRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const wheelResetTimeoutRef = useRef(null);
  const [activeSection, setActiveSection] = useState("inicio");
  const [carouselItemsPerSlide, setCarouselItemsPerSlide] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 960 ? 2 : 4,
  );

  const categoryShowcase = useMemo(
    () =>
      categoryDefinitions.map((category) => ({
        ...category,
        featuredProduct: products.find(
          (product) => product.category === category.name,
        ),
      })),
    [categoryDefinitions, products],
  );

  const collections = useMemo(() => {
    return categoryDefinitions.map((cat) => {
      const categoryData = categoryShowcase.find(
        (item) => item.name.toLowerCase() === cat.name.toLowerCase(),
      );
      const fallbackCat = collectionCategories.find(
        (c) => c.name.toLowerCase() === cat.name.toLowerCase()
      );
      return {
        id: cat.name,
        name: cat.name,
        image: cat.image || categoryData?.featuredProduct?.imagenUrl || fallbackCat?.fallbackImage || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
        createdAt: cat.createdAt || fallbackCat?.createdAt || null,
      };
    });
  }, [categoryDefinitions, categoryShowcase]);

  const featuredSlides = useMemo(
    () => chunkItems(products.slice(0, 8), carouselItemsPerSlide),
    [products, carouselItemsPerSlide],
  );

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
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 961px)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          )[0];

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
          collections={collections}
          backgroundImage={backgroundImages.collections}
        />

        <FeaturedSection
          sectionRef={(element) => {
            sectionRefs.current.destacados = element;
          }}
          backgroundImage={backgroundImages.featured}
          isLoading={isLoading}
          error={error}
          featuredSlides={featuredSlides}
          formatPrice={formatPrice}
          onSelectProduct={onSelectProduct}
          currentUser={currentUser}
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
