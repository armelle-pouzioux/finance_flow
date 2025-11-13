import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';

function TransactionDetailModal({ transaction, isOpen, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
    transaction_date: '',
    category_id: '',
    subcategory_id: '',
    title: '',
    location: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || '',
        amount: transaction.amount || '',
        description: transaction.description || '',
        transaction_date: transaction.transaction_date || '',
        category_id: transaction.category_id || '',
        subcategory_id: transaction.subcategory_id || '',
        title: transaction.title || '',
        location: transaction.location || '',
      });
    }
  }, [transaction]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (formData.category_id) {
        try {
          const response = await categoryService.getSubcategories(formData.category_id);
          if (response.success) {
            setSubcategories(response.data);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des sous-catégories:', error);
        }
      } else {
        setSubcategories([]);
      }
    };
    loadSubcategories();
  }, [formData.category_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await transactionService.update(transaction.id, formData);
      if (response.success) {
        onUpdate();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        const response = await transactionService.delete(transaction.id);
        if (response.success) {
          onDelete();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content transaction-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Modifier la transaction' : 'Détails de la transaction'}
          </h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        {!isEditing ? (
          // Mode lecture
          <div className="transaction-details">
            <div className="detail-row">
              <span className="detail-label">Type :</span>
              <span className={`detail-value type-badge ${formData.type}`}>
                {formData.type === 'income' ? 'Revenu' : 'Dépense'}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Montant :</span>
              <span className={`detail-value amount ${formData.type === 'income' ? 'positive' : 'negative'}`}>
                {formData.type === 'income' ? '+' : '-'} {parseFloat(formData.amount).toFixed(2)} €
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Date :</span>
              <span className="detail-value">{formatDate(formData.transaction_date)}</span>
            </div>

            {formData.title && (
              <div className="detail-row">
                <span className="detail-label">Titre :</span>
                <span className="detail-value">{formData.title}</span>
              </div>
            )}

            <div className="detail-row">
              <span className="detail-label">Catégorie :</span>
              <span className="detail-value">{transaction.category_name || 'Non catégorisé'}</span>
            </div>

            {transaction.subcategory_name && (
              <div className="detail-row">
                <span className="detail-label">Sous-catégorie :</span>
                <span className="detail-value">{transaction.subcategory_name}</span>
              </div>
            )}

            {formData.location && (
              <div className="detail-row">
                <span className="detail-label">Lieu :</span>
                <span className="detail-value">{formData.location}</span>
              </div>
            )}

            {formData.description && (
              <div className="detail-row">
                <span className="detail-label">Description :</span>
                <span className="detail-value">{formData.description}</span>
              </div>
            )}

            <div className="detail-actions">
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Modifier
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          // Mode édition
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="expense">Dépense</option>
                <option value="income">Revenu</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Montant *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="transaction_date">Date *</label>
              <input
                type="date"
                id="transaction_date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Catégorie *</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {subcategories.length > 0 && (
              <div className="form-group">
                <label htmlFor="subcategory_id">Sous-catégorie</label>
                <select
                  id="subcategory_id"
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleChange}
                >
                  <option value="">Aucune</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="location">Lieu</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

TransactionDetailModal.propTypes = {
  transaction: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TransactionDetailModal;
