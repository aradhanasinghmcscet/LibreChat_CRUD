import React, { useState, useEffect, useMemo } from 'react';
import { useApi } from '../../hooks/useApi';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination
} from '@mui/material';
import { Search as LucideSearch, Plus, Edit2, Trash2 } from "lucide-react";
import type { LucideProps } from "lucide-react";
import './styles.css';
import './modal.css';

const SearchIcon = LucideSearch as React.FC<LucideProps>;
const PlusIcon = Plus as React.FC<LucideProps>;
const EditIcon = Edit2 as React.FC<LucideProps>;
const TrashIcon = Trash2 as React.FC<LucideProps>;

interface Product {
  _id?: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FormValues {
  name: string;
  price: string;
  description: string;
  quantity: string;
}

const ProductList: React.FC = () => {
  const {
    error,
    create,
    read,
    update,
    remove
  } = useApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(3);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    price: '',
    description: '',
    quantity: '0'
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products with page:', currentPage, 'limit:', productsPerPage);
      
      // Try direct fetch to see raw response
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log('Raw API Response:', JSON.stringify(data, null, 2));
      
      // Handle different response formats
      const productsData = data?.items || data?.products || data || [];
      const total = data?.count || data?.total || productsData.length;
      
      console.log('Processed data:', productsData);
      console.log('Total items:', total);
      
      // Calculate pagination
      const totalPages = Math.max(1, Math.ceil(total / productsPerPage));
      console.log('Setting total pages:', totalPages);
      setTotalPages(totalPages);
      
      // Update the products list
      const start = (currentPage - 1) * productsPerPage;
      const end = start + productsPerPage;
      const paginatedProducts = productsData.slice(start, end);
      console.log('Paginated products:', paginatedProducts);
      
      setProducts(paginatedProducts);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setLocalError('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = async () => {
    setLocalError(null);
    const { name, price, description, quantity } = formValues;

    if (!name || !price || isNaN(parseFloat(price))) {
      setLocalError('Please enter a valid name and price');
      return;
    }

    const productData = {
      name,
      price: parseFloat(price),
      description: description || '',
      quantity: parseInt(quantity)
    };

    await create('/products', productData);
    await fetchProducts(); // updated server data
    closeDialog();
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    setLocalError(null);
    const { name, price, description, quantity } = formValues;

    if (!name || !price || isNaN(parseFloat(price))) {
      setLocalError('Please enter a valid name and price');
      return;
    }

    const updatedData = {
      name,
      price: parseFloat(price),
      description: description || '',
      quantity: parseInt(quantity)
    };

    await update('/products', selectedProduct._id!, updatedData);
    await fetchProducts(); // updated server data
    closeDialog();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await remove('/products', id);
        await fetchProducts(); // updated server data
      } catch (error) {
        console.error('❌ Error deleting product:', error);
        setLocalError('Failed to delete product');
      }
    }
  };

  const handleEditProductClick = (product: Product) => {
    setSelectedProduct(product);
    setFormValues({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      quantity: product.quantity.toString()
    });
    setIsDialogOpen(true);
    setDialogType('edit');
  };

  const handleAddClick = () => {
    setFormValues({
      name: '',
      price: '',
      description: '',
      quantity: '0'
    });
    setSelectedProduct(null);
    setLocalError(null);
    setIsDialogOpen(true);
    setDialogType('add');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchProducts();
  };

  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProductsPerPage(event.target.value as number);
    setCurrentPage(1);
    fetchProducts();
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, productsPerPage]);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogType('add');
    setSelectedProduct(null);
    setFormValues({
      name: '',
      price: '',
      description: '',
      quantity: '0'
    });
    setLocalError(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Product List</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {localError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {localError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">Price: ${product.price}</p>
            <p className="text-gray-600 mb-2">Quantity: {product.quantity}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditProductClick(product)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id!)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No products found
        </div>
      )}

      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
            disabled={loading}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }
              }
            }}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogType === 'add' ? 'Add Product' : 'Edit Product'}</DialogTitle>
        <DialogContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formValues.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formValues.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={dialogType === 'add' ? handleAddProduct : handleEditProduct} color="primary" variant="contained">
            {dialogType === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
