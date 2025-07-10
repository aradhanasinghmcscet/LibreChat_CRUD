import { testUser } from '../fixtures/products';

describe('Navigation Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should navigate from login to products page', () => {
    // Verify we're on login page
    cy.url().should('include', '/login');
    cy.get('h1').contains('Login').should('be.visible');

    // Fill in login credentials
    cy.get('input[name="username"]').type(testUser.username);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button').contains('Login').click();

    // Verify navigation to products page
    cy.url().should('include', '/c/products');
    cy.get('h1').contains('Products').should('be.visible');

    // Verify product list is displayed
    cy.get('table').should('be.visible');
    cy.get('button').contains('Add Product').should('be.visible');
    cy.get('input[placeholder="Search products..."]').should('be.visible');
  });

  it('should handle invalid navigation attempts', () => {
    // Try to access products page directly without login
    cy.visit('/c/products');

    // Verify redirection to login page
    cy.url().should('include', '/login');
    cy.get('h1').contains('Login').should('be.visible');

    // Verify error message
    cy.get('.error').contains('Please login to access this page').should('be.visible');
  });

  it('should handle logout and redirect', () => {
    // Login first
    cy.login(testUser.username, testUser.password);
    
    // Click logout
    cy.get('button').contains('Logout').click();

    // Verify redirected to login page
    cy.url().should('include', '/login');
    cy.get('h1').contains('Login').should('be.visible');
  });

  it('should maintain session after page refresh', () => {
    // Login first
    cy.login(testUser.username, testUser.password);
    
    // Refresh the page
    cy.reload();

    // Verify still on products page
    cy.url().should('include', '/c/products');
    cy.get('h1').contains('Products').should('be.visible');
  });
});
