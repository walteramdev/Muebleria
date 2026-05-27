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

  if (loading) return <p>Cargando catálogo...</p>;
  if (error) return <p>Error: {error}</p>;

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
            currentUser={currentUser}
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
