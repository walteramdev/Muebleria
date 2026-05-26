const CatalogSubcategoryFilters = ({
  selectedCategoryDefinition,
  selectedSubcategory,
  availableSubcategories,
  onSubcategorySelect,
}) => {
  return (
    <div className="catalog-subcategory-filters catalog-subcategory-filters--inline">
      <button
        type="button"
        className={!selectedSubcategory ? "is-selected" : ""}
        onClick={() => onSubcategorySelect("")}
      >
        Todo {selectedCategoryDefinition.name}
      </button>

      {availableSubcategories.map((subcategory) => (
        <button
          key={subcategory}
          type="button"
          className={subcategory === selectedSubcategory ? "is-selected" : ""}
          onClick={() => onSubcategorySelect(subcategory)}
        >
          {subcategory}
        </button>
      ))}
    </div>
  );
};

export default CatalogSubcategoryFilters;
