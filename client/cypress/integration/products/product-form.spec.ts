import { mockProducts, invalidProducts } from '../../fixtures/products';

describe('Product Form Component', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  describe('Add Product Form', () => {
    beforeEach(() => {
      cy.get('button').contains('Add Product').click();
    });

    it('should validate form fields', () => {
      // Submit empty form
      cy.get('button').contains('Create').click();
      cy.get('.error').should('have.length', 4); // All fields required

      // Test invalid price
      cy.get('input[name="name"]').type('Test Product');
      cy.get('input[name="price"]').type('abc');
      cy.get('textarea[name="description"]').type('Test description');
      cy.get('input[name="quantity"]').type('10');
      cy.get('button').contains('Create').click();
      cy.get('.error').contains('Please enter a valid price').should('be.visible');

      // Test invalid quantity
      cy.get('input[name="price"]').clear().type('100');
      cy.get('input[name="quantity"]').clear().type('abc');
      cy.get('button').contains('Create').click();
      cy.get('.error').contains('Please enter a valid quantity').should('be.visible');
    });

    it('should handle form submission', () => {
      const newProduct = {
        name: 'New Test Product',
        price: '200',
        description: 'Test description',
        quantity: '20'
      };

      // Fill in the form
      cy.get('input[name="name"]').type(newProduct.name);
      cy.get('input[name="price"]').type(newProduct.price);
      cy.get('textarea[name="description"]').type(newProduct.description);
      cy.get('input[name="quantity"]').type(newProduct.quantity);

      // Submit the form
      cy.get('button').contains('Create').click();

      // Verify success message
      cy.get('.success').contains('Product created successfully').should('be.visible');

      // Verify product is added to list
      cy.get('table').contains(newProduct.name).should('be.visible');
    });

    it('should handle form cancellation', () => {
      // Fill in some data
      cy.get('input[name="name"]').type('Test Product');
      cy.get('input[name="price"]').type('100');

      // Click cancel
      cy.get('button').contains('Cancel').click();

      // Verify form is closed
      cy.get('dialog').should('not.exist');
    });
  });

  describe('Edit Product Form', () => {
    beforeEach(() => {
      // Create a product to edit
      cy.createProduct(mockProducts[0]);
      cy.get('button').contains('Edit').first().click();
    });

    it('should update product details', () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: '150',
        description: 'Updated description',
        quantity: '25'
      };

      // Update the form
      cy.get('input[name="name"]').clear().type(updatedProduct.name);
      cy.get('input[name="price"]').clear().type(updatedProduct.price);
      cy.get('textarea[name="description"]').clear().type(updatedProduct.description);
      cy.get('input[name="quantity"]').clear().type(updatedProduct.quantity);

      // Submit the form
      cy.get('button').contains('Update').click();

      // Verify success message
      cy.get('.success').contains('Product updated successfully').should('be.visible');

      // Verify product is updated in list
      cy.get('table').contains(updatedProduct.name).should('be.visible');
    });

    it('should handle edit form validation', () => {
      // Clear all fields
      cy.get('input[name="name"]').clear();
      cy.get('input[name="price"]').clear();
      cy.get('textarea[name="description"]').clear();
      cy.get('input[name="quantity"]').clear();

      // Try to submit
      cy.get('button').contains('Update').click();

      // Verify validation errors
      cy.get('.error').should('have.length', 4); // All fields required
    });
  });
});
