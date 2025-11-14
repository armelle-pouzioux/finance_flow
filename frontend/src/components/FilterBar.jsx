import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import categoryService from '../services/categoryService';
import './FilterBar.css';

function FilterBar({ selectedCategories, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryToggle = (categoryId) => {
    let newSelection;

    if (selectedCategories.includes(categoryId)) {
      // Retirer la catégorie
      newSelection = selectedCategories.filter(id => id !== categoryId);
    } else {
      // Ajouter la catégorie
      newSelection = [...selectedCategories, categoryId];
    }

    onFilterChange(newSelection);
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  const getSelectedCategoriesNames = () => {
    if (selectedCategories.length === 0) return 'Toutes les catégories';
    if (selectedCategories.length === categories.length) return 'Toutes les catégories';

    const names = selectedCategories
      .map(id => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : null;
      })
      .filter(Boolean);

    if (names.length <= 2) {
      return names.join(', ');
    }

    return `${names.length} catégories`;
  };

  return (
    <div className="filter-bar">
      <button
        className="filter-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="filter-icon"></span>
        <span className="filter-label">{getSelectedCategoriesNames()}</span>
        <span className={`filter-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-dropdown-header">
            <h3>Filtrer par catégorie</h3>
            {selectedCategories.length > 0 && (
              <button
                className="filter-clear-btn"
                onClick={handleClearAll}
              >
                Tout effacer
              </button>
            )}
          </div>

          <div className="filter-options">
            {categories.map((category) => (
              <label key={category.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                <span className="filter-option-label">{category.name}</span>
                {selectedCategories.includes(category.id) && (
                  <span className="filter-checkmark">✓</span>
                )}
              </label>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="filter-empty">
              Aucune catégorie disponible
            </div>
          )}
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {isOpen && (
        <div
          className="filter-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

FilterBar.propTypes = {
  selectedCategories: PropTypes.arrayOf(PropTypes.number).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;
