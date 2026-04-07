import { useMemo, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import heroImage from "./assets/hero.png";

const productTypes = ["Living", "Comedor", "Dormitorio"];

// Datos de ejemplo para poder avanzar en frontend sin depender todavia del backend.
const featuredProducts = [
  {
    id: "sillon-chenille-arena",
    name: "Sillon Chenille Arena",
    category: "Living",
    price: 480000,
    priceLabel: "$ 480.000",
    description: "Sillon de tres cuerpos con tono calido y presencia protagonista.",
    material: "Madera maciza y tapizado chenille",
    size: "2,10 m x 0,90 m",
    stock: "Disponible a pedido",
    image: heroImage,
  },
  {
    id: "mesa-noguera-central",
    name: "Mesa Noguera Central",
    category: "Comedor",
    price: 620000,
    priceLabel: "$ 620.000",
    description: "Mesa de madera pensada para reuniones, uso diario y larga duracion.",
    material: "Noguera lustrada",
    size: "1,80 m x 0,90 m",
    stock: "3 unidades",
    image: heroImage,
  },
  {
    id: "respaldo-siena",
    name: "Respaldo Siena",
    category: "Dormitorio",
    price: 215000,
    priceLabel: "$ 215.000",
    description: "Respaldo tapizado para sumar textura, abrigo visual y caracter.",
    material: "Tapizado con estructura reforzada",
    size: "1,60 m x 1,20 m",
    stock: "Disponible",
    image: heroImage,
  },
];

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
    navigate(`/productos/${product.id}`);
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      // Si el producto ya estaba, solo aumenta la cantidad.
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
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
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const ProductDetailRoute = () => {
    const { id } = useParams();
    // Busca el producto correcto segun el id que vino en la URL.
    const product = featuredProducts.find((item) => item.id === id);

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

    // Filtra en memoria los productos segun la categoria elegida en la URL.
    const visibleProducts = useMemo(() => {
      if (selectedCategory === "Todos") {
        return featuredProducts;
      }

      return featuredProducts.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }, [selectedCategory]);

    return (
      <CatalogPage
        products={visibleProducts}
        selectedCategory={selectedCategory}
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
        productTypes={productTypes}
        activeView={
          location.pathname === "/"
            ? "home"
            : location.pathname.startsWith("/productos")
              ? "catalog"
              : location.pathname === "/carrito"
                ? "cart"
              : ""
        }
        cartCount={cartCount}
        onClearCart={handleClearCart}
        onViewCart={() => navigate("/carrito")}
      />
      <Routes>
        {/* Home principal */}
        <Route
          path="/"
          element={
            <HomePage
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
              products={featuredProducts}
              isLoading={false}
              error={null}
              onSelectProduct={handleSelectProduct}
            />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
