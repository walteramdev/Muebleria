const CatalogCollectionHeader = ({ selectedCategory }) => {
  return (
    <div className="catalog-collection-header--ecommerce">
      <h1 className="catalog-collection-header__title">
        {selectedCategory === "Todos"
          ? "Todas las Piezas"
          : selectedCategory}
      </h1>
    </div>
  );
};

export default CatalogCollectionHeader;
