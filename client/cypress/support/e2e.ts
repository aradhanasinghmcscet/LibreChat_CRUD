/// <reference types="cypress" />

// Import fixtures
import { mockProducts, testUser, invalidProducts } from '../fixtures/products';

// Custom commands
Cypress.Commands.add('login', (username = testUser.username, password = testUser.password) => {
  cy.request('POST', '/api/auth/login', {
    username,
    password,
  }).then((response) => {
    if (response.status === 200) {
      // Store token in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('token', response.body.token);
      });
    }
  });
});

Cypress.Commands.add('createProduct', (product) => {
  cy.request('POST', '/api/products', product).then((response) => {
    if (response.status === 201) {
      cy.log(`Product created: ${product.name}`);
    }
  });
});

Cypress.Commands.add('deleteProduct', (productId) => {
  cy.request('DELETE', `/api/products/${productId}`).then((response) => {
    if (response.status === 200) {
      cy.log(`Product deleted: ${productId}`);
    }
  });
});

Cypress.Commands.add('deleteAllProducts', () => {
  cy.request('GET', '/api/products').then((response) => {
    const products = response.body;
    products.forEach((product: any) => {
      cy.deleteProduct(product._id);
    });
  });
});

// Custom assertions
Cypress.Commands.add('assertProductExists', (productName) => {
  cy.get('table').contains(productName).should('be.visible');
});

Cypress.Commands.add('assertProductDoesNotExist', (productName) => {
  cy.get('table').contains(productName).should('not.exist');
});

// Intercept API calls
beforeEach(() => {
  cy.intercept('GET', '/api/products*', {
    fixture: 'products.json'
  }).as('getProducts');

  cy.intercept('POST', '/api/products*', {
    fixture: 'product.json'
  }).as('createProduct');

  cy.intercept('PUT', '/api/products*', {
    fixture: 'product.json'
  }).as('updateProduct');

  cy.intercept('DELETE', '/api/products*', {
    statusCode: 200
  }).as('deleteProduct');
});
