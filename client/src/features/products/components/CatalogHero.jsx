const heroImages = {
  Todos:
    "https://images.pexels.com/photos/5824903/pexels-photo-5824903.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Living:
    "https://images.pexels.com/photos/6207949/pexels-photo-6207949.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Comedor:
    "https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Dormitorio:
    "https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const heroCopy = {
  Todos: {
    eyebrow: "Coleccion",
    title: "Piezas pensadas para vivir la casa con calma.",
    text: "Living, comedor y dormitorio reunidos en una selección cálida, funcional y serena.",
  },
  Living: {
    eyebrow: "Living",
    title: "Recibir, descansar y habitar con identidad.",
    text: "Sillones, consolas y mesas ratonas para construir una atmósfera tranquila y propia.",
  },
  Comedor: {
    eyebrow: "Comedor",
    title: "Muebles para compartir todos los días.",
    text: "Mesas, sillas y apoyos con presencia cálida para acompañar reuniones, uso diario y rituales cotidianos.",
  },
  Dormitorio: {
    eyebrow: "Dormitorio",
    title: "Soluciones cálidas para bajar el ritmo.",
    text: "Respaldos, mesas de luz y cómodas pensados para ordenar, abrigar y descansar mejor.",
  },
};

const CatalogHero = ({ selectedCategory, categories, onCategorySelect }) => {
  const resolvedHero = heroCopy[selectedCategory] ?? heroCopy.Todos;
  const heroImage = heroImages[selectedCategory] ?? heroImages.Todos;

  return (
    <section className="catalog-screen catalog-screen--hero">
      <div
        className="catalog-hero"
        style={{ "--catalog-hero-image": `url(${heroImage})` }}
      >
        <div className="catalog-hero__overlay" />
        <div className="catalog-hero__content">
          <p className="eyebrow eyebrow--light">{resolvedHero.eyebrow}</p>
          <h1>{resolvedHero.title}</h1>
          <p className="catalog-hero__text">{resolvedHero.text}</p>

          <div className="catalog-hero__filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === selectedCategory ? "is-selected" : ""}
                onClick={() => onCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
