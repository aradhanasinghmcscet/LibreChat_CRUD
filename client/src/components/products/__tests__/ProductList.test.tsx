// ProductList.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../ProductList';
import { useApi } from '~/hooks/useApi';
import type { ListParams } from '~/common/types';
import '@testing-library/jest-dom';

jest.mock('~/hooks/useApi');

const mockCreate = jest.fn();
const mockRead = jest.fn();
const mockUpdate = jest.fn();
const mockRemove = jest.fn();

const mockedUseApi = useApi as jest.MockedFunction<typeof useApi>;

describe('ProductList Component', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    price: '100',
    description: 'Test description',
    quantity: '10',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseApi.mockReturnValue({
      create: mockCreate,
      read: mockRead,
      update: mockUpdate,
      remove: mockRemove,
      error: null,
      loading: false,
      list: function (endpoint: string, params?: ListParams): Promise<any> {
        throw new Error('Function not implemented.');
      },
      search: function (endpoint: string, query: any): Promise<any> {
        throw new Error('Function not implemented.');
      }
    });

    mockRead.mockResolvedValue({
      data: {
        items: [
          { _id: '1', name: 'Test Product', price: '100', description: 'Desc', quantity: '10' }
        ],
        count: 1
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    render(<ProductList />);
    expect(screen.getByText(/Product List/i)).toBeInTheDocument();
    await waitFor(() => expect(mockRead).toHaveBeenCalled());
  });

  it('displays fetched products', async () => {
    render(<ProductList />);
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/Price: \$100/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantity: 10/i)).toBeInTheDocument();
  });

  it('opens Add Product dialog', async () => {
    render(<ProductList />);
    fireEvent.click(screen.getByText(/Add Product/i));
    expect(await screen.findByText(/Add Product/i)).toBeInTheDocument();
  });

  it('adds a product', async () => {
    render(<ProductList />);
    fireEvent.click(screen.getByText(/Add Product/i));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Nice product' } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '5' } });

    fireEvent.click(screen.getByText(/Add$/)); // Dialog add button

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith('/products', {
        name: 'New Product',
        price: 50,
        description: 'Nice product',
        quantity: 5
      });
    });
  });

  it('opens and edits product', async () => {
    render(<ProductList />);
    fireEvent.click(await screen.findByText(/Edit/i));

    expect(await screen.findByText(/Edit Product/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '200' } });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith('/products', '1', expect.objectContaining({ price: 200 }));
    });
  });

  it('deletes a product with confirmation', async () => {
    window.confirm = jest.fn(() => true);
    render(<ProductList />);
    fireEvent.click(await screen.findByText(/Delete/i));
    await waitFor(() => expect(mockRemove).toHaveBeenCalledWith('/products', '1'));
  });

  it('filters products with search', async () => {
    render(<ProductList />);
    fireEvent.change(screen.getByPlaceholderText(/Search products/i), {
      target: { value: 'Test' }
    });
    expect(await screen.findByText(/Test Product/i)).toBeInTheDocument();
  });

  it('handles invalid price during add', async () => {
    render(<ProductList />);
    fireEvent.click(screen.getByText(/Add Product/i));
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Invalid' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByText(/Add$/));
    expect(await screen.findByText(/Please enter a valid name and price/i)).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    render(<ProductList />);
    fireEvent.click(await screen.findByRole('button', { name: /next/i }));
    await waitFor(() => expect(mockRead).toHaveBeenCalledTimes(2));
  });

  it('displays error if fetching fails', async () => {
    mockRead.mockRejectedValueOnce(new Error('Fail'));
    render(<ProductList />);
    expect(await screen.findByText(/Failed to fetch products/i)).toBeInTheDocument();
  });

  it('renders without error', () => {
    render(<ProductList />);
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search products/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Product/i)).toBeInTheDocument();
  });

  it('displays products with pagination', async () => {
    const mockProducts = [
      { ...mockProduct, _id: '1', name: 'Product 1' },
      { ...mockProduct, _id: '2', name: 'Product 2' },
      { ...mockProduct, _id: '3', name: 'Product 3' },
      { ...mockProduct, _id: '4', name: 'Product 4' }
    ];

    mockRead.mockResolvedValue({
      data: {
        items: mockProducts.slice(0, 3),
        total: 4,
        page: 1,
        limit: 3
      }
    });

    render(<ProductList />);
    await waitFor(() => expect(mockRead).toHaveBeenCalled());

    // Verify first page products
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();

    // Click next page
    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => expect(mockRead).toHaveBeenCalledTimes(2));

    // Verify second page product
    expect(screen.getByText('Product 4')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const mockProducts = [
      { ...mockProduct, _id: '1', name: 'Test Product' },
      { ...mockProduct, _id: '2', name: 'Another Product' }
    ];

    mockRead.mockResolvedValue({
      data: {
        items: mockProducts,
        total: 2,
        page: 1,
        limit: 10
      }
    });

    render(<ProductList />);
    await waitFor(() => expect(mockRead).toHaveBeenCalled());

    // Enter search term
    fireEvent.change(screen.getByPlaceholderText(/Search products/i), {
      target: { value: 'Test' }
    });

    // Verify only matching product is shown
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.queryByText('Another Product')).not.toBeInTheDocument();
  });

  it('handles product deletion', async () => {
    mockRead.mockResolvedValue({
      data: {
        items: [mockProduct],
        total: 1,
        page: 1,
        limit: 10
      }
    });

    render(<ProductList />);
    await waitFor(() => expect(mockRead).toHaveBeenCalled());

    // Click delete button
    fireEvent.click(screen.getByTestId('delete-button-1'));
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Yes, delete'));
    
    await waitFor(() => expect(mockRemove).toHaveBeenCalledWith('products', '1'));
  });

  it('handles product edit', async () => {
    mockRead.mockResolvedValue({
      data: {
        items: [mockProduct],
        total: 1,
        page: 1,
        limit: 10
      }
    });

    render(<ProductList />);
    await waitFor(() => expect(mockRead).toHaveBeenCalled());

    // Click edit button
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // Verify edit dialog is open
    expect(screen.getByText('Edit Product')).toBeInTheDocument();

    // Update product details
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Updated Product' } });
    fireEvent.click(screen.getByText(/Save$/));
    
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith('products', '1', { name: 'Updated Product' }));
  });

  it('handles add product', async () => {
    render(<ProductList />);
    
    // Click add button
    fireEvent.click(screen.getByText(/Add Product/i));
    
    // Verify add dialog is open
    expect(screen.getByText('Add New Product')).toBeInTheDocument();

    // Fill form and submit
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Description' } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '10' } });
    fireEvent.click(screen.getByText(/Add$/));
    
    await waitFor(() => expect(mockCreate).toHaveBeenCalledWith('products', {
      name: 'New Product',
      price: '100',
      description: 'Description',
      quantity: '10'
    }));
  });

  it('handles error state', async () => {
    mockRead.mockRejectedValue(new Error('Failed to load products'));

    render(<ProductList />);
    
    await waitFor(() => expect(screen.getByText('Failed to fetch products')).toBeInTheDocument());
  });

  it('handles form validation', async () => {
    render(<ProductList />);
    
    // Click add button
    fireEvent.click(screen.getByText(/Add Product/i));
    
    // Try to submit empty form
    fireEvent.click(screen.getByText(/Add$/));
    
    // Verify error messages
    expect(screen.getByText('Please enter a valid name')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid price')).toBeInTheDocument();
  });
});
