import { testUser } from '../fixtures/products';

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('Login', () => {
    it('should show login form', () => {
      cy.get('h1').contains('Login').should('be.visible');
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button').contains('Login').should('be.visible');
    });

    it('should login successfully with valid credentials', () => {
      cy.login(testUser.username, testUser.password);
      
      // Verify redirection to products page
      cy.url().should('include', '/products');
      
      // Verify welcome message
      cy.get('.welcome-message').contains(`Welcome, ${testUser.username}`).should('be.visible');
    });

    it('should show error with invalid credentials', () => {
      cy.login('invalid', 'password');
      
      // Verify error message
      cy.get('.error').contains('Invalid username or password').should('be.visible');
    });

    it('should remember me functionality', () => {
      cy.get('input[name="username"]').type(testUser.username);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="remember"]').check();
      cy.get('button').contains('Login').click();
      
      // Refresh page and verify credentials are remembered
      cy.reload();
      cy.get('input[name="username"]').should('have.value', testUser.username);
      cy.get('input[name="password"]').should('have.value', testUser.password);
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      cy.login(testUser.username, testUser.password);
    });

    it('should logout successfully', () => {
      cy.get('button').contains('Logout').click();
      
      // Verify redirection to login page
      cy.url().should('include', '/login');
      
      // Verify welcome message is gone
      cy.get('.welcome-message').should('not.exist');
    });

    it('should clear session on logout', () => {
      cy.get('button').contains('Logout').click();
      
      // Try to access protected route
      cy.visit('/products');
      cy.url().should('include', '/login');
    });
  });

  describe('Password Reset', () => {
    it('should show password reset form', () => {
      cy.get('a').contains('Forgot Password?').click();
      cy.get('h1').contains('Reset Password').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('button').contains('Send Reset Link').should('be.visible');
    });

    it('should send reset link with valid email', () => {
      cy.get('a').contains('Forgot Password?').click();
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('button').contains('Send Reset Link').click();
      
      cy.get('.success').contains('Password reset link sent').should('be.visible');
    });

    it('should show error with invalid email', () => {
      cy.get('a').contains('Forgot Password?').click();
      cy.get('input[name="email"]').type('invalid@example.com');
      cy.get('button').contains('Send Reset Link').click();
      
      cy.get('.error').contains('Email not found').should('be.visible');
    });
  });
});
