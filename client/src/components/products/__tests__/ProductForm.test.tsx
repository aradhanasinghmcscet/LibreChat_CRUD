import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from '../ProductForm';
import { useApi } from '~/hooks/useApi';
import '@testing-library/jest-dom';

jest.mock('@mui/material', () => ({
  TextField: 'TextField',
  Button: 'Button',
  Dialog: 'Dialog',
  DialogTitle: 'DialogTitle',
  DialogContent: 'DialogContent',
  DialogActions: 'DialogActions',
}));

describe('ProductForm Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    price: '100',
    description: 'Test description',
    quantity: '10',
    status: 'active'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add form correctly', () => {
    render(<ProductForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('renders edit form correctly', () => {
    render(<ProductForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} product={mockProduct} />);
    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByLabelText('Product Name')).toHaveValue('Test Product');
    expect(screen.getByLabelText('Price')).toHaveValue('100');
    expect(screen.getByLabelText('Description')).toHaveValue('Test description');
    expect(screen.getByLabelText('Status')).toHaveValue('active');
  });

  it('handles form submission', async () => {
    render(<ProductForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Description' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'active' } });
    
    fireEvent.click(screen.getByText('Create'));
    
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'New Product',
      price: '100',
      description: 'Description',
      quantity: '10',
      status: 'active'
    }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles form validation', async () => {
    render(<ProductForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    fireEvent.click(screen.getByText('Create'));
    
    expect(screen.getByText(/Please enter a name/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a price/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a description/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a quantity/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select a status/i)).toBeInTheDocument();
  });

  it('handles form close', () => {
    render(<ProductForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    fireEvent.click(screen.getByText(/Cancel/i));
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles edit form submission', async () => {
    render(<ProductForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} product={mockProduct} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Updated Product' } });
    fireEvent.click(screen.getByText('Update'));
    
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith({
      _id: '1',
      name: 'Updated Product',
      price: '100',
      description: 'Test description',
      quantity: '10',
      status: 'active'
    }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles invalid price input', async () => {
    render(<ProductForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByText('Create'));
    
    expect(screen.getByText(/Please enter a valid price/i)).toBeInTheDocument();
  });

  it('handles invalid quantity input', async () => {
    render(<ProductForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByText('Create'));
    
    expect(screen.getByText(/Please enter a valid quantity/i)).toBeInTheDocument();
  });

  it('renders in create mode', () => {
    render(
      <ProductForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders in edit mode', () => {
    render(
      <ProductForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        product={mockProduct}
      />
    );

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(
      <ProductForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('Product Name'), {
      target: { value: 'New Product' }
    });
    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '200' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New description' }
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'inactive' }
    });

    expect(screen.getByLabelText('Product Name')).toHaveValue('New Product');
    expect(screen.getByLabelText('Price')).toHaveValue('200');
    expect(screen.getByLabelText('Description')).toHaveValue('New description');
    expect(screen.getByLabelText('Status')).toHaveValue('inactive');
  });

  it('submits form data correctly', async () => {
    render(
      <ProductForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('Product Name'), {
      target: { value: 'Test Product' }
    });
    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '150' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test description' }
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'active' }
    });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Product',
        price: '150',
        description: 'Test description',
        status: 'active'
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('closes dialog when cancel is clicked', () => {
    render(
      <ProductForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('pre-fills form in edit mode', () => {
    render(
      <ProductForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        product={mockProduct}
      />
    );

    expect(screen.getByLabelText('Product Name')).toHaveValue('Test Product');
    expect(screen.getByLabelText('Price')).toHaveValue('100');
    expect(screen.getByLabelText('Description')).toHaveValue('Test description');
    expect(screen.getByLabelText('Status')).toHaveValue('active');
  });
});
