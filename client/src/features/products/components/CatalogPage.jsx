import { useMemo, useState, useEffect, useRef } from "react";
import CatalogCollectionHeader from "./CatalogCollectionHeader";
import ProductGrid from "./ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { getAllProducts } from "../../../services/productService";

const PRODUCTS_PER_PAGE = 6;

const CatalogPage = ({
  categoryDefinitions = [],
  selectedCategory = "Todos",
  selectedSubcategory = "",
  availableSubcategories = [],
  categories = [],
  onSelectProduct = () => { },
  // onAddToCart = () => {},
  onCategorySelect = () => { },
  onSubcategorySelect = () => { },
  currentUser = null,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem("catalogCurrentPage");
    console.log("CatalogPage [INIT]: savedPage from sessionStorage is:", savedPage);
    return savedPage ? parseInt(savedPage, 10) : 1;
  });

  const handlePageChange = (page) => {
    console.log("CatalogPage [handlePageChange]: called with:", page);
    if (typeof page === "function") {
      setCurrentPage((prev) => {
        const nextPage = page(prev);
        console.log("CatalogPage [handlePageChange]: functional nextPage:", nextPage);
        sessionStorage.setItem("catalogCurrentPage", nextPage.toString());
        return nextPage;
      });
    } else {
      setCurrentPage(page);
      console.log("CatalogPage [handlePageChange]: static page:", page);
      sessionStorage.setItem("catalogCurrentPage", page.toString());
    }
  };

  const productSectionRef = useRef(null);
  const prevCategory = useRef();
  const prevSubcategory = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("CatalogPage [Category Effect]: prevCategory =", prevCategory.current, "selectedCategory =", selectedCategory, "prevSubcategory =", prevSubcategory.current, "selectedSubcategory =", selectedSubcategory);
    if (prevCategory.current !== undefined) {
      if (
        prevCategory.current !== selectedCategory ||
        prevSubcategory.current !== selectedSubcategory
      ) {
        console.log("CatalogPage [Category Effect]: Genuinely changed! Resetting page to 1");
        setCurrentPage(1);
        sessionStorage.setItem("catalogCurrentPage", "1");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
    prevCategory.current = selectedCategory;
    prevSubcategory.current = selectedSubcategory;
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    console.log("CatalogPage [Restoration Effect]: loading =", loading, "products.length =", products.length);
    if (!loading && products.length > 0) {
      const savedScroll = sessionStorage.getItem("catalogScrollPosition");
      const savedPage = sessionStorage.getItem("catalogCurrentPage");
      console.log("CatalogPage [Restoration Effect]: checking savedScroll =", savedScroll, "savedPage =", savedPage);
      if (savedScroll) {
        const scrollY = parseInt(savedScroll, 10);
        setTimeout(() => {
          console.log("CatalogPage [Restoration Effect]: scrolling to", scrollY);
          const htmlEl = document.documentElement;
          const originalScrollBehavior = htmlEl.style.scrollBehavior;
          htmlEl.style.scrollBehavior = "auto";
          window.scrollTo(0, scrollY);
          requestAnimationFrame(() => {
            htmlEl.style.scrollBehavior = originalScrollBehavior;
          });
        }, 50);
        sessionStorage.removeItem("catalogScrollPosition");
      }
    }
  }, [loading, products]);

  const selectedCategoryDefinition = categoryDefinitions.find(
    (category) => category.name === selectedCategory,
  );

  const isAdmin = currentUser?.role === "admin";
  const firstPageCapacity = isAdmin
    ? PRODUCTS_PER_PAGE - 1
    : PRODUCTS_PER_PAGE;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory === "Todos") return true;
      return product.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [products, selectedCategory]);

  const remainingProducts = Math.max(0, filteredProducts.length - firstPageCapacity);

  const totalPages = 1 + Math.ceil(remainingProducts / PRODUCTS_PER_PAGE);

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const showCreateCard = safeCurrentPage === 1 && isAdmin;

  const paginatedProducts = useMemo(() => {
    // Página 1
    if (safeCurrentPage === 1) {
      return filteredProducts.slice(0, firstPageCapacity);
    }

    // Productos ya usados en página 1
    const startIndex =
      firstPageCapacity + (safeCurrentPage - 2) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage, firstPageCapacity]);

  const renderStateScreen = (title, message, isError = false) => {
    const bgImage = "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600";
    return (
      <main className="info-page info-page--brand" style={{ paddingBottom: 0 }}>
        <section className="editorial-page-hero">
          <div className="editorial-page-hero__media" style={{ filter: 'grayscale(100%) brightness(0.4)' }}>
            <img src={bgImage} alt="Fondo de estado" />
          </div>
          <div className="editorial-page-hero__overlay editorial-page-hero__overlay--soft" />

          <div className="editorial-page-hero__content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 0, margin: '0 auto', maxWidth: 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFF8F2', marginBottom: '16px' }}>{title}</h2>
            <p style={{ color: 'rgba(255, 248, 242, 0.8)', fontSize: '1.1rem', marginBottom: '8px', maxWidth: '500px' }}>{message}</p>
            {isError && <p style={{ color: 'rgba(255, 248, 242, 0.5)', fontSize: '0.95rem' }}>Por favor, recarga la página o intenta nuevamente más tarde.</p>}
          </div>
        </section>
      </main>
    );
  };

  if (loading) return renderStateScreen("Preparando colección", "Cargando catálogo de piezas...");
  if (error) return renderStateScreen("No pudimos conectar", `Error de conexión: ${error}`, true);

  return (
    <main className="catalog-page catalog-page--ecommerce">
      <nav className="catalog-category-nav">
        <div className="catalog-category-nav__inner">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`catalog-category-nav__item ${category === selectedCategory ? "is-active" : ""}`}
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>

      <section
        className="catalog-screen catalog-screen--ecommerce-products"
        ref={productSectionRef}
      >
        <div className="catalog-collection-shell">
          <CatalogCollectionHeader selectedCategory={selectedCategory} />

          <ProductGrid
            products={paginatedProducts}
            selectedCategory={selectedCategory}
            onSelectProduct={onSelectProduct}
            // onAddToCart={onAddToCart}
            showCreateCard={showCreateCard}
            currentUser={currentUser}
          />

          <CatalogPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            productsSectionRef={productSectionRef}
          />
        </div>
      </section>
    </main>
  );
};

export default CatalogPage;
