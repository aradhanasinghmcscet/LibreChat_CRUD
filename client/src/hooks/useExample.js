import { useState, useCallback } from 'react';
import { exampleService } from '../services/exampleService';

export const useExample = () => {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExamples = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await exampleService.getAll(params);
      setExamples(data.items);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createExample = useCallback(async (data) => {
    try {
      setLoading(true);
      const example = await exampleService.create(data);
      setExamples((prev) => [...prev, example]);
      setError(null);
      return example;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExample = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const example = await exampleService.update(id, data);
      setExamples((prev) =>
        prev.map((item) => (item._id === id ? example : item))
      );
      setError(null);
      return example;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExample = useCallback(async (id) => {
    try {
      setLoading(true);
      await exampleService.delete(id);
      setExamples((prev) => prev.filter((item) => item._id !== id));
      setError(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchExamples = useCallback(async (name) => {
    try {
      setLoading(true);
      const data = await exampleService.search(name);
      setExamples(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    examples,
    loading,
    error,
    fetchExamples,
    createExample,
    updateExample,
    deleteExample,
    searchExamples,
  };
};
