const CatalogCollectionHeader = ({
  selectedCategory,
  selectedSubcategory,
  selectedCategoryDefinition,
}) => {
  return (
    <div className="catalog-collection-shell__header">
      <div>
        <p className="eyebrow">Coleccion</p>
        <h2>
          {selectedCategory === "Todos"
            ? "Toda la colección"
            : selectedSubcategory
              ? `${selectedCategory} / ${selectedSubcategory}`
              : selectedCategory}
        </h2>
      </div>

      <p className="catalog-collection-shell__text">
        {selectedCategoryDefinition?.shortDescription ||
          "Un recorrido editorial por las piezas principales de Chenille."}
      </p>
    </div>
  );
};

export default CatalogCollectionHeader;
