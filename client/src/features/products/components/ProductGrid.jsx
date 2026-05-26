import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import "../../../styles/cardEspecial.css";
const ProductGrid = ({
  products,
  selectedCategory,
  onSelectProduct,
  onAddToCart,
  showCreateCard = false,
  currentUser = null,
}) => {
  const navigate = useNavigate();
  return (
    <section className="catalog-grid catalog-grid--immersive">
      {products.length === 0 && (
        <article className="catalog-card catalog-card--empty">
          <div className="catalog-card__body">
            <p className="product-card__category">{selectedCategory}</p>
            <h2>No hay productos en este filtro por ahora.</h2>
            <p className="catalog-card__description">
              Todavía no cargamos piezas para esta combinación.
            </p>
          </div>
        </article>
      )}

      {currentUser?.role === "admin" && showCreateCard && (
        <article
          className="catalog-card catalog-card--add-product"
          onClick={() => navigate("/createProduct")}
        >
          <div className="catalog-card__body">
            <p className="product-card__category">Administración</p>

            <h2>Agregar nuevo producto</h2>

            <p className="catalog-card__description">
              Crear un nuevo producto para el catálogo.
            </p>

            <button className="add-product-btn">+ Crear producto</button>
          </div>
        </article>
      )}

      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
        />
      ))}
    </section>
  );
};

export default ProductGrid;
