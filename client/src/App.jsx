import { React, useMemo, useContext, useEffect, useState } from "react";
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
  categoryDefinitions as staticCategoryDefinitions,
  productTypes as staticProductTypes,
  featuredProducts,
} from "./utils/mockData.js";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "../auth/AuthProvider.jsx";
import { AuthContext } from "../auth/AuthContext.js";
import { getCategories } from "./services/categoryService";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/productos") {
      const savedScroll = sessionStorage.getItem("catalogScrollPosition");
      if (savedScroll) {
        // Let CatalogPage restore scroll once products are fully loaded
        return;
      } else {
        // Clear active page state on a fresh catalog visit
        sessionStorage.removeItem("catalogCurrentPage");
      }
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ProductDetailRoute = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const product = featuredProducts.find((item) => item._id === id);

  const handleBack = () => {
    const backPath = sessionStorage.getItem("productDetailBackPath");
    if (backPath === "destacados") {
      navigate("/");
      window.setTimeout(() => {
        document
          .getElementById("destacados")
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      }, 80);
    } else if (backPath) {
      navigate(backPath);
    } else {
      navigate("/productos");
    }
  };

  return (
    <ProductDetailPage
      product={product}
      onBack={handleBack}
      currentUser={user}
    />
  );
};

const CatalogRoute = ({ currentUser, categoryDefinitions, productTypes }) => {
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
    const backPath = `/productos${selectedCategory !== "Todos" ? `?categoria=${encodeURIComponent(selectedCategory)}${selectedSubcategory ? `&subcategoria=${encodeURIComponent(selectedSubcategory)}` : ""}` : ""}`;
    const backLabel = selectedCategory === "Todos" ? "Volver al catálogo" : `Volver a ${selectedCategory}`;
    sessionStorage.setItem("catalogScrollPosition", window.scrollY.toString());
    sessionStorage.setItem("catalogCategory", selectedCategory);
    sessionStorage.setItem("catalogSubcategory", selectedSubcategory);
    sessionStorage.setItem("productDetailBackPath", backPath);
    sessionStorage.setItem("productDetailBackLabel", backLabel);
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

  const [categoryDefinitionsState, setCategoryDefinitionsState] = useState(staticCategoryDefinitions);
  const [productTypesState, setProductTypesState] = useState(staticProductTypes);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data && data.categories) {
          const merged = data.categories.map((dbCat) => {
            const staticMatch = staticCategoryDefinitions.find(
              (s) => s.name.toLowerCase() === dbCat.name.toLowerCase()
            );
            return {
              _id: dbCat._id,
              name: dbCat.name,
              image: dbCat.image || staticMatch?.image || "",
              shortDescription: staticMatch?.shortDescription || "Muebles de excelente diseño y calidad.",
              subcategories: staticMatch?.subcategories || [],
            };
          });
          setCategoryDefinitionsState(merged);
          setProductTypesState(merged.map((c) => c.name));
        }
      } catch (err) {
        console.error("Error al cargar categorías dinámicas:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleNavigate = (destination) => {
    if (destination.startsWith("/productos")) {
      sessionStorage.removeItem("catalogCurrentPage");
      sessionStorage.removeItem("catalogScrollPosition");
    }

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
    sessionStorage.setItem("productDetailBackPath", "destacados");
    sessionStorage.setItem("productDetailBackLabel", "Volver a destacados");
    sessionStorage.removeItem("catalogCategory");
    sessionStorage.removeItem("catalogSubcategory");
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
        categoryDefinitions={categoryDefinitionsState}
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
        isOverlay
        currentUser={user}
        onLogout={handleLogoutClick}
        locationPathname={location.pathname}
      />

      <Routes>
        {/* Route varios */}
        <Route
          path="/"
          element={
            <HomePage
              categoryDefinitions={categoryDefinitionsState}
              products={featuredProducts}
              isLoading={false}
              error={null}
              onSelectProduct={handleSelectProduct}
              currentUser={user}
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
          element={<CatalogRoute currentUser={user} categoryDefinitions={categoryDefinitionsState} productTypes={productTypesState} />}
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
              categoryDefinitions={categoryDefinitionsState}
              onSelectProduct={handleSelectProduct}
              currentUser={user}
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
