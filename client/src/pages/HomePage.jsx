import heroImage from "../assets/hero.png";

const HomePage = ({
  onSelectProduct = () => {},
  products = [],
  isLoading = false,
  error = null,
}) => {
  return (
    <main className="home-page">
      <section className="home-hero" id="inicio">
        <div className="home-hero__content">
          <p className="eyebrow">Muebleria Chenille</p>
          <h1>Muebles nobles para una casa que se sienta propia.</h1>
          <p className="home-hero__text">
            Dejamos una homepage base, clara y prolija para que ustedes puedan
            avanzar en el frente visual aunque el backend todavia este en obra.
          </p>

          <div className="home-hero__actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                document
                  .getElementById("destacados")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Ver destacados
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                document
                  .getElementById("contacto")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Ver siguiente paso
            </button>
          </div>
        </div>

        <div className="home-hero__media">
          <img
            src={heroImage}
            alt="Ambiente de showroom con muebles y detalles calidos"
          />
        </div>
      </section>

      <section className="home-section" id="colecciones">
        <div className="section-heading">
          <p className="eyebrow">Colecciones</p>
          <h2>Una primera estructura para contar bien la marca</h2>
          <p>
            Esta portada ya transmite tono, categorias y una direccion visual.
            Despues se puede expandir sin tener que rehacer todo desde cero.
          </p>
        </div>

        <div className="category-grid">
          <article className="info-card">
            <span className="info-card__number">01</span>
            <h3>Living</h3>
            <p>
              Sillones, mesas ratonas y piezas que vuelven mas calido el espacio
              principal de la casa.
            </p>
          </article>
          <article className="info-card">
            <span className="info-card__number">02</span>
            <h3>Comedor</h3>
            <p>
              Muebles para compartir, comer y recibir gente con comodidad y
              presencia.
            </p>
          </article>
          <article className="info-card">
            <span className="info-card__number">03</span>
            <h3>Dormitorio</h3>
            <p>
              Respaldos, mesas de luz y soluciones a medida para completar el
              ambiente.
            </p>
          </article>
        </div>
      </section>

      <section className="home-section home-section--featured" id="destacados">
        <div className="section-heading">
          <p className="eyebrow">Destacados</p>
          <h2>Productos de ejemplo para seguir trabajando sin esperar la API</h2>
        </div>

        {isLoading && <p className="state-message">Cargando productos...</p>}

        {!isLoading && error && (
          <p className="state-message state-error">{error}</p>
        )}

        {!isLoading && !error && (
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <p className="product-card__category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="product-card__description">{product.description}</p>
                <div className="product-card__footer">
                  <strong>{product.price}</strong>
                  <button
                    type="button"
                    className="product-card__button"
                    onClick={() => onSelectProduct(product)}
                  >
                    Ver mas
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="home-section home-section--split" id="contacto">
        <article className="story-card">
          <p className="eyebrow">Lo que ya queda listo</p>
          <h2>Una base real para seguir creciendo</h2>
          <ul className="story-list">
            <li>Homepage presentable y coherente con la marca.</li>
            <li>Navegacion simple entre secciones.</li>
            <li>Tarjetas de producto listas para evolucionar.</li>
            <li>Estilos globales ordenados para sumar pantallas nuevas.</li>
          </ul>
        </article>

        <article className="story-card story-card--accent">
          <p className="eyebrow">Lo que puede venir despues</p>
          <h2>Cuando el backend este mas armado</h2>
          <ul className="story-list">
            <li>Catalogo completo con filtros y busqueda.</li>
            <li>Detalle de producto conectado a la base de datos.</li>
            <li>Login para administracion.</li>
            <li>Formulario para alta y edicion de productos.</li>
          </ul>
        </article>
      </section>
    </main>
  );
};

export default HomePage;
