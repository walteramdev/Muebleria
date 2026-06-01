import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CollectionsSection = ({ sectionRef, collections = [], backgroundImage }) => {
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
    
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX); // calculate actual distance moved
    
    // Solo consideramos que es un 'drag' si se movió más de 5 píxeles
    if (Math.abs(walk) > 5) {
      setDidDrag(true);
    }
    
    const scrollWalk = walk * 2; // scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - scrollWalk;
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
              <div 
                className="collection-carousel-card__action"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  if (didDrag) {
                    e.preventDefault();
                    return;
                  }
                  navigate(`/productos?categoria=${encodeURIComponent(col.name)}`);
                }}
              >
                Explorar <span>→</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;
