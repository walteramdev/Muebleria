import { useMemo } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import { categoryDefinitions, productTypes, featuredProducts } from "./utils/mockData.js";

const ProductDetailRoute = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = featuredProducts.find((item) => item._id === id);

  return (
    <ProductDetailPage
      product={product}
      onBack={() => navigate("/productos")}
    />
  );
};

const CatalogRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("categoria") || "Todos";
  const selectedSubcategory = searchParams.get("subcategoria") || "";

  const visibleProducts = useMemo(() => {
    return featuredProducts.filter((item) => {
      const categoryMatches =
        selectedCategory === "Todos" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const subcategoryMatches =
        !selectedSubcategory ||
        item.subcategory.toLowerCase() === selectedSubcategory.toLowerCase();

      return categoryMatches && subcategoryMatches;
    });
  }, [selectedCategory, selectedSubcategory]);

  const selectedCategoryDefinition = categoryDefinitions.find(
    (category) => category.name.toLowerCase() === selectedCategory.toLowerCase(),
  );

  const availableSubcategories = selectedCategoryDefinition?.subcategories ?? [];

  const handleSelectProduct = (product) => {
    navigate(`/productos/${product._id}`);
  };

  const handleSubcategorySelect = (subcategory) => {
    if (!selectedCategoryDefinition) {
      return;
    }

    if (!subcategory) {
      navigate(`/productos?categoria=${encodeURIComponent(selectedCategoryDefinition.name)}`);
      return;
    }

    navigate(
      `/productos?categoria=${encodeURIComponent(selectedCategoryDefinition.name)}&subcategoria=${encodeURIComponent(subcategory)}`,
    );
  };

  return (
    <CatalogPage
      categoryDefinitions={categoryDefinitions}
      products={visibleProducts}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      availableSubcategories={availableSubcategories}
      categories={["Todos", ...productTypes]}
      onSelectProduct={handleSelectProduct}
      onCategorySelect={(category) => {
        if (category === "Todos") {
          navigate("/productos");
          return;
        }

        navigate(`/productos?categoria=${encodeURIComponent(category)}`);
      }}
      onSubcategorySelect={handleSubcategorySelect}
    />
  );
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (destination) => {
    if (destination.startsWith("/")) {
      navigate(destination);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => {
        document
          .getElementById(destination)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }

    document
      .getElementById(destination)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectProduct = (product) => {
    navigate(`/productos/${product._id}`);
  };

  return (
    <>
      <Header
        onNavigate={handleNavigate}
        categoryDefinitions={categoryDefinitions}
        activeView={
          location.pathname === "/"
            ? "home"
            : location.pathname.startsWith("/productos")
              ? "catalog"
              : location.pathname === "/nosotros"
                ? "about"
                : location.pathname === "/contacto"
                  ? "contact"
                  : ""
        }
        cartEnabled={true}
        isOverlay
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              categoryDefinitions={categoryDefinitions}
              products={featuredProducts}
              isLoading={false}
              error={null}
              onSelectProduct={handleSelectProduct}
            />
          }
        />
        <Route
          path="/productos"
          element={<CatalogRoute />}
        />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/productos/:id" element={<ProductDetailRoute />} />
        <Route
          path="*"
          element={
            <HomePage
              categoryDefinitions={categoryDefinitions}
              products={featuredProducts}
              isLoading={false}
              error={null}
              onSelectProduct={handleSelectProduct}
            />
          }
        />
      </Routes>
      {location.pathname !== "/" && location.pathname !== "/contacto" && (
        <div className="shared-footer-shell">
          <Footer variant="immersive" />
        </div>
      )}
    </>
  );
}

export default App;
