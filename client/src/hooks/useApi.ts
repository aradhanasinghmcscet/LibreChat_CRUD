import { useState, useCallback } from 'react';
import axios from 'axios';
import { useApiErrorBoundary } from './ApiErrorBoundaryContext';

interface ListParams {
  limit?: number;
  skip?: number;
  [key: string]: any;
}

interface Product {
  _id?: string;
  name: string;
  price: string;
  description: string;
  quantity: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const API_URL = process.env.REACT_APP_API_URL || '/api';

interface ApiMethods {
  create: (endpoint: string, data: any) => Promise<any>;
  read: (endpoint: string, id: string | number, params?: any) => Promise<any>;
  update: (endpoint: string, id: string | number, data: any) => Promise<any>;
  remove: (endpoint: string, id: string | number) => Promise<any>;
  list: (endpoint: string, params?: ListParams) => Promise<any>;
  search: (endpoint: string, query: any) => Promise<any>;
}

export const useApi = (): { loading: boolean; error: null } & ApiMethods => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null>(null);

  const makeRequest = async (method, endpoint, data = null, params = {}) => {
    try {
      setLoading(true);
      const response = await axios({ method, url: `${API_URL}${endpoint}`, data, params });
      if (response.data && response.data.items) {
        const processedData = response.data.items.map((item: Product) => ({
          ...item,
          price: item.price.toString(),
          quantity: item.quantity.toString()
        }));
        return { ...response.data, items: processedData };
      }
      return response.data;
    } catch (err: any) {
      const error = err.response ? err.response.data : err;
      setError(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create: useCallback(async (endpoint, data) => {
      const processedData = {
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity)
      };
      return makeRequest('post', endpoint, processedData);
    }, []),
    read: useCallback(async (endpoint, id, params = {}) => makeRequest('get', `${endpoint}/${id}`, null, params), []),
    update: useCallback(async (endpoint, id, data) => {
      const processedData = {
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity)
      };
      return makeRequest('put', `${endpoint}/${id}`, processedData);
    }, []),
    remove: useCallback(async (endpoint, id) => makeRequest('delete', `${endpoint}/${id}`), []),
    list: useCallback(async (endpoint, params = {}) => makeRequest('get', endpoint, null, params), []),
    search: useCallback(async (endpoint, query) => makeRequest('get', endpoint, null, { query }), [])
  };
};
