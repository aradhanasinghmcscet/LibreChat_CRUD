import { useState, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await productService.getAll(params);
      setProducts(data.items);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (product) => {
    try {
      setLoading(true);
      const newProduct = await productService.create(product);
      setProducts((prev) => [...prev, newProduct]);
      setError(null);
      return newProduct;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, product) => {
    try {
      setLoading(true);
      const updatedProduct = await productService.update(id, product);
      setProducts((prev) =>
        prev.map((item) => (item._id === id ? updatedProduct : item))
      );
      setError(null);
      return updatedProduct;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      await productService.delete(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
      setError(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (query) => {
    try {
      setLoading(true);
      const data = await productService.search(query);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectProduct = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  return {
    products,
    loading,
    error,
    selectedProduct,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    selectProduct,
  };
};
