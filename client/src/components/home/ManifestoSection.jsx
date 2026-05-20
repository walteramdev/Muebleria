import React from "react";

const ManifestoSection = ({ sectionRef, backgroundImage }) => {
  return (
    <section
      ref={sectionRef}
      className="home-screen home-screen--manifesto"
      id="manifiesto"
      style={{ "--screen-background": `url(${backgroundImage})` }}
    >
      <div className="home-screen__overlay home-screen__overlay--soft" />
      <div className="home-screen__content home-screen__content--manifesto">
        <div className="manifesto-mark" aria-hidden="true">
          <svg viewBox="0 0 120 120" role="img">
            <path
              d="M28 68c0-20 13-34 32-34s32 14 32 34"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M24 68h72v24c0 6.6-5.4 12-12 12H36c-6.6 0-12-5.4-12-12z"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M42 50v-8c0-10 8-18 18-18s18 8 18 18v8"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="eyebrow eyebrow--light">Manifiesto</p>
        <h2>Diseño calido para espacios que se viven de verdad.</h2>
        <p className="story-copy story-copy--light">
          Menos ruido visual, mas hogar. Chenille busca proponer interiores
          serenos, táctiles y nobles, donde cada pieza acompaña lo cotidiano con
          equilibrio y calma.
        </p>
      </div>
    </section>
  );
};

export default ManifestoSection;
