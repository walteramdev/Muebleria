import { React, useMemo, useContext, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  Navigate,
} from "react-router-dom";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import CatalogPage from "./features/products/components/CatalogPage.jsx";
import ProductDetailPage from "./features/products/components/ProductDetailPage.jsx";
import ProductForm from "./features/products/components/ProductForm.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ProtectedRoute from "./features/users/admin/ProtectedRoute.jsx";
import {
  categoryDefinitions,
  productTypes,
  featuredProducts,
} from "./utils/mockData.js";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "../auth/AuthProvider.jsx";
import { AuthContext } from "../auth/AuthContext.js";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

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

const CatalogRoute = ({ currentUser }) => {
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
    (category) =>
      category.name.toLowerCase() === selectedCategory.toLowerCase(),
  );

  const availableSubcategories =
    selectedCategoryDefinition?.subcategories ?? [];

  const handleSelectProduct = (product) => {
    navigate(`/productos/${product._id}`);
  };

  const handleSubcategorySelect = (subcategory) => {
    if (!selectedCategoryDefinition) {
      return;
    }

    if (!subcategory) {
      navigate(
        `/productos?categoria=${encodeURIComponent(selectedCategoryDefinition.name)}`,
      );
      return;
    }

    navigate(
      `/productos?categoria=${encodeURIComponent(selectedCategoryDefinition.name)}&subcategoria=${encodeURIComponent(subcategory)}`,
    );
  };

  return (
    <CatalogPage
      currentUser={currentUser}
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

// function AppContent() {}

function AppContent() {
  const { user, logout, login } = useContext(AuthContext);
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

  const onLoginSuccess = (tokenData) => {
    login(tokenData);
    navigate("/");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  return (
    <>
      <ScrollToTop />
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
                  : location.pathname === "/iniciar-sesion"
                    ? "login"
                    : ""
        }
        cartEnabled={true}
        isOverlay
        currentUser={user}
        onLogout={handleLogoutClick}
      />

      <Routes>
        {/* Route varios */}
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
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        {/* Routes product */}
        <Route
          path="/createProduct"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos/editar/:id"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos"
          element={<CatalogRoute currentUser={user} />}
        />
        <Route path="/productos/:id" element={<ProductDetailRoute />} />
        {/* Route user */}
        <Route
          path="/iniciar-sesion"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLoginSuccess={onLoginSuccess} />
            )
          }
        />

        {/* Route no encontrada */}
        <Route
          path="*"
          element={
            <HomePage
              categoryDefinitions={categoryDefinitions}
              onSelectProduct={handleSelectProduct}
            />
          }
        />
      </Routes>
      {location.pathname !== "/" && (
        <div className="shared-footer-shell">
          <Footer variant="immersive" />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
export default App;
