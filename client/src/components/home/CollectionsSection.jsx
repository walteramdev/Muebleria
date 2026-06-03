import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CollectionsSection = ({ sectionRef, collections = [], backgroundImage }) => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  
  // Drag to scroll state (like FeaturedSection)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const [itemsPerSlide, setItemsPerSlide] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 560) return 2;
      if (window.innerWidth <= 960) return 3;
    }
    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 560) {
        setItemsPerSlide(2);
      } else if (window.innerWidth <= 960) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(4);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chunkItems = (items, size) =>
    items.reduce((groups, item, index) => {
      if (index % size === 0) {
        groups.push(items.slice(index, index + size));
      }
      return groups;
    }, []);

  const collectionSlides = chunkItems(collections, itemsPerSlide);

  const handleDragStart = (e) => {
    if (e.type.includes("mouse")) {
      e.preventDefault(); // Previene que el navegador intercepte el clic para seleccionar texto o arrastrar fantasmas
    }
    setIsDragging(true);
    setStartX(e.type.includes("mouse") ? e.pageX : e.touches[0].pageX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    if (e.type.includes("mouse")) {
      e.preventDefault();
    }
    
    const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    const walk = x - startX;

    if (Math.abs(walk) > 40) {
      setIsDragging(false);
      if (walk > 0) {
        document
          .querySelector(".collections-control-btn.prev")
          ?.click();
      } else {
        document
          .querySelector(".collections-control-btn.next")
          ?.click();
      }
    }
  };

  const isNewCategory = (createdAt) => {
    if (!createdAt) return false;
    try {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 14;
    } catch (e) {
      return false;
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="home-collections-section" 
      id="colecciones"
      style={backgroundImage ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "right center"
      } : {}}
    >
      <div className="home-collections-section__overlay" />
      
      <div className="collections-section-content">
        <div className="collections-section-header">
          <h2>Explorar colecciones</h2>
          <div className="collections-carousel-controls">
            <button 
              type="button" 
              className="collections-control-btn prev" 
              data-bs-target="#collectionsCarousel"
              data-bs-slide="prev"
              aria-label="Colección anterior"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button 
              type="button" 
              className="collections-control-btn next" 
              data-bs-target="#collectionsCarousel"
              data-bs-slide="next"
              aria-label="Siguiente colección"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="collectionsCarousel"
          className="carousel slide home-bootstrap-carousel collections-bootstrap-carousel"
          data-bs-ride="carousel"
          data-bs-interval="4500"
          data-bs-pause="false"
          style={{ pointerEvents: "auto" }}
        >
          <div className="carousel-indicators collections-carousel-indicators">
            {collectionSlides.map((slide, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#collectionsCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Grupo de colecciones ${index + 1}`}
              />
            ))}
          </div>

          <div
            className="carousel-inner"
            ref={carouselRef}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: isDragging ? "none" : "auto",
              borderRadius: "32px",
              overflow: "hidden",
            }}
          >
            {collectionSlides.map((slide, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                <div 
                  className="home-bootstrap-carousel__track"
                  style={{ 
                    gridTemplateColumns: `repeat(${itemsPerSlide}, minmax(0, 1fr))`,
                    padding: "4px 20px 12px" /* Adds padding to left and right edges */
                  }}
                >
                  {slide.map((col) => (
                    <article
                      key={col.id}
                      className="collection-carousel-card"
                      style={{ width: "100%", margin: 0, minWidth: 0 }}
                    >
                      {isNewCategory(col.createdAt) && (
                        <span className="collection-badge-new">Nuevo</span>
                      )}
                      
                      <div className="collection-carousel-card__media">
                        <img src={col.image} alt={col.name} draggable="false" />
                      </div>
                      
                      <div className="collection-carousel-card__content">
                        <span className="collection-carousel-card__title">
                          {col.name}
                        </span>
                        <div className="collection-carousel-card__action">
                          <button 
                            type="button" 
                            className="collection-carousel-card__action-btn btn-secondary"
                            onClick={() => {
                              navigate(`/productos?categoria=${encodeURIComponent(col.name)}`);
                            }}
                          >
                            Ver colección
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
