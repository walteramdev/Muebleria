import { useMemo, useState, useEffect, useRef } from "react";
import CatalogCollectionHeader from "./CatalogCollectionHeader";
import ProductGrid from "./ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { getAllProducts } from "../../../services/productService";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../../services/categoryService";
import "../../../styles/catalog.css";

const PRODUCTS_PER_PAGE = 6;

const CatalogPage = ({
  categoryDefinitions = [],
  selectedCategory = "Todos",
  selectedSubcategory = "",
  availableSubcategories = [],
  categories = [],
  onSelectProduct = () => { },
  // onAddToCart = () => {},
  onCategorySelect = () => { },
  onSubcategorySelect = () => { },
  currentUser = null,
  onCategoryAdded = () => { },
  onCategoryUpdated = () => { },
  onCategoryDeleted = () => { },
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [uploadingCategoryImg, setUploadingCategoryImg] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState("");
  const [categoryFormSuccess, setCategoryFormSuccess] = useState(false);

  // Estados para Edición de Categoría
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editCategoryObj, setEditCategoryObj] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState("");
  const [uploadingEditCategoryImg, setUploadingEditCategoryImg] = useState(false);
  const [editCategoryFormError, setEditCategoryFormError] = useState("");
  const [editCategoryFormSuccess, setEditCategoryFormSuccess] = useState(false);

  // Estados para Eliminación de Categoría
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [deleteCategoryObj, setDeleteCategoryObj] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [deleteCategoryFormError, setDeleteCategoryFormError] = useState("");
  const [deleteCategoryFormSuccess, setDeleteCategoryFormSuccess] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem("catalogCurrentPage");
    console.log("CatalogPage [INIT]: savedPage from sessionStorage is:", savedPage);
    return savedPage ? parseInt(savedPage, 10) : 1;
  });

  const handlePageChange = (page) => {
    console.log("CatalogPage [handlePageChange]: called with:", page);
    if (typeof page === "function") {
      setCurrentPage((prev) => {
        const nextPage = page(prev);
        console.log("CatalogPage [handlePageChange]: functional nextPage:", nextPage);
        sessionStorage.setItem("catalogCurrentPage", nextPage.toString());
        return nextPage;
      });
    } else {
      setCurrentPage(page);
      console.log("CatalogPage [handlePageChange]: static page:", page);
      sessionStorage.setItem("catalogCurrentPage", page.toString());
    }
  };

  const uploadToCloudinary = async (file, isEdit = false) => {
    try {
      if (isEdit) {
        setUploadingEditCategoryImg(true);
        setEditCategoryFormError("");
      } else {
        setUploadingCategoryImg(true);
        setCategoryFormError("");
      }
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

      if (isEdit) {
        setEditCategoryImage(data.secure_url);
      } else {
        setCategoryImage(data.secure_url);
      }
    } catch (err) {
      if (isEdit) {
        setEditCategoryFormError(`Error al subir imagen: ${err.message}`);
      } else {
        setCategoryFormError(`Error al subir imagen: ${err.message}`);
      }
    } finally {
      if (isEdit) {
        setUploadingEditCategoryImg(false);
      } else {
        setUploadingCategoryImg(false);
      }
    }
  };

  const handleCategoryImgDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadToCloudinary(files[0], false);
    }
  };

  const handleCategoryImgSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadToCloudinary(files[0], false);
    }
  };

  const handleEditCategoryImgDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadToCloudinary(files[0], true);
    }
  };

  const handleEditCategoryImgSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadToCloudinary(files[0], true);
    }
  };

  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setCategoryFormError("El nombre es requerido.");
      return;
    }
    if (!categoryImage) {
      setCategoryFormError("La imagen es requerida.");
      return;
    }

    try {
      setCategoryFormError("");
      const res = await createCategory({
        name: categoryName.trim(),
        image: categoryImage,
      });

      if (onCategoryAdded) {
        onCategoryAdded(res.category);
      }

      setCategoryFormSuccess(true);
      await loadCategories();
      setCategoryName("");
      setCategoryImage("");
      setTimeout(() => {
        setShowAddCategoryModal(false);
        setCategoryFormSuccess(false);
      }, 1500);
    } catch (err) {
      if (err.message === "Failed to fetch" || err.message === "NetworkError when attempting to fetch resource.") {
        setCategoryFormError("Error con el servidor. Intente nuevamente.");
      } else {
        setCategoryFormError(err.message || "Error al crear la categoría.");
      }
    }
  };

  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    if (!editCategoryName.trim()) {
      setEditCategoryFormError("El nombre es requerido.");
      return;
    }
    if (!editCategoryImage) {
      setEditCategoryFormError("La imagen es requerida.");
      return;
    }

    try {
      setEditCategoryFormError("");
      const res = await updateCategory(editCategoryObj._id, {
        name: editCategoryName.trim(),
        image: editCategoryImage,
      });

      setEditCategoryFormSuccess(true);
      await loadCategories();
      if (onCategoryUpdated) {
        onCategoryUpdated(res.category);
      }

      if (selectedCategory.toLowerCase() === editCategoryObj.name.toLowerCase()) {
        onCategorySelect(res.category.name);
      }

      setTimeout(() => {
        setShowEditCategoryModal(false);
        setEditCategoryFormSuccess(false);
        setEditCategoryObj(null);
        setEditCategoryName("");
        setEditCategoryImage("");
      }, 1500);
    } catch (err) {
      if (err.message === "Failed to fetch" || err.message === "NetworkError when attempting to fetch resource.") {
        setEditCategoryFormError("Error con el servidor. Intente nuevamente.");
      } else {
        setEditCategoryFormError(err.message || "Error al actualizar la categoría.");
      }
    }
  };

  const handleDeleteCategorySubmit = async (e) => {
    e.preventDefault();
    if (!deleteCategoryObj) return;

    try {
      setDeleteCategoryFormError("");
      setDeletingCategory(true);
      await deleteCategory(deleteCategoryObj._id);

      setDeleteCategoryFormSuccess(true);
      await loadCategories();
      if (onCategoryDeleted) {
        onCategoryDeleted(deleteCategoryObj._id);
      }

      if (selectedCategory.toLowerCase() === deleteCategoryObj.name.toLowerCase()) {
        onCategorySelect("Todos");
      }

      setTimeout(() => {
        setShowDeleteCategoryModal(false);
        setDeleteCategoryFormSuccess(false);
        setDeleteCategoryObj(null);
        setDeletingCategory(false);
      }, 1500);
    } catch (err) {
      if (err.message === "Failed to fetch" || err.message === "NetworkError when attempting to fetch resource.") {
        setDeleteCategoryFormError("Error con el servidor. Intente nuevamente.");
      } else {
        setDeleteCategoryFormError(err.message || "Error al eliminar la categoría.");
      }
      setDeletingCategory(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setDbCategories(data.categories || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const productSectionRef = useRef(null);
  const prevCategory = useRef();
  const prevSubcategory = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
  setProducts(
          [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    console.log("CatalogPage [Category Effect]: prevCategory =", prevCategory.current, "selectedCategory =", selectedCategory, "prevSubcategory =", prevSubcategory.current, "selectedSubcategory =", selectedSubcategory);
    if (prevCategory.current !== undefined) {
      if (
        prevCategory.current !== selectedCategory ||
        prevSubcategory.current !== selectedSubcategory
      ) {
        console.log("CatalogPage [Category Effect]: Genuinely changed! Resetting page to 1");
        setCurrentPage(1);
        sessionStorage.setItem("catalogCurrentPage", "1");
        window.scrollTo(0, 0);
      }
    }
    prevCategory.current = selectedCategory;
    prevSubcategory.current = selectedSubcategory;
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    console.log("CatalogPage [Restoration Effect]: loading =", loading, "products.length =", products.length);
    if (!loading && products.length > 0) {
      const savedScroll = sessionStorage.getItem("catalogScrollPosition");
      const savedPage = sessionStorage.getItem("catalogCurrentPage");
      console.log("CatalogPage [Restoration Effect]: checking savedScroll =", savedScroll, "savedPage =", savedPage);
      if (savedScroll) {
        const scrollY = parseInt(savedScroll, 10);
        setTimeout(() => {
          console.log("CatalogPage [Restoration Effect]: scrolling to", scrollY);
          const htmlEl = document.documentElement;
          const originalScrollBehavior = htmlEl.style.scrollBehavior;
          htmlEl.style.scrollBehavior = "auto";
          window.scrollTo(0, scrollY);
          requestAnimationFrame(() => {
            htmlEl.style.scrollBehavior = originalScrollBehavior;
          });
        }, 50);
        sessionStorage.removeItem("catalogScrollPosition");
      }
    }
  }, [loading, products]);

  const selectedCategoryDefinition = categoryDefinitions.find(
    (category) => category.name.toLowerCase() === selectedCategory.toLowerCase(),
  );

  const isAdmin = currentUser?.role === "admin";
  const firstPageCapacity = isAdmin
    ? PRODUCTS_PER_PAGE - 1
    : PRODUCTS_PER_PAGE;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory === "Todos") return true;
      return product.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [products, selectedCategory]);

  const remainingProducts = Math.max(0, filteredProducts.length - firstPageCapacity);

  const totalPages = 1 + Math.ceil(remainingProducts / PRODUCTS_PER_PAGE);

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const showCreateCard = safeCurrentPage === 1 && isAdmin;

  const paginatedProducts = useMemo(() => {
    // Página 1
    if (safeCurrentPage === 1) {
      return filteredProducts.slice(0, firstPageCapacity);
    }

    // Productos ya usados en página 1
    const startIndex =
      firstPageCapacity + (safeCurrentPage - 2) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage, firstPageCapacity]);

  const renderStateScreen = (title, message, isError = false) => {
    const bgImage = "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600";
    return (
      <main className="info-page info-page--brand" style={{ paddingBottom: 0 }}>
        <section className="editorial-page-hero">
          <div className="editorial-page-hero__media" style={{ filter: 'grayscale(100%) brightness(0.4)' }}>
            <img src={bgImage} alt="Fondo de estado" />
          </div>
          <div className="editorial-page-hero__overlay editorial-page-hero__overlay--soft" />

          <div className="editorial-page-hero__content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 0, margin: '0 auto', maxWidth: 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFF8F2', marginBottom: '16px' }}>{title}</h2>
            <p style={{ color: 'rgba(255, 248, 242, 0.8)', fontSize: '1.1rem', marginBottom: '8px', maxWidth: '500px' }}>{message}</p>
            {isError && <p style={{ color: 'rgba(255, 248, 242, 0.5)', fontSize: '0.95rem' }}>Por favor, recarga la página o intenta nuevamente más tarde.</p>}
          </div>
        </section>
      </main>
    );
  };

  if (loading) return renderStateScreen("Preparando colección", "Cargando catálogo de piezas...");
  if (error) {
    const isNetworkError = error.includes("Failed to fetch") || error.includes("NetworkError") || error.includes("Load failed");
    const errorMessage = isNetworkError ? "Error con el servidor." : `Error: ${error}`;
    return renderStateScreen("No pudimos conectar", errorMessage, true);
  }

  return (
    <main className="catalog-page catalog-page--ecommerce">
      <nav className={`catalog-category-nav ${currentUser?.role === "admin" ? "catalog-category-nav--admin" : "catalog-category-nav--client"}`}>
        <div className="catalog-category-nav__inner">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`catalog-category-nav__item ${category === selectedCategory ? "is-active" : ""}`}
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
          ))}

          {currentUser?.role === "admin" && (
            <div style={{ marginLeft: "auto", display: "inline-flex", gap: "10px", alignItems: "center", alignSelf: "center", flexShrink: 0 }}>
              <button
                type="button"
                className="catalog-category-nav__item catalog-category-nav__item--edit"
                title="Editar o eliminar categoría"
                onClick={() => {
                  setEditCategoryObj(null);
                  setEditCategoryName("");
                  setEditCategoryImage("");
                  setEditCategoryFormError("");
                  setEditCategoryFormSuccess(false);
                  setShowEditCategoryModal(true);
                }}
                style={{
                  border: "1px solid var(--color-brown-accent, #B08D79)",
                  color: "var(--color-brown-accent, #B08D79)",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  padding: 0
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>

              <button
                type="button"
                className="catalog-category-nav__item catalog-category-nav__item--add"
                onClick={() => setShowAddCategoryModal(true)}
                style={{
                  border: "1px dashed var(--color-brown-accent, #B08D79)",
                  color: "var(--color-brown-accent, #B08D79)",
                  borderRadius: "20px",
                  padding: "8px 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "transparent",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "0.85rem",
                  textTransform: "none",
                  letterSpacing: "normal",
                  height: "fit-content",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Agregar categoría
              </button>
            </div>
          )}
        </div>
      </nav>

      <section
        className="catalog-screen catalog-screen--ecommerce-products"
        ref={productSectionRef}
      >
        <div className="catalog-collection-shell">
          <CatalogCollectionHeader selectedCategory={selectedCategory} />

          <ProductGrid
            products={paginatedProducts}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectProduct={onSelectProduct}
            // onAddToCart={onAddToCart}
            showCreateCard={showCreateCard}
            currentUser={currentUser}
          />

          <CatalogPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            productsSectionRef={productSectionRef}
          />
        </div>
      </section>

      {showAddCategoryModal && (
        <div
          className="admin-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            className="admin-modal-card"
            style={{
              background: "#FFF8F2",
              border: "1px solid rgba(139, 115, 96, 0.15)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 24px 48px rgba(33, 27, 24, 0.15)",
              fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--color-brown-primary, #3E2723)", margin: 0 }}>Agregar Categoría</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setCategoryName("");
                  setCategoryImage("");
                  setCategoryFormError("");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#8B7360",
                }}
              >
                &times;
              </button>
            </div>

            {categoryFormSuccess ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: "60px", height: "60px", background: "rgba(109, 137, 107, 0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6D896B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p style={{ color: "#6D896B", fontWeight: "600", margin: 0 }}>Categoría agregada correctamente</p>
              </div>
            ) : (
              <form onSubmit={handleCreateCategorySubmit}>
                {categoryFormError && (
                  <div style={{ background: "rgba(201, 93, 78, 0.1)", borderLeft: "4px solid #C95D4E", padding: "12px", borderRadius: "4px", marginBottom: "16px", fontSize: "0.9rem", color: "#C95D4E" }}>
                    {categoryFormError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label htmlFor="modalCategoryName" style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--color-brown-primary, #3E2723)" }}>Nombre de la Categoría <span style={{ color: "#C95D4E" }}>*</span></label>
                  <input
                    type="text"
                    id="modalCategoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Ej: Living, Outdoor, Sillas"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(139, 115, 96, 0.3)",
                      background: "#FFFBF8",
                      fontSize: "1rem",
                      color: "var(--color-brown-primary, #3E2723)",
                    }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--color-brown-primary, #3E2723)" }}>Imagen <span style={{ color: "#C95D4E" }}>*</span></label>
                  <div
                    className="image-drop-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleCategoryImgDrop}
                    style={{
                      border: "2px dashed rgba(139, 115, 96, 0.3)",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      background: "rgba(139, 115, 96, 0.03)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                    onClick={() => document.getElementById("categoryFileSelect").click()}
                  >
                    <input
                      type="file"
                      id="categoryFileSelect"
                      accept="image/*"
                      onChange={handleCategoryImgSelect}
                      style={{ display: "none" }}
                    />
                    {uploadingCategoryImg ? (
                      <div>
                        <div style={{ width: "32px", height: "32px", border: "3px solid rgba(139, 115, 96, 0.2)", borderTopColor: "var(--color-brown-accent, #B08D79)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }}></div>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#8B7360" }}>Subiendo imagen...</p>
                      </div>
                    ) : categoryImage ? (
                      <div>
                        <img src={categoryImage} alt="Preview" style={{ maxWidth: "100%", maxHeight: "140px", borderRadius: "8px", objectFit: "cover", marginBottom: "8px" }} />
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D896B", fontWeight: "600" }}>✓ Imagen cargada (Arrastrá otra para cambiar)</p>
                      </div>
                    ) : (
                      <div>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(139, 115, 96, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "8px" }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <p style={{ margin: "0 0 4px", fontSize: "0.95rem", color: "var(--color-brown-primary, #3E2723)", fontWeight: "600" }}>Arrastrá una imagen aquí</p>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#8B7360" }}>o hacé clic para buscar archivo</p>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      setCategoryName("");
                      setCategoryImage("");
                      setCategoryFormError("");
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "12px", borderRadius: "8px", fontWeight: "600" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploadingCategoryImg || !categoryName.trim() || !categoryImage}
                    style={{ flex: 1, padding: "12px", borderRadius: "8px", fontWeight: "600" }}
                  >
                    Crear Categoría
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showEditCategoryModal && (
        <div
          className="admin-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            className="admin-modal-card"
            style={{
              background: "#FFF8F2",
              border: "1px solid rgba(139, 115, 96, 0.15)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 24px 48px rgba(33, 27, 24, 0.15)",
              fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--color-brown-primary, #3E2723)", margin: 0 }}>Gestionar Categorías</h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditCategoryModal(false);
                  setEditCategoryObj(null);
                  setEditCategoryName("");
                  setEditCategoryImage("");
                  setEditCategoryFormError("");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#8B7360",
                }}
              >
                &times;
              </button>
            </div>

            {editCategoryFormSuccess ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: "60px", height: "60px", background: "rgba(109, 137, 107, 0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6D896B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p style={{ color: "#6D896B", fontWeight: "600", margin: 0 }}>Categoría actualizada correctamente</p>
              </div>
            ) : (
              <form onSubmit={handleEditCategorySubmit}>
                {editCategoryFormError && (
                  <div style={{ background: "rgba(201, 93, 78, 0.1)", borderLeft: "4px solid #C95D4E", padding: "12px", borderRadius: "4px", marginBottom: "16px", fontSize: "0.9rem", color: "#C95D4E" }}>
                    {editCategoryFormError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label htmlFor="selectCategoryToEdit" style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--color-brown-primary, #3E2723)" }}>Seleccionar Categoría a Editar/Eliminar <span style={{ color: "#C95D4E" }}>*</span></label>
                  <select
                    id="selectCategoryToEdit"
                    value={editCategoryObj?._id || ""}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (!selectedId) {
                        setEditCategoryObj(null);
                        setEditCategoryName("");
                        setEditCategoryImage("");
                      } else {
                        const selectedObj = dbCategories.find(c => c._id === selectedId);
                        if (selectedObj) {
                          setEditCategoryObj(selectedObj);
                          setEditCategoryName(selectedObj.name);
                          setEditCategoryImage(selectedObj.image || "");
                        }
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(139, 115, 96, 0.3)",
                      background: "#FFFBF8",
                      fontSize: "1rem",
                      color: "var(--color-brown-primary, #3E2723)",
                    }}
                    required
                  >
                    <option value="">-- Elegí una categoría --</option>
                    {dbCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {editCategoryObj && (
                  <>
                    <div className="form-group" style={{ marginBottom: "20px" }}>
                      <label htmlFor="modalEditCategoryName" style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--color-brown-primary, #3E2723)" }}>Nombre de la Categoría <span style={{ color: "#C95D4E" }}>*</span></label>
                      <input
                        type="text"
                        id="modalEditCategoryName"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        placeholder="Ej: Living, Outdoor, Sillas"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: "1px solid rgba(139, 115, 96, 0.3)",
                          background: "#FFFBF8",
                          fontSize: "1rem",
                          color: "var(--color-brown-primary, #3E2723)",
                        }}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: "24px" }}>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--color-brown-primary, #3E2723)" }}>Imagen <span style={{ color: "#C95D4E" }}>*</span></label>
                      <div
                        className="image-drop-zone"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleEditCategoryImgDrop}
                        style={{
                          border: "2px dashed rgba(139, 115, 96, 0.3)",
                          borderRadius: "12px",
                          padding: "24px",
                          textAlign: "center",
                          background: "rgba(139, 115, 96, 0.03)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          position: "relative",
                        }}
                        onClick={() => document.getElementById("editCategoryFileSelect").click()}
                      >
                        <input
                          type="file"
                          id="editCategoryFileSelect"
                          accept="image/*"
                          onChange={handleEditCategoryImgSelect}
                          style={{ display: "none" }}
                        />
                        {uploadingEditCategoryImg ? (
                          <div>
                            <div style={{ width: "32px", height: "32px", border: "3px solid rgba(139, 115, 96, 0.2)", borderTopColor: "var(--color-brown-accent, #B08D79)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }}></div>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "#8B7360" }}>Subiendo imagen...</p>
                          </div>
                        ) : editCategoryImage ? (
                          <div>
                            <img src={editCategoryImage} alt="Preview" style={{ maxWidth: "100%", maxHeight: "140px", borderRadius: "8px", objectFit: "cover", marginBottom: "8px" }} />
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D896B", fontWeight: "600" }}>✓ Imagen cargada (Arrastrá otra para cambiar)</p>
                          </div>
                        ) : (
                          <div>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(139, 115, 96, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "8px" }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <p style={{ margin: "0 0 4px", fontSize: "0.95rem", color: "var(--color-brown-primary, #3E2723)", fontWeight: "600" }}>Arrastrá una imagen aquí</p>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "#8B7360" }}>o hacé clic para buscar archivo</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditCategoryModal(false);
                          setEditCategoryObj(null);
                          setEditCategoryName("");
                          setEditCategoryImage("");
                          setEditCategoryFormError("");
                        }}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: "12px", borderRadius: "8px", fontWeight: "600" }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={uploadingEditCategoryImg || !editCategoryName.trim() || !editCategoryImage}
                        style={{ flex: 1, padding: "12px", borderRadius: "8px", fontWeight: "600" }}
                      >
                        Guardar Cambios
                      </button>
                    </div>

                    <hr style={{ margin: "24px 0 16px", border: 0, borderTop: "1px solid rgba(139, 115, 96, 0.15)" }} />

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteCategoryObj(editCategoryObj);
                        setDeleteCategoryFormError("");
                        setDeleteCategoryFormSuccess(false);
                        setShowDeleteCategoryModal(true);
                        setShowEditCategoryModal(false);
                      }}
                      className="btn"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        background: "#dc3545",
                        color: "#FFF",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease"
                      }}
                    >
                      Eliminar Categoría
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {showDeleteCategoryModal && (
        <div
          className="admin-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            className="admin-modal-card"
            style={{
              background: "#FFF8F2",
              border: "1px solid rgba(139, 115, 96, 0.15)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 24px 48px rgba(33, 27, 24, 0.15)",
              fontFamily: "var(--font-sans, 'Outfit', sans-serif)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#dc3545", margin: 0 }}>Eliminar Categoría</h3>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteCategoryModal(false);
                  setDeleteCategoryObj(null);
                  setDeleteCategoryFormError("");
                  setShowEditCategoryModal(true);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#8B7360",
                }}
              >
                &times;
              </button>
            </div>

            {deleteCategoryFormSuccess ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: "60px", height: "60px", background: "rgba(220, 53, 69, 0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p style={{ color: "#dc3545", fontWeight: "600", margin: 0 }}>Categoría eliminada con éxito</p>
              </div>
            ) : (
              <form onSubmit={handleDeleteCategorySubmit}>
                {deleteCategoryFormError && (
                  <div style={{ background: "rgba(201, 93, 78, 0.1)", borderLeft: "4px solid #C95D4E", padding: "12px", borderRadius: "4px", marginBottom: "16px", fontSize: "0.9rem", color: "#C95D4E" }}>
                    {deleteCategoryFormError}
                  </div>
                )}

                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "1.05rem", color: "var(--color-brown-primary, #3E2723)", lineHeight: "1.6", margin: "0 0 16px" }}>
                    ¿Estás seguro de que deseas eliminar la categoría <strong>"{deleteCategoryObj?.name}"</strong>?
                  </p>
                  <div style={{ background: "rgba(200, 129, 74, 0.08)", borderLeft: "4px solid var(--color-brown-accent, #B08D79)", padding: "16px", borderRadius: "6px" }}>
                    <p style={{ fontSize: "0.9rem", color: "#8B7360", margin: 0, lineHeight: "1.5" }}>
                      <strong>Nota sobre Borrado Lógico:</strong> La categoría se ocultará del catálogo y no se perderá de la base de datos. Los productos asociados continuarán existiendo.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteCategoryModal(false);
                      setDeleteCategoryObj(null);
                      setDeleteCategoryFormError("");
                      setShowEditCategoryModal(true);
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "12px", borderRadius: "8px", fontWeight: "600" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={deletingCategory}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      background: "#dc3545",
                      color: "#FFF",
                      border: "none",
                      cursor: "pointer",
                      transition: "opacity 0.2s ease"
                    }}
                  >
                    {deletingCategory ? "Eliminando..." : "Eliminar Categoría"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default CatalogPage;
