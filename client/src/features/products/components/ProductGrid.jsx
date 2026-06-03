import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import "../../../styles/cardEspecial.css";
const ProductGrid = ({
  products,
  selectedCategory,
  selectedSubcategory = "",
  onSelectProduct,
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
          onClick={() => {
            sessionStorage.setItem("catalogCategory", selectedCategory);
            sessionStorage.setItem("catalogSubcategory", selectedSubcategory);
            navigate("/createProduct");
          }}
        >
          <div className="catalog-card__body">
            <h2>Agregar nuevo producto</h2>

            <p className="catalog-card__description">
              Crear un nuevo producto para el catálogo.
            </p>
          </div>
          <div className="catalog-card__footer">
            <button className="add-product-btn" style={{ width: "100%", margin: 0 }}>Crear producto</button>
          </div>
        </article>
      )}

      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onSelectProduct={onSelectProduct}
          currentUser={currentUser}
        />
      ))}
    </section>
  );
};

export default ProductGrid;
