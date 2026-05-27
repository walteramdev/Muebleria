import { useMemo, useState, useEffect, useRef } from "react";
import CatalogHero from "./CatalogHero";
import CatalogCollectionHeader from "./CatalogCollectionHeader";
import CatalogSubcategoryFilters from "./CatalogSubcategoryFilters";
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
  onSelectProduct = () => {},
  // onAddToCart = () => {},
  onCategorySelect = () => {},
  onSubcategorySelect = () => {},
  currentUser = null,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productSectionRef = useRef(null);
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
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory]);

  const selectedCategoryDefinition = categoryDefinitions.find(
    (category) => category.name === selectedCategory,
  );

  // const firstPageCapacity = PRODUCTS_PER_PAGE - 1;
  const showCreateCard = currentPage === 1 && currentUser?.role === "admin";
  const firstPageCapacity = showCreateCard
    ? PRODUCTS_PER_PAGE - 1
    : PRODUCTS_PER_PAGE;

  const remainingProducts = Math.max(0, products.length - firstPageCapacity);

  const totalPages = 1 + Math.ceil(remainingProducts / PRODUCTS_PER_PAGE);

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    // Página 1
    if (safeCurrentPage === 1) {
      return products.slice(0, firstPageCapacity);
    }

    // Productos ya usados en página 1
    const startIndex =
      firstPageCapacity + (safeCurrentPage - 2) * PRODUCTS_PER_PAGE;

    return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [products, safeCurrentPage, firstPageCapacity]);

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
    <main className="catalog-page catalog-page--immersive">
      <CatalogHero
        selectedCategory={selectedCategory}
        categories={categories}
        onCategorySelect={onCategorySelect}
      />

      <section
        className="catalog-screen catalog-screen--products"
        ref={productSectionRef}
      >
        <div className="catalog-collection-shell">
          <CatalogCollectionHeader
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            selectedCategoryDefinition={selectedCategoryDefinition}
          />

          {selectedCategoryDefinition && (
            <CatalogSubcategoryFilters
              selectedCategoryDefinition={selectedCategoryDefinition}
              selectedSubcategory={selectedSubcategory}
              availableSubcategories={availableSubcategories}
              onSubcategorySelect={onSubcategorySelect}
            />
          )}

          <ProductGrid
            products={paginatedProducts}
            selectedCategory={selectedCategory}
            onSelectProduct={onSelectProduct}
            // onAddToCart={onAddToCart}
            showCreateCard={showCreateCard}
          />

          <CatalogPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            productsSectionRef={productSectionRef}
          />
        </div>
      </section>
    </main>
  );
};

export default CatalogPage;
