import { useMemo } from "react"; // el useState lo borré pero se puede volver a colocar si se quiere usar el carrito en frontend sin backend real
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
// import CartPage from "./pages/CartPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

const categoryDefinitions = [
  {
    name: "Living",
    shortDescription: "Piezas para recibir, descansar y dar identidad al ambiente.",
    subcategories: ["Sillones", "Mesas ratonas", "Consolas"],
  },
  {
    name: "Comedor",
    shortDescription: "Mesas y sillas pensadas para compartir todos los dias.",
    subcategories: ["Mesas", "Sillas", "Bahiuts"],
  },
  {
    name: "Dormitorio",
    shortDescription: "Soluciones calidas para descansar y ordenar mejor.",
    subcategories: ["Respaldos", "Mesas de luz", "Comodas"],
  },
];

const productTypes = categoryDefinitions.map((category) => category.name);

// Datos de ejemplo para poder avanzar en frontend sin depender todavia del backend.
const featuredProducts = [
  {
    _id: "sillon-chenille-arena",
    barcode: "779000000001",
    name: "Sillon Chenille Arena",
    category: "Living",
    subcategory: "Sillones",
    price: 480000,
    description: "Sillon de tres cuerpos con tono calido y presencia protagonista.",
    stock: 2,
    brand: "Chenille",
    supplier: "Taller Central",
    features: {
      materiales: "Madera maciza y tapizado chenille",
      medidas: "2,10 m x 0,90 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1759722668385-90006d9c7aa7?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "consola-olmo-claro",
    barcode: "779000000002",
    name: "Consola Olmo Claro",
    category: "Living",
    subcategory: "Consolas",
    price: 268000,
    description: "Consola ligera y funcional para recibidor o apoyo decorativo.",
    stock: 4,
    brand: "Chenille",
    supplier: "Taller Central",
    features: {
      materiales: "Olmo claro con terminacion mate",
      medidas: "1,40 m x 0,38 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1758915753395-a5dddea1d813?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "mesa-noguera-central",
    barcode: "779000000003",
    name: "Mesa Noguera Central",
    category: "Comedor",
    subcategory: "Mesas",
    price: 620000,
    description: "Mesa de madera pensada para reuniones, uso diario y larga duracion.",
    stock: 3,
    brand: "Chenille",
    supplier: "Taller Central",
    features: {
      materiales: "Noguera lustrada",
      medidas: "1,80 m x 0,90 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1758977405163-f2595de08dfe?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "silla-nordica-roble",
    barcode: "779000000004",
    name: "Silla Nordica Roble",
    category: "Comedor",
    subcategory: "Sillas",
    price: 126000,
    description: "Silla de linea simple con respaldo curvo y presencia serena.",
    stock: 8,
    brand: "Chenille",
    supplier: "Taller Central",
    features: {
      materiales: "Roble y asiento tapizado",
      medidas: "0,48 m x 0,52 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1758977405163-f2595de08dfe?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "respaldo-siena",
    barcode: "779000000005",
    name: "Respaldo Siena",
    category: "Dormitorio",
    subcategory: "Respaldos",
    price: 215000,
    description: "Respaldo tapizado para sumar textura, abrigo visual y caracter.",
    stock: 4,
    brand: "Chenille",
    supplier: "Tapiceria Norte",
    features: {
      materiales: "Tapizado con estructura reforzada",
      medidas: "1,60 m x 1,20 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1734965158024-d7419f9260b7?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
  {
    _id: "mesa-luz-bruma",
    barcode: "779000000006",
    name: "Mesa de Luz Bruma",
    category: "Dormitorio",
    subcategory: "Mesas de luz",
    price: 154000,
    description: "Mesa compacta con cajon y estante abierto para uso diario.",
    stock: 5,
    brand: "Chenille",
    supplier: "Tapiceria Norte",
    features: {
      materiales: "Madera paraiso laqueada",
      medidas: "0,52 m x 0,38 m",
    },
    imagenUrl:
      "https://images.unsplash.com/photo-1734965158024-d7419f9260b7?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
  },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  /*
  // Aca guardamos el carrito completo mientras no exista persistencia real.
  const [cartItems, setCartItems] = useState([]);
  */

  /*
  // Convierte un numero en formato de precio argentino para mostrarlo en pantalla.
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  */

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

  /*
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
  */

  const ProductDetailRoute = () => {
    const { id } = useParams();
    // Busca el producto correcto segun el id que vino en la URL.
    const product = featuredProducts.find((item) => item._id === id);

    return (
      <ProductDetailPage
        product={product}
        onBack={() => navigate("/productos")}
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

  /*
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  */

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
                  : ""
        }
        cartEnabled={true}
        isOverlay
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
        {/*
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
        */}
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
