/// <reference types="cypress" />

// Extend Cypress commands
Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', '/api/auth/login', {
    username,
    password,
  });
});

Cypress.Commands.add('createProduct', (product) => {
  cy.request('POST', '/api/products', product);
});

Cypress.Commands.add('deleteAllProducts', () => {
  cy.request('DELETE', '/api/products');
});

// Add custom assertions
Cypress.Commands.add('assertProductExists', (productName) => {
  cy.get('table').contains(productName).should('be.visible');
});

Cypress.Commands.add('assertProductDoesNotExist', (productName) => {
  cy.get('table').contains(productName).should('not.exist');
});
