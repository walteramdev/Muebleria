import { useMemo, useState, useEffect } from "react";
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
  onAddToCart = () => {},
  onCategorySelect = () => {},
  onSubcategorySelect = () => {},
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / PRODUCTS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [products, safeCurrentPage]);

  if (loading) return <p>Cargando catálogo...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="catalog-page catalog-page--immersive">
      <CatalogHero
        selectedCategory={selectedCategory}
        categories={categories}
        onCategorySelect={onCategorySelect}
      />

      <section className="catalog-screen catalog-screen--products">
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
            onAddToCart={onAddToCart}
          />

          <CatalogPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </main>
  );
};

export default CatalogPage;
