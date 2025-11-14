import api from './api';

const transactionService = {
  create: async (transactionData) => {
    // Nettoyer les données avant envoi
    const cleanData = { ...transactionData };

    // Convertir les chaînes vides en null pour les champs optionnels
    if (!cleanData.subcategory_id || cleanData.subcategory_id === '') {
      cleanData.subcategory_id = null;
    }
    if (!cleanData.title || cleanData.title === '') {
      cleanData.title = null;
    }
    if (!cleanData.location || cleanData.location === '') {
      cleanData.location = null;
    }
    if (!cleanData.description || cleanData.description === '') {
      cleanData.description = '';
    }

    const response = await api.post('/transactions', cleanData);
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();

    // Ajouter le filtre de catégorie si présent
    if (filters.categoryId) {
      params.append('category_id', filters.categoryId);
    }

    const queryString = params.toString();
    const url = queryString ? `/transactions?${queryString}` : '/transactions';

    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get('/transactions/balance');
    return response.data;
  }
};

export default transactionService;
