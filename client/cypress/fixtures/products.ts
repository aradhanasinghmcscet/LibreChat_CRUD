export const mockProducts = [
  {
    _id: '1',
    name: 'Product 1',
    price: '100',
    description: 'First product description',
    quantity: '10',
    status: 'active',
    createdAt: '2025-07-10T05:41:43.000Z',
    updatedAt: '2025-07-10T05:41:43.000Z'
  },
  {
    _id: '2',
    name: 'Product 2',
    price: '200',
    description: 'Second product description',
    quantity: '20',
    status: 'inactive',
    createdAt: '2025-07-10T05:41:43.000Z',
    updatedAt: '2025-07-10T05:41:43.000Z'
  },
  {
    _id: '3',
    name: 'Product 3',
    price: '300',
    description: 'Third product description',
    quantity: '30',
    status: 'active',
    createdAt: '2025-07-10T05:41:43.000Z',
    updatedAt: '2025-07-10T05:41:43.000Z'
  }
];

export const testUser = {
  username: 'testuser',
  password: 'password123',
  email: 'test@example.com',
  role: 'admin'
};

export const invalidProducts = {
  missingRequired: {
    name: '',
    price: '',
    description: '',
    quantity: ''
  },
  invalidPrice: {
    name: 'Invalid Product',
    price: 'abc',
    description: 'Test description',
    quantity: '10'
  },
  invalidQuantity: {
    name: 'Invalid Product',
    price: '100',
    description: 'Test description',
    quantity: 'abc'
  }
};
