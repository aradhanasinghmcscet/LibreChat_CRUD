import React, { useState, useEffect } from 'react';
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
    loading,
    error,
    create,
    read,
    update,
    list,
    search,
    del: removeProduct
  } = useApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    price: '',
    description: '',
    quantity: '0'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await list('/products', {
        page: currentPage,
        limit: 100
      });
      console.log('🔥 API response from list("/products"):', response);

      // Handle paginated response
      const data = response?.items || [];
      const total = response?.count || 0;
      setTotalPages(Math.ceil(total / 100)); // Update total pages based on new limit

      console.log('✅ Parsed product list:', data);
      console.log('Total products:', total);
      console.log('Raw response:', response);

      // Ensure we have at least 1 page
      // const totalPages = Math.max(1, Math.ceil(total / 10));
      setProducts(data);
      // setTotalPages(Math.ceil(total / 10));
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setLocalError('Failed to fetch products');
    }
  };
  
  
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    setLocalError(null);
    const { name, price, description, status } = formValues;

    if (!name || !price || isNaN(parseFloat(price))) {
      setLocalError('Please enter a valid name and price');
      return;
    }

    try {
      await create('/products', {
        name,
        price: parseFloat(price),
        description: description || '',
        status: status || 'active'
      });

      await fetchProducts(); // ✅ updated server data
      closeDialog();
    } catch (error) {
      console.error('Error creating product:', error);
      setLocalError('Failed to create product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    setLocalError(null);
    const { name, price, description, status } = formValues;

    if (!name || !price || isNaN(parseFloat(price))) {
      setLocalError('Please enter a valid name and price');
      return;
    }

    try {
      const updatedData = {
        name,
        price: parseFloat(price),
        description: description || '',
        status: status || 'active'
      };

      await update('/products', selectedProduct._id!, updatedData);
      await fetchProducts(); // ✅ sync with server
      closeDialog();
    } catch (error) {
      console.error('Error updating product:', error);
      setLocalError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
      try {
        // Use the delete endpoint which performs soft delete
        await removeProduct('/api/products', productId);
        // Filter out the deleted product from the current list
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
        // await fetchProducts();
        console.log('Product deleted successfully', productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        setLocalError('Failed to delete product');
      }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormValues({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      status: product.status
    });
    setIsDialogOpen(true);
    setDialogType('edit');
    setLocalError(null);
  };

  const handleAddClick = () => {
    setIsDialogOpen(true);
    setDialogType('add');
    setFormValues({
      name: '',
      price: '',
      description: '',
      status: 'active'
    });
    setSelectedProduct(null);
    setLocalError(null);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogType(null);
    setSelectedProduct(null);
    setFormValues({
      name: '',
      price: '',
      description: '',
      status: 'active'
    });
    setLocalError(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    fetchProducts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts();
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = searchTerm
    ? safeProducts.filter(product =>
        product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    : safeProducts;

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
            <p className="text-gray-600 mb-2">Status: {product.status}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditProduct(product)}
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
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_event, page) => handlePageChange(page)}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </div>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogType === 'add' ? 'Add Product' : 'Edit Product'}</DialogTitle>
        <DialogContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formValues.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formValues.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={dialogType === 'add' ? handleAddProduct : handleUpdateProduct}
            color="primary"
            variant="contained"
          >
            {dialogType === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
