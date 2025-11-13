import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import categoryService from '../services/categoryService';
import transactionService from '../services/transactionService';

function TransactionModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    type: 'expense',
    transaction_date: new Date().toISOString().split('T')[0],
    category_id: '',
    subcategory_id: '',
    amount: '',
    description: '',
    title: '',
    location: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  };

  const loadSubcategories = async (categoryId) => {
    try {
      const response = await categoryService.getSubcategoriesByCategory(categoryId);
      if (response.success) {
        setSubcategories(response.data.subcategories);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des sous-catégories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'category_id' && value) {
      loadSubcategories(value);
      setFormData(prev => ({ ...prev, subcategory_id: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await transactionService.create(formData);

      if (response.success) {
        // Reset form
        setFormData({
          type: 'expense',
          transaction_date: new Date().toISOString().split('T')[0],
          category_id: '',
          subcategory_id: '',
          amount: '',
          description: '',
          title: '',
          location: ''
        });
        setSubcategories([]);
        onSuccess();
      }
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout de la transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setFormData({
      type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
      category_id: '',
      subcategory_id: '',
      amount: '',
      description: '',
      title: '',
      location: ''
    });
    setSubcategories([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Ajouter une transaction</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ margin: '0 24px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="transaction-form">
          {/* Type: Dépense / Revenu */}
          <div className="form-group">
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'expense' })}
              >
                Dépense
              </button>
              <button
                type="button"
                className={`toggle-btn ${formData.type === 'income' ? 'active income' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'income' })}
              >
                Revenu
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Montant */}
          <div className="form-group">
            <label className="form-label">Montant</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              placeholder="Insérer un montant en €"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Titre */}
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Titre de la transaction..."
            />
          </div>

          {/* Catégorie */}
          <div className="form-group">
            <label className="form-label">Catégorie</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sous-catégorie */}
          <div className="form-group">
            <label className="form-label">Sous-catégorie</label>
            <select
              name="subcategory_id"
              value={formData.subcategory_id}
              onChange={handleChange}
              className="form-input"
              disabled={!formData.category_id || subcategories.length === 0}
            >
              <option value="">Sélectionner une sous-catégorie</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          {/* Lieu */}
          <div className="form-group">
            <label className="form-label">Lieu</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="Lieu de la transaction..."
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Insérer une description..."
              rows="3"
            />
          </div>

          {/* Bouton Valider */}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Ajout en cours...' : 'Valider'}
          </button>
        </form>
      </div>
    </div>
  );
}

TransactionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default TransactionModal;
