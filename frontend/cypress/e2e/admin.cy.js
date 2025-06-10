describe('Parcours Admin E2E', () => {
  beforeEach(() => {
    // Configuration initiale
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('http://localhost:5173');
  });

  it('Parcours complet de l\'administrateur', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.space-x-4 > .py-2').click();
    // Vérifier que la page de login se charge
    cy.get('h2').should('contain', 'Log In');
    cy.get('img[alt="Logo"]').should('be.visible');
    // Remplir le formulaire de connexion
    cy.get('input[type="email"]')
      .should('be.visible')
      .type('elouansaidisoukaina@gmail.com')
      .should('have.value', 'elouansaidisoukaina@gmail.com');

    cy.get('input[type="password"]')
      .should('be.visible')
      .type('PASS1234')
      .should('have.value', 'PASS1234');

    // Cocher "Remember me"
    cy.get('input[type="checkbox"]').check();

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.bg-purple-500').click();
    /* ==== End Cypress Studio ==== */
    // Soumettre le formulaire
    cy.get('button[type="submit"]')
      .should('contain', 'Log In')
      .click();
    
   
  });
});