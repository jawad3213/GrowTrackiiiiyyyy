describe('Authentication E2E Tests', () => {
  const baseUrl = 'http://localhost:3000'; // Adjust to your backend URL
  const frontendUrl = 'http://localhost:5173';
  
  // Test data - update with real test user credentials
  const validUser = {
    email: 'test@example.com',
    password: 'validPassword123'
  };
  
  const invalidUser = {
    email: 'invalid@example.com',
    password: 'wrongPassword'
  };

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    // Clear any Pinia store state if persisted
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });
});
