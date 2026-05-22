import { useEffect } from "react";

const CatalogPagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <nav className="catalog-pagination" aria-label="Paginacion de productos">
      <button
        type="button"
        className="catalog-pagination__arrow"
        onClick={() => onPageChange((page) => Math.max(1, page - 1))}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      <div className="catalog-pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={page === currentPage ? "is-selected" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="catalog-pagination__arrow"
        onClick={() => onPageChange((page) => Math.min(totalPages, page + 1))}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </nav>
  );
};

export default CatalogPagination;
