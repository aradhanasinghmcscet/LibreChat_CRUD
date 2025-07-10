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

const API_URL = process.env.VITE_API_URL || 'http://localhost:3080/api';

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

  const makeRequest = async (method, endpoint, data = null, params: { id?: string | number } = {}) => {
    try {
      setLoading(true);
      // Convert params to query string
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_URL}${endpoint}?${queryString}` : `${API_URL}${endpoint}`;
      
      const response = await axios({
        method,
        url,
        ...(method === 'delete' ? { data: { id: params.id } } : { data }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Check if we got HTML instead of JSON
      if (typeof response.data === 'string' && response.data.includes('<html>')) {
        throw new Error('API returned HTML instead of JSON. Please check if the API server is running and the URL is correct.');
      }
      
      console.log('API Response:', {
        status: response.status,
        data: response.data
      });
      
      // Process the response data
      let processedData = response.data;
      
      // Helper function to safely convert to string
      const safeToString = (value: any) => {
        return value !== undefined && value !== null ? value.toString() : '';
      };
      
      // If the response has items, process them
      if (processedData && processedData.items) {
        processedData.items = processedData.items.map((item: Product) => ({
          ...item,
          price: safeToString(item.price),
          quantity: safeToString(item.quantity)
        }));
      }
      
      // If the response has products, process them
      if (processedData && processedData.products) {
        processedData.products = processedData.products.map((item: Product) => ({
          ...item,
          price: safeToString(item.price),
          quantity: safeToString(item.quantity)
        }));
      }
      
      // If the response is a single item, process it
      if (processedData && !Array.isArray(processedData)) {
        processedData = {
          ...processedData,
          price: safeToString(processedData.price),
          quantity: safeToString(processedData.quantity)
        };
      }
      
      return processedData;
    } catch (err: any) {
      const error = err.response ? {
        status: err.response.status,
        data: err.response.data,
        message: err.response.data?.message || 'API request failed'
      } : {
        message: err.message || 'Unknown error'
      };
      console.error('API Error:', error);
      setError(error);
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
    read: useCallback(async (endpoint, id, params = {}) => {
      // For list endpoints, don't append ID
      const fullEndpoint = endpoint.includes('/') ? endpoint : `${endpoint}/${id}`;
      return makeRequest('get', fullEndpoint, null, params);
    }, []),
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