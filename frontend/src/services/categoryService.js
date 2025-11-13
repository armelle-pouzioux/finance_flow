import api from './api';

const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getAllSubcategories: async () => {
    const response = await api.get('/subcategories');
    return response.data;
  },

  getSubcategoriesByCategory: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}/subcategories`);
    return response.data;
  },
};

export default categoryService;
