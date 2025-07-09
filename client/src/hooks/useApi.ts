import { useState, useCallback } from 'react';
import axios from 'axios';
import { useApiErrorBoundary } from './ApiErrorBoundaryContext';

interface ListParams {
  limit?: number;
  skip?: number;
  [key: string]: any;
}

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const useApi = () => {
  const { setError } = useApiErrorBoundary();
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState<null | Error>(null);

  const makeRequest = async (method, endpoint, data = null, params = {}) => {
    try {
      setLoading(true);
      const response = await axios({
        method,
        url: `${API_URL}${endpoint}`,
        data,
        params,
      });
      // Handle pagination response
      if (response.data && response.data.items) {
        return response.data;
      }
      return response.data;
    } catch (err: any) {
      const error = err.response ? err.response.data : err;
      setErrorState(error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const create = useCallback(async (endpoint, data) => {
    return makeRequest('post', endpoint, data);
  }, []);

  const read = useCallback(async (endpoint, id, params = {}) => {
    return makeRequest('get', `${endpoint}/${id}`, null, params);
  }, []);

  const update = useCallback(async (endpoint, id, data) => {
    return makeRequest('put', `${endpoint}/${id}`, data);
  }, []);

  const del = useCallback(async (endpoint, id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}${endpoint}/${id}`);
      return response.data;
    } catch (err: any) {
      const error = err.response ? err.response.data : err;
      setErrorState(error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // List with pagination
  const list = useCallback(async (endpoint: string, params: ListParams = {}) => {
    // Add default pagination params if not provided
    const paginationParams = {
      limit: params.limit || 10,
      skip: params.skip || 0,
      ...params
    };
    return makeRequest('get', endpoint, null, paginationParams);
  }, []);

  // Search
  const search = useCallback(async (endpoint, query) => {
    return makeRequest('get', `${endpoint}/search`, null, { query });
  }, []);

  return {
    loading,
    error,
    create,
    read,
    update,
    list,
    search,
    del
  };
};
