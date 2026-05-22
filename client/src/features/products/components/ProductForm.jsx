import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
const AVAILABLE_FEATURES = [
  { value: "medidas", label: "Medidas" },
  { value: "materiales", label: "Materiales" },
  { value: "acabado", label: "Acabado" },
  { value: "peso", label: "Peso" },
  { value: "capacidad", label: "Capacidad" },
  { value: "modulares", label: "Modulares" },
  { value: "tapizado", label: "Tapizado" },
  { value: "confort", label: "Confort" },
  { value: "rotacion", label: "Rotación" },
  { value: "garantia", label: "Garantía" },
  { value: "almacenamiento", label: "Almacenamiento" },
  { value: "colchon", label: "Colchón" },
  { value: "sostenibilidad", label: "Sostenibilidad" },
  { value: "extension", label: "Extensión" },
  { value: "apilables", label: "Apilables" },
  { value: "incluye", label: "Incluye" },
  { value: "cables", label: "Cables" },
  { value: "certificación", label: "Certificación" },
  { value: "regulación", label: "Regulación" },
  { value: "caracteristica", label: "Característica" },
];

const CATEGORY_OPTIONS = ["Living", "Comedor", "Dormitorio"];

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    supplier: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [features, setFeatures] = useState({});
  const [selectedFeature, setSelectedFeature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "muebleria_unsigned");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dueakzjkm/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Error en upload: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Error al subir imagen");
      }

      return data;
    } catch (err) {
      setError(`Error al subir imagen: ${err.message}`);
      return null;
    }
  };
  const getOptimizedImage = (image) => {
    const publicId = typeof image === "object" ? image.public_id : image;

    if (!publicId) {
      console.warn("No public_id provided for image optimization");
      return "";
    }

    return `https://res.cloudinary.com/dueakzjkm/image/upload/w_800,h_800,c_pad,g_auto,f_auto,q_auto/${publicId}`;
  };
  const handleDrop = async (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("Por favor, arrastra solo archivos de imagen.");
      return;
    }

    for (let file of imageFiles) {
      setUploading(true);
      const data = await uploadToCloudinary(file);

      if (data && data.secure_url && data.public_id) {
        setImages((prev) => [
          ...prev,
          {
            url: data.secure_url,
            public_id: data.public_id,
          },
        ]);
      }
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (featureName, value) => {
    setFeatures((prev) => ({
      ...prev,
      [featureName]: value,
    }));
  };

  const handleAddFeature = () => {
    if (selectedFeature && !features[selectedFeature]) {
      setFeatures((prev) => ({
        ...prev,
        [selectedFeature]: "",
      }));
      setSelectedFeature("");
    }
  };
  const handleRemoveFeature = (featureName) => {
    setFeatures((prev) => {
      const updated = { ...prev };
      delete updated[featureName];
      return updated;
    });
  };
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          { credentials: "include" },
        );

        if (!response.ok) throw new Error("Error cargando producto");

        const data = await response.json();

        const product = data.product;

        setFormData({
          barcode: product.barcode || "",
          name: product.name || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          category: product.category || "",
        });
        setFeatures(product.features || {});
        setImages(product.images || []);
      } catch (err) {
        setError("No se pudo cargar el producto", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  const filteredFeatures = Object.fromEntries(
    Object.entries(features).filter(([, value]) => {
      return typeof value === "string" && value.trim() !== "";
    }),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!images || images.length === 0) {
      setError("Debe agregar al menos una imagen al producto.");
      return;
    }

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
        ...(Object.keys(filteredFeatures).length > 0 && {
          features: filteredFeatures,
        }),
      };

      console.log("Enviando datos:", JSON.stringify(productData, null, 2));
      setLoading(true);

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `http://localhost:5000/api/products/${id}`
        : `http://localhost:5000/api/products`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
        credentials: "include",
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error del servidor:", responseData);
        throw new Error(
          responseData.message ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      console.log("Producto guardado:", responseData);
      navigate("/products");
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.message || "Hubo un problema al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-global">
      <div className="container">
        <h1>{isEditMode ? "Editar Producto" : "Crear Producto"}</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Datos Básicos</h3>

            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="barcode">Codigo de barras</label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="shortDescription">Descripción resumida</label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoría</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="image-drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <p>Arrastrá imágenes aquí</p>
            </div>

            {uploading && <p>Subiendo imagen...</p>}

            <div className="image-preview">
              {images && images.length > 0 ? (
                images.map((img, index) => (
                  <div key={index} className="image-item">
                    <img
                      src={getOptimizedImage(img)}
                      alt={`producto-${index}`}
                      className="product-image"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      className="delete-image-btn"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-images">No hay imágenes subidas</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Características (Opcional)</h3>

            <div className="add-feature">
              <select
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(e.target.value)}
              >
                <option value="">Seleccionar característica...</option>

                {AVAILABLE_FEATURES.filter(
                  (feature) => !features[feature.value],
                ).map((feature) => (
                  <option key={feature.value} value={feature.value}>
                    {feature.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddFeature}
                disabled={!selectedFeature}
              >
                + Agregar
              </button>
            </div>

            <div className="features-list">
              {Object.keys(features).map((featureName) => {
                const featureLabel =
                  AVAILABLE_FEATURES.find((f) => f.value === featureName)
                    ?.label || featureName;

                return (
                  <div key={featureName} className="feature-item">
                    <label>{featureLabel}</label>

                    <div className="feature-input-group">
                      <input
                        type="text"
                        value={features[featureName]}
                        onChange={(e) =>
                          handleFeatureChange(featureName, e.target.value)
                        }
                        placeholder={`Ingresar ${featureLabel.toLowerCase()}`}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(featureName)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : isEditMode
                  ? "Actualizar Producto"
                  : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
