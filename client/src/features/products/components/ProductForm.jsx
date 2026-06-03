import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import "../../../styles/admin.css";
import "../../../styles/Product.css";
import { getCategories } from "../../../services/categoryService";

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

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [categoryOptions, setCategoryOptions] = useState([]);
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [showConfirmEditModal, setShowConfirmEditModal] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategoryOptions(data.categories.map((c) => c.name));
      } catch (err) {
        console.error("Error al cargar categorías en el formulario:", err);
        setCategoryOptions(["Living", "Comedor", "Dormitorio"]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (images && images.length > 0 && fieldErrors.images) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated.images;
        return updated;
      });
    }
  }, [images, fieldErrors.images]);

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
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
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
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/products/${id}`,
          { credentials: "include" },
        );

        if (!response.ok) throw new Error("Error cargando producto");

        const data = await response.json();

        const product = data.product;

        const initialInfo = {
          formData: {
            barcode: product.barcode || "",
            name: product.name || "",
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            price: product.price || "",
            stock: product.stock || "",
            category: product.category || "",
          },
          features: product.features || {},
          images: product.images || [],
        };

        setFormData(initialInfo.formData);
        setFeatures(initialInfo.features);
        setImages(initialInfo.images);
        setInitialData(initialInfo);
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

  const hasChanges = () => {
    if (!initialData) return true;

    const keys = Object.keys(formData);
    for (const key of keys) {
      const currentVal = String(formData[key] ?? "").trim();
      const initialVal = String(initialData.formData[key] ?? "").trim();
      if (currentVal !== initialVal) {
        return true;
      }
    }

    const initialFilteredFeatures = Object.fromEntries(
      Object.entries(initialData.features || {}).filter(([, value]) => {
        return typeof value === "string" && value.trim() !== "";
      }),
    );
    const currentFeaturesKeys = Object.keys(filteredFeatures);
    const initialFeaturesKeys = Object.keys(initialFilteredFeatures);

    if (currentFeaturesKeys.length !== initialFeaturesKeys.length) {
      return true;
    }

    for (const key of currentFeaturesKeys) {
      if ((filteredFeatures[key] || "").trim() !== (initialFilteredFeatures[key] || "").trim()) {
        return true;
      }
    }

    const currentImages = images || [];
    const initialImages = initialData.images || [];
    if (currentImages.length !== initialImages.length) {
      return true;
    }
    for (let i = 0; i < currentImages.length; i++) {
      if (currentImages[i] !== initialImages[i]) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const requiredFields = [
      "name",
      "barcode",
      "description",
      "price",
      "stock",
      "category",
    ];
    const errors = {};
    let firstFailedField = null;

    requiredFields.forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        errors[field] = "Completar campo";
        if (!firstFailedField) {
          firstFailedField = field;
        }
      }
    });

    if (!images || images.length === 0) {
      errors.images = "Completar campo";
      if (!firstFailedField) {
        firstFailedField = "images-dropzone-group";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const element = document.getElementById(firstFailedField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        if (element.focus && firstFailedField !== "images-dropzone-group") {
          element.focus();
        }
      }
      return;
    }
    if (isEditMode) {
      if (hasChanges()) {
        setShowConfirmEditModal(true);
      } else {
        executeSave();
      }
    } else {
      executeSave();
    }
  };

  const executeSave = async () => {
    setShowConfirmEditModal(false);
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
        ? `${API_BASE_URL}/products/${id}`
        : `${API_BASE_URL}/products`;

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
      navigate(getCancelRedirectPath());
    } catch (err) {
      console.error("Error al guardar:", err);
      if (err.message === "Failed to fetch" || err.message === "NetworkError when attempting to fetch resource.") {
        setError("Error con el servidor. Intente nuevamente.");
      } else {
        setError(err.message || "Hubo un problema al guardar el producto");
      }
    } finally {
      setLoading(false);
    }
  };

  const getCancelRedirectPath = () => {
    if (isEditMode) {
      return `/productos/${id}`;
    }
    const cat = sessionStorage.getItem("catalogCategory");
    const sub = sessionStorage.getItem("catalogSubcategory");
    if (cat && cat !== "Todos") {
      return `/productos?categoria=${encodeURIComponent(cat)}${sub ? `&subcategoria=${encodeURIComponent(sub)}` : ""}`;
    }
    return "/productos";
  };

  return (
    <div className="container-global">
      <div className="container">
        <Link to={getCancelRedirectPath()} className="back-link" style={{ marginBottom: "20px", display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {isEditMode ? "volver al producto" : "volver al catálogo"}
        </Link>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Datos Básicos</h3>

            <div className="form-group">
              <label htmlFor="name">Nombre <span style={{ color: "var(--color-rose, #C95D4E)", marginLeft: "4px" }}>*</span></label>
              {fieldErrors.name && (
                <span className="field-error-msg" style={{ color: "var(--color-rose, #C95D4E)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Completar campo
                </span>
              )}
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="barcode">Código de barras <span style={{ color: "var(--color-rose, #C95D4E)", marginLeft: "4px" }}>*</span></label>
              {fieldErrors.barcode && (
                <span className="field-error-msg" style={{ color: "var(--color-rose, #C95D4E)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Completar campo
                </span>
              )}
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descripción <span style={{ color: "var(--color-rose, #C95D4E)", marginLeft: "4px" }}>*</span></label>
              {fieldErrors.description && (
                <span className="field-error-msg" style={{ color: "var(--color-rose, #C95D4E)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Completar campo
                </span>
              )}
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="shortDescription">Descripción resumida</label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio <span style={{ color: "var(--color-rose, #C95D4E)", marginLeft: "4px" }}>*</span></label>
              {fieldErrors.price && (
                <span className="field-error-msg" style={{ color: "var(--color-rose, #C95D4E)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Completar campo
                </span>
              )}
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock <span style={{ color: "var(--color-rose, #C95D4E)", marginLeft: "4px" }}>*</span></label>
              {fieldErrors.stock && (
                <span className="field-error-msg" style={{ color: "var(--color-rose, #C95D4E)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Completar campo
                </span>
              )}
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoría <span style={{ color: "var(--color-rose, #C95D4E)", marginLeft: "4px" }}>*</span></label>
              {fieldErrors.category && (
                <span className="field-error-msg" style={{ color: "var(--color-rose, #C95D4E)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Completar campo
                </span>
              )}
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Seleccionar categoría</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" id="images-dropzone-group">
              <label>Imágenes <span style={{ color: "var(--color-rose, #C95D4E)", marginLeft: "4px" }}>*</span></label>
              {fieldErrors.images && (
                <span className="field-error-msg" style={{ color: "var(--color-rose, #C95D4E)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Completar campo
                </span>
              )}
              <div
                className="image-drop-zone"
                id="images-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <p>Arrastrá imágenes aquí</p>
              </div>
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

          {error && (
            <p className="error-message" style={{ marginBottom: "20px", width: "100%", padding: "12px", background: "rgba(201, 93, 78, 0.1)", borderLeft: "4px solid #C95D4E", color: "#C95D4E", borderRadius: "4px", fontSize: "0.95rem" }}>
              {error}
            </p>
          )}

          <div className="form-actions" style={{ display: "flex", gap: "16px" }}>
            <button type="button" className="btn-cancel" onClick={() => navigate(getCancelRedirectPath())}>
              Cancelar
            </button>
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

      {showConfirmEditModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <h3>¿Guardar cambios?</h3>
            <p>¿Estás seguro de que deseas aplicar los cambios modificados en el producto?</p>
            <div className="custom-modal-actions">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowConfirmEditModal(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-modal-confirm" onClick={executeSave}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductForm;
