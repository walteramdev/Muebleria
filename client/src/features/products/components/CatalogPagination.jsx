import { useEffect } from "react";

const CatalogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  productsSectionRef,
}) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageClick = (pageOrUpdater) => {
    onPageChange(pageOrUpdater);

    // Scroll smoothly to products grid
    setTimeout(() => {
      if (productsSectionRef?.current) {
        const elementTop =
          productsSectionRef.current.getBoundingClientRect().top +
          window.pageYOffset;
        const headerOffset = 100;
        window.scrollTo({
          top: elementTop - headerOffset,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  return (
    <nav className="catalog-pagination" aria-label="Paginacion de productos">
      <button
        type="button"
        className="catalog-pagination__arrow"
        onClick={() => handlePageClick((page) => Math.max(1, page - 1))}
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
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="catalog-pagination__arrow"
        onClick={() => handlePageClick((page) => Math.min(totalPages, page + 1))}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </nav>
  );
};

export default CatalogPagination;
