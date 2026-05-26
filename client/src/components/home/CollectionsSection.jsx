import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CollectionsSection = ({ sectionRef, collections = [] }) => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  
  // Drag to scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  // To prevent click when dragging
  const [didDrag, setDidDrag] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (collections.length <= 1) return;
    
    const intervalId = setInterval(() => {
      if (carouselRef.current && !isDragging) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const firstCard = carouselRef.current.querySelector(".collection-carousel-card");
        const cardWidth = firstCard ? firstCard.clientWidth + 24 : 350; // 24 is the gap
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 4000); // 4 seconds
    
    return () => clearInterval(intervalId);
  }, [collections.length, isDragging]);

  // Wheel event for horizontal scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (carouselRef.current) {
        // Prevent default vertical scroll and stop propagation to parent sections
        e.preventDefault();
        e.stopPropagation();
        
        // Translate vertical wheel scroll into horizontal scroll
        carouselRef.current.scrollBy({ left: e.deltaY });
      }
    };

    const carouselEl = carouselRef.current;
    if (carouselEl) {
      carouselEl.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (carouselEl) {
        carouselEl.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDidDrag(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setDidDrag(true);
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section ref={sectionRef} className="home-collections-section" id="colecciones">
      <div className="home-collections-section__header">
        <h2 className="home-collections-section__title">Nuestras Colecciones</h2>
      </div>
      <div 
        className="home-collections-carousel" 
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ 
          cursor: isDragging ? "grabbing" : "grab",
          scrollSnapType: isDragging ? "none" : "x mandatory",
          scrollBehavior: isDragging ? "auto" : "smooth",
          userSelect: "none",
          WebkitUserSelect: "none"
        }}
      >
        {collections.map((col) => (
          <article
            key={col.id}
            className="collection-carousel-card"
          >
            <div className="collection-carousel-card__media">
              <img src={col.image} alt={col.name} draggable="false" />
            </div>
            <div className="collection-carousel-card__content">
              <button 
                type="button"
                className="collection-carousel-card__title"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  if (didDrag) {
                    e.preventDefault();
                    return;
                  }
                  navigate(`/productos?categoria=${encodeURIComponent(col.name)}`);
                }}
              >
                {col.name}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;
