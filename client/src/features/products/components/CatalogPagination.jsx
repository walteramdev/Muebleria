import { useEffect } from "react";

const CatalogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  productsSectionRef,
}) => {
  const getVisiblePages = (current, total) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const pages = getVisiblePages(currentPage, totalPages);

  const handlePageClick = (pageOrUpdater) => {
    if (pageOrUpdater === '...') return;
    onPageChange(pageOrUpdater);

    // Scroll smoothly to the top of the page
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  return (
    <nav className="catalog-pagination" aria-label="Paginacion de productos">
      <button
        type="button"
        className="catalog-pagination__arrow"
        onClick={() => handlePageClick((page) => Math.max(1, page - 1))}
        disabled={currentPage === 1}
        aria-label="Anterior"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>

      <div className="catalog-pagination__pages">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="catalog-pagination__ellipsis">...</span>
          ) : (
            <button
              key={page}
              type="button"
              className={page === currentPage ? "is-selected" : ""}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        type="button"
        className="catalog-pagination__arrow"
        onClick={() => handlePageClick((page) => Math.min(totalPages, page + 1))}
        disabled={currentPage === totalPages}
        aria-label="Siguiente"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
    </nav>
  );
};

export default CatalogPagination;
