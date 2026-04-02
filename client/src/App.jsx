import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
// import ProductForm from "./features/products/ProductForm";
// import ProductList from "./features/products/ProductList.jsx";
import Homepage from "./pages/HomePage.jsx";
// import ProductsPage from "./pages/ProductPage.jx";
// import SalesPage from "./pages/SalesPage.jsx";
import PruebaPage from "./pages/PruebaPage";

function App() {
  // const navigate = useNavigate();
  const isLoading =
    productsState.status === "loading" || productsState.status === "idle";
  return (
    <>
      <Header />
      <Routes>
        {/* <Route path="/" element={<PruebaPage />} /> */}
        <Route
          path="/"
          element={
            <HomePage
              // onSelectProduct={showProductDetail}
              products={products}
              isLoading={isLoading}
              error={fetchError}
            />
          }
        />
        {/* 
        <Route path="/create-product" element={<ProductForm />} />
        <Route path="/product-list" element={<ProductsPage />} />
        <Route path="/products/edit/:id" element={<ProductForm />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
