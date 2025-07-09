import axios from 'axios';

const API_URL = '/api/examples';

export const exampleService = {
  // Create a new example
  create: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all examples
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single example
  get: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an example
  update: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete an example
  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Search examples
  search: async (name) => {
    try {
      const response = await axios.get(`${API_URL}/search`, { params: { name } });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
