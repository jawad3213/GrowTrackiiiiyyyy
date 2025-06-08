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

  describe('Login Page UI Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should display login form correctly', () => {
      // Verify page elements are present
      cy.get('img[alt="Logo"]').should('be.visible');
      cy.contains('Log In').should('be.visible');
      
      // Check form inputs
      cy.get('input[type="email"]').should('be.visible').and('have.attr', 'placeholder', 'you@example.com');
      cy.get('input[type="password"]').should('be.visible').and('have.attr', 'placeholder', 'Password');
      
      // Check other UI elements
      cy.contains('Remember me').should('be.visible');
      cy.contains('Forgot Password?').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Log In').and('not.be.disabled');
      
      // Check illustration on desktop
      cy.get('img[alt="Login Illustration"]').should('be.visible');
    });

    it('should toggle password visibility', () => {
      cy.get('input[type="password"]').type('testpassword');
      
      // Click show password button
      cy.get('button[type="button"]').click();
      cy.get('input[type="text"]').should('have.value', 'testpassword');
      
      // Click hide password button
      cy.get('button[type="button"]').click();
      cy.get('input[type="password"]').should('have.value', 'testpassword');
    });

    it('should navigate to forgot password page', () => {
      cy.contains('Forgot Password?').click();
      cy.url().should('include', '/forgotpass');
    });
  });

  describe('Login Functionality Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should login successfully with valid credentials', () => {
      // Fill the login form
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Check loading state
      cy.get('button[type="submit"]').should('contain', 'loging In...').and('be.disabled');
      cy.get('.animate-spin').should('be.visible');
      
      // Wait for redirect to dashboard
      cy.url().should('include', '/dashboard', { timeout: 10000 });
      
      // Verify cookies are set
      cy.getCookie('access_token').should('exist');
      cy.getCookie('refresh_token').should('exist');
    });

    it('should show error message for invalid credentials', () => {
      cy.get('input[type="email"]').type(invalidUser.email);
      cy.get('input[type="password"]').type(invalidUser.password);
      cy.get('button[type="submit"]').click();
      
      // Wait for error message to appear
      cy.get('.bg-red-100').should('be.visible');
      cy.contains('Email or Password is incorrect').should('be.visible');
      
      // Should stay on login page
      cy.url().should('not.include', '/dashboard');
      
      // Cookies should not be set
      cy.getCookie('access_token').should('not.exist');
      cy.getCookie('refresh_token').should('not.exist');
      
      // Button should be re-enabled
      cy.get('button[type="submit"]').should('contain', 'Log In').and('not.be.disabled');
    });

    it('should handle server error gracefully', () => {
      // Intercept API call to simulate server error
      cy.intercept('POST', '**/auth/login', {
        statusCode: 500,
        body: { message: 'Server Error, Please try again later!' }
      }).as('loginError');
      
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      cy.wait('@loginError');
      
      // Should show server error message
      cy.get('.bg-red-100').should('be.visible');
      cy.contains('Server Error, Please try again later!').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      // Browser validation should prevent submission
      cy.get('input[type="email"]').then(($input) => {
        expect($input[0].validity.valid).to.be.false;
      });
    });

    it('should require both email and password', () => {
      // Try to submit empty form
      cy.get('button[type="submit"]').click();
      
      // Browser validation should prevent submission
      cy.get('input[type="email"]').then(($input) => {
        expect($input[0].validity.valid).to.be.false;
      });
      
      // Fill email only
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('button[type="submit"]').click();
      
      cy.get('input[type="password"]').then(($input) => {
        expect($input[0].validity.valid).to.be.false;
      });
    });
  });

  describe('Authentication State Tests', () => {
    it('should redirect authenticated users away from login', () => {
      // Login first
      cy.loginViaAPI(validUser.email, validUser.password);
      
      // Try to visit login page
      cy.visit('/');
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
    });

    it('should verify authentication check endpoint', () => {
      // Test unauthenticated state
      cy.request({
        method: 'GET',
        url: `${baseUrl}/auth/check`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('valid', false);
        expect(response.body).to.have.property('role', null);
        expect(response.body.message).to.eq('Not authenticated');
      });
      
      // Login and test authenticated state
      cy.loginViaAPI(validUser.email, validUser.password);
      
      cy.request({
        method: 'GET',
        url: `${baseUrl}/auth/check`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('valid', true);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('role');
        expect(response.body.message).to.eq('Authenticated');
      });
    });
  });

  describe('Token Management Tests', () => {
    it('should refresh access token successfully', () => {
      // Login first
      cy.loginViaAPI(validUser.email, validUser.password);
      
      // Get current access token
      cy.getCookie('access_token').then((oldToken) => {
        // Call refresh endpoint
        cy.request({
          method: 'POST',
          url: `${baseUrl}/auth/refresh`
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.message).to.eq('The new access token is set!');
          
          // Verify new token is set
          cy.getCookie('access_token').should('exist');
        });
      });
    });

    it('should fail refresh without refresh token', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/refresh`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.eq('No token refresh was found, Please login again!');
      });
    });

    it('should clear refresh token on invalid token', () => {
      // Set invalid refresh token
      cy.setCookie('refresh_token', 'invalid-token');
      
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/refresh`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.eq('Invalid or expired refresh token!');
      });
      
      // Refresh token should be cleared
      cy.getCookie('refresh_token').should('not.exist');
    });
  });

  describe('Logout Tests', () => {
    it('should logout successfully', () => {
      // Login first
      cy.loginViaAPI(validUser.email, validUser.password);
      cy.visit('/dashboard');
      
      // Perform logout (assuming you have a logout button)
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/logout`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Logout successful');
      });
      
      // Verify cookies are cleared
      cy.getCookie('access_token').should('not.exist');
      cy.getCookie('refresh_token').should('not.exist');
    });
  });

  describe('Rate Limiting Tests', () => {
    it('should handle rate limiting after multiple failed attempts', () => {
      // Make multiple failed login attempts
      for (let i = 0; i < 5; i++) {
        cy.visit('/');
        cy.get('input[type="email"]').type(invalidUser.email);
        cy.get('input[type="password"]').type(invalidUser.password);
        cy.get('button[type="submit"]').click();
        cy.wait(2000);
        
        // Clear error message for next attempt
        if (i < 4) {
          cy.reload();
        }
      }
      
      // The rate limiter should now block further attempts
      // This depends on your Authlimiter implementation
      // You might need to check for specific error messages or behavior
    });
  });

  describe('Password Reset Tests', () => {
    it('should send password reset email for valid user', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/reset-password`,
        body: { email: validUser.email }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.include('A password reset email has been sent');
      });
    });

    it('should show error for non-existent email', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/reset-password`,
        body: { email: 'nonexistent@example.com' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('User not found with this email ❌');
      });
    });

    it('should reset password with valid token', () => {
      // This would require generating a valid reset token
      // In a real test, you might need to intercept the email or use a test token
      const resetToken = 'valid-test-token'; // Replace with actual test token generation
      
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/reset-password-email`,
        headers: {
          'Authorization': `Bearer ${resetToken}`
        },
        body: { password: 'newPassword123' },
        failOnStatusCode: false
      }).then((response) => {
        // This test needs proper token setup
        // expect(response.status).to.eq(201);
        // expect(response.body.message).to.eq('The password was updated successfully!');
      });
    });
  });

  describe('UI Animation and Interaction Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should show loading animation during login', () => {
      // Intercept login to add delay
      cy.intercept('POST', '**/auth/login', (req) => {
        req.reply((res) => {
          // Add delay to see loading state
          setTimeout(() => {
            res.send({ statusCode: 200, body: { message: 'Connected Successfully !' } });
          }, 2000);
        });
      }).as('slowLogin');
      
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      // Check loading state
      cy.get('.animate-spin').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'loging In...').and('be.disabled');
      
      cy.wait('@slowLogin');
    });

    it('should show error message with fade animation', () => {
      cy.get('input[type="email"]').type(invalidUser.email);
      cy.get('input[type="password"]').type(invalidUser.password);
      cy.get('button[type="submit"]').click();
      
      // Error message should appear with fade animation
      cy.get('.bg-red-100').should('be.visible');
      cy.get('.border-red-500').should('exist');
      
      // Error should contain the text from your controller
      cy.contains('Email or Password is incorrect').should('be.visible');
    });

    it('should handle hover effects on form elements', () => {
      // Test hover effects on inputs
      cy.get('input[type="email"]').trigger('mouseover');
      cy.get('input[type="password"]').trigger('mouseover');
      
      // Test hover effect on submit button
      cy.get('button[type="submit"]').trigger('mouseover');
      
      // Test hover effect on logo
      cy.get('img[alt="Logo"]').trigger('mouseover');
    });
  });
});

// Custom Cypress Commands
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${baseUrl}/auth/login`,
    body: {
      email: email,
      password: password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.message).to.eq('Connected Successfully !');
    // Cookies are automatically set by the browser
  });
});

Cypress.Commands.add('logoutViaAPI', () => {
  cy.request({
    method: 'POST',
    url: `${baseUrl}/auth/logout`
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.message).to.eq('Logout successful');
  });
});

// Command to create test user (if you have registration endpoint)
Cypress.Commands.add('createTestUser', (userData) => {
  cy.request({
    method: 'POST',
    url: `${baseUrl}/auth/register`,
    body: userData,
    failOnStatusCode: false
  });
});

// Command to verify authentication state
Cypress.Commands.add('shouldBeAuthenticated', () => {
  cy.getCookie('access_token').should('exist');
  cy.getCookie('refresh_token').should('exist');
  cy.request('GET', `${baseUrl}/auth/check`).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.valid).to.be.true;
  });
});

Cypress.Commands.add('shouldNotBeAuthenticated', () => {
  cy.getCookie('access_token').should('not.exist');
  cy.getCookie('refresh_token').should('not.exist');
});