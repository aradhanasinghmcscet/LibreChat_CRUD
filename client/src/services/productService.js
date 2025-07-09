import axios from 'axios';

const API_URL = '/api/products';

export const productService = {
  // Create a new product
  create: async (product) => {
    try {
      const response = await axios.post(API_URL, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all products
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single product
  get: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a product
  update: async (id, product) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a product
  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Search products
  search: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/search`, { params: { query } });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
