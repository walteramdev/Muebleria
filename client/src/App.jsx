import { useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // Aca guardamos el carrito completo mientras no exista persistencia real.
  const [cartItems, setCartItems] = useState([]);

  // Convierte un numero en formato de precio argentino para mostrarlo en pantalla.
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);

  const handleNavigate = (destination) => {
    // Si recibe una ruta, navega a otra pagina.
    if (destination.startsWith("/")) {
      navigate(destination);
      return;
    }

    // Si estamos fuera de la home, primero vuelve y despues hace scroll a la seccion.
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
    // Cada producto abre su detalle usando el id en la URL.
    navigate(`/productos/${product._id}`);
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);

      // Si el producto ya estaba, solo aumenta la cantidad.
      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateQuantity = (productId, nextQuantity) => {
    // Si la cantidad baja a 0, conviene quitarlo del carrito.
    if (nextQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item._id !== productId));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const ProductDetailRoute = () => {
    const { id } = useParams();
    // Busca el producto correcto segun el id que vino en la URL.
    const product = featuredProducts.find((item) => item._id === id);

    return (
      <ProductDetailPage
        product={product}
        onBack={() => navigate("/productos")}
        onAddToCart={handleAddToCart}
      />
    );
  };

  const CatalogRoute = () => {
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get("categoria") || "Todos";
    const selectedSubcategory = searchParams.get("subcategoria") || "";

    // Filtra en memoria los productos segun la categoria elegida en la URL.
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
        onAddToCart={handleAddToCart}
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

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Header siempre visible: recibe la seccion activa y el estado del carrito. */}
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
              : location.pathname === "/carrito"
                ? "cart"
              : ""
        }
        cartCount={cartCount}
        cartEnabled={false}
        isOverlay
        onClearCart={handleClearCart}
        onViewCart={() => navigate("/carrito")}
      />
      <Routes>
        {/* Home principal */}
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
        {/* Catalogo con categorias */}
        <Route
          path="/productos"
          element={<CatalogRoute />}
        />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        {/* Detalle individual de cada producto */}
        <Route path="/productos/:id" element={<ProductDetailRoute />} />
        {/* Resumen del carrito */}
        <Route
          path="/carrito"
          element={
            <CartPage
              cartItems={cartItems}
              totalLabel={formatPrice(cartTotal)}
              onContinueShopping={() => navigate("/productos")}
              onClearCart={handleClearCart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          }
        />
        {/* Cualquier ruta desconocida vuelve a la home por ahora */}
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
