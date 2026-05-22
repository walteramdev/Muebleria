import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../../services/productService";

import "../../../styles/Product.css";

const ProductDetailPage = ({ onBack = () => {}, onAddToCart = () => {} }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro que querés eliminar este producto?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar producto");
      }

      alert("Producto eliminado correctamente");
      navigate("/productos");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("Hubo un problema al eliminar el producto");
    }
  };

  const getOptimizedImage = (imageData, size = 800) => {
    // Maneja tanto objetos {public_id, url} como strings
    const publicId =
      typeof imageData === "object" ? imageData.public_id : imageData;

    if (!publicId) {
      console.warn("No public_id available for image optimization");
      return "";
    }

    return `https://res.cloudinary.com/dueakzjkm/image/upload/w_${size},h_${size},c_fill,g_auto,f_auto,q_auto,b_white/${publicId}`;
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);

  // 🔹 Fetch del producto por ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);

        if (data.images && data.images.length > 0) {
          setSelectedImage(getOptimizedImage(data.images[0], 800));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <main className="detail-page">
        <p>Cargando producto...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="detail-page">
        <p>Error: {error}</p>
        <button type="button" className="btn-primary" onClick={onBack}>
          Volver al catálogo
        </button>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="detail-page">
        <h1>No encontramos ese producto.</h1>
        <button type="button" className="btn-primary" onClick={onBack}>
          Volver al catálogo
        </button>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <button type="button" className="back-link" onClick={onBack}>
        Volver al catálogo
      </button>

      <section className="detail-layout">
        <div className="detail-media">
          {/* Imagen principal */}
          <div className="detail-main-image">
            <img
              src={selectedImage}
              alt={product.name}
              className="detail-main-image__img"
            />
          </div>

          {product.images && product.images.length > 0 && (
            <div className="detail-thumbnails">
              {product.images.map((img) => {
                const thumbUrl = getOptimizedImage(img, 200);
                const fullUrl = getOptimizedImage(img, 800);

                return (
                  <button
                    key={img._id || img.public_id}
                    type="button"
                    className={`detail-thumbnail ${
                      selectedImage === fullUrl ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(fullUrl)}
                  >
                    <img src={thumbUrl} alt={product.name} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="detail-content">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">
            {product.description || product.shortDescription}
          </p>

          <div className="detail-summary">
            <div>
              <span className="detail-summary__label">Marca</span>
              <strong>{product.brand || "A definir"}</strong>
            </div>

            <div>
              <span className="detail-summary__label">Proveedor</span>
              <strong>{product.supplier || "A definir"}</strong>
            </div>

            <div>
              <span className="detail-summary__label">Stock</span>
              <strong>{product.stock} unidad(es)</strong>
            </div>

            {product.features &&
              Object.entries(product.features).map(([key, value]) => (
                <div key={key}>
                  <span className="detail-summary__label">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <strong>{value}</strong>
                </div>
              ))}
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => onAddToCart(product)}
            >
              Agregar al carrito
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>
              Seguir mirando
            </button>
            <button
              className="edit-product-btn"
              onClick={() => navigate(`/productos/editar/${id}`)}
            >
              Editar producto
            </button>
            <button className="delete-product-btn" onClick={handleDelete}>
              Eliminar producto
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
