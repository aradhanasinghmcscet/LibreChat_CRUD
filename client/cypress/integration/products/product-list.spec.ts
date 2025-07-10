describe('Product List Page', () => {
  beforeEach(() => {
    // Clear products before each test
    cy.deleteAllProducts();
    
    // Create initial products
    mockProducts.forEach(product => {
      cy.createProduct(product);
    });
    
    // Visit the products page
    cy.visit('/products');
  });
  beforeEach(() => {
    // Visit the products page before each test
    cy.visit('/products');
  });

  it('should display the product list page', () => {
    // Verify the page title
    cy.get('h1').should('contain', 'Products');

    // Verify the add product button exists
    cy.get('button').should('contain', 'Add Product');

    // Verify the search input exists
    cy.get('input[placeholder="Search products..."]').should('exist');
  });

  it('should handle pagination', () => {
    // Add more products to trigger pagination
    for (let i = 0; i < 10; i++) {
      cy.createProduct({
        name: `Product ${i + 4}`,
        price: '100',
        description: 'Test description',
        quantity: '10'
      });
    }

    // Verify pagination controls exist
    cy.get('.pagination').should('be.visible');
    cy.get('.pagination button').should('have.length', 5);

    // Click to next page
    cy.get('.pagination button').contains('Next').click();
    cy.url().should('include', '?page=2');

    // Click to previous page
    cy.get('.pagination button').contains('Previous').click();
    cy.url().should('include', '?page=1');
  });

  it('should filter products by status', () => {
    // Filter by active status
    cy.get('select[name="status"]').select('active');
    cy.get('table tr').should('have.length', 3); // Only active products should be shown

    // Filter by inactive status
    cy.get('select[name="status"]').select('inactive');
    cy.get('table tr').should('have.length', 2); // Only inactive products should be shown
  });

  it('should handle invalid product creation', () => {
    // Click add product button
    cy.get('button').contains('Add Product').click();

    // Try to submit empty form
    cy.get('button').contains('Create').click();

    // Verify validation errors
    cy.get('.error').should('have.length', 4); // All fields required

    // Try with invalid price
    cy.get('input[name="name"]').type('Invalid Product');
    cy.get('input[name="price"]').type('abc');
    cy.get('textarea[name="description"]').type('Test description');
    cy.get('input[name="quantity"]').type('10');
    cy.get('button').contains('Create').click();

    // Verify price validation error
    cy.get('.error').contains('Please enter a valid price').should('be.visible');

    // Try with invalid quantity
    cy.get('input[name="price"]').clear().type('100');
    cy.get('input[name="quantity"]').clear().type('abc');
    cy.get('button').contains('Create').click();

    // Verify quantity validation error
    cy.get('.error').contains('Please enter a valid quantity').should('be.visible');
  });

  it('should handle bulk actions', () => {
    // Select all products
    cy.get('input[type="checkbox"]').first().check();

    // Click delete selected
    cy.get('button').contains('Delete Selected').click();

    // Confirm deletion
    cy.get('button').contains('Yes, delete').click();

    // Verify products are deleted
    cy.get('table tr').should('have.length', 1); // Only header row remains
  });

  it('should add a new product', () => {
    // Click add product button
    cy.get('button').contains('Add Product').click();

    // Fill in the form
    cy.get('input[name="name"]').type('Test Product');
    cy.get('input[name="price"]').type('100');
    cy.get('textarea[name="description"]').type('Test description');
    cy.get('input[name="quantity"]').type('10');

    // Submit the form
    cy.get('button').contains('Create').click();

    // Verify the product is added
    cy.get('table').contains('Test Product').should('be.visible');
  });

  it('should search for products', () => {
    // Type in the search box
    cy.get('input[placeholder="Search products..."]').type('Test');

    // Verify only matching products are shown
    cy.get('table').contains('Test Product').should('be.visible');
    cy.get('table').contains('Another Product').should('not.exist');
  });

  it('should edit a product', () => {
    // Click edit button for a product
    cy.get('button').contains('Edit').first().click();

    // Update the product name
    cy.get('input[name="name"]').clear().type('Updated Product');

    // Submit the form
    cy.get('button').contains('Update').click();

    // Verify the product is updated
    cy.get('table').contains('Updated Product').should('be.visible');
  });

  it('should delete a product', () => {
    // Click delete button for a product
    cy.get('button').contains('Delete').first().click();

    // Confirm the deletion
    cy.get('button').contains('Yes, delete').click();

    // Verify the product is deleted
    cy.get('table').contains('Test Product').should('not.exist');
  });

  it('should handle validation errors', () => {
    // Click add product button
    cy.get('button').contains('Add Product').click();

    // Try to submit empty form
    cy.get('button').contains('Create').click();

    // Verify error messages
    cy.get('.error').should('contain', 'Please enter a name');
    cy.get('.error').should('contain', 'Please enter a price');
    cy.get('.error').should('contain', 'Please enter a description');
    cy.get('.error').should('contain', 'Please enter a quantity');
  });
});
