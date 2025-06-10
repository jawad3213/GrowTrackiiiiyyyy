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


    /* ==== Generated with Cypress Studio ==== */

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.px-3 > .text-gray-500').click();
    cy.get(':nth-child(3) > .menu-item').click();
    cy.get(':nth-child(3) > div > .mt-2 > :nth-child(1) > .menu-dropdown-item').click();
    cy.get('.bg-\\[\\#F97316\\]').click();
    cy.get('.space-y-4 > :nth-child(1) > :nth-child(1) > .w-full').clear('R');
    cy.get('.space-y-4 > :nth-child(1) > :nth-child(1) > .w-full').type('Rim El Ibrahimi');
    cy.get(':nth-child(1) > :nth-child(2) > .w-full').clear('k');
    cy.get(':nth-child(1) > :nth-child(2) > .w-full').type('k564125');
    cy.get('.space-y-4 > :nth-child(2) > .w-full').clear('C');
    cy.get('.space-y-4 > :nth-child(2) > .w-full').type('CNE13548');
    cy.get(':nth-child(3) > .w-full').clear('e');
    cy.get(':nth-child(3) > .w-full').type('elibrahimi.rim@student.univ.ma');

    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(4) > .w-full').clear('P');
    cy.get(':nth-child(4) > .w-full').type('PASSs1234');
    cy.get(':nth-child(6) > :nth-child(1) > .w-full').select('CI1');
    cy.get(':nth-child(6) > :nth-child(2) > .w-full').select('GSR1');
    cy.get('.font-semibold > span').click();
    cy.get(':nth-child(49) > .space-x-4 > .text-blue-500 > .h-5 > path').click();
    cy.get(':nth-child(4) > :nth-child(1) > .w-full').select('CI2');
    cy.get('.font-semibold > span').click();
    cy.get(':nth-child(49) > .space-x-4 > .text-red-500 > svg > path').click();
    cy.get('.bg-red-600').click();
    cy.get(':nth-child(3) > div > .mt-2 > :nth-child(2) > .menu-dropdown-item').click();
    /* ==== End Cypress Studio ==== */
  });
});