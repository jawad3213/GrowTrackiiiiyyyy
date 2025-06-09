describe('template spec', () => {
  it('passes', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:5173');
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('test1', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:5173');
    cy.get('.space-x-4 > .py-2').click();
    cy.get('.max-w-md > :nth-child(1) > .w-full').clear('y');
    cy.get('.max-w-md > :nth-child(1) > .w-full').type('youssef.fassi@example.com');
    cy.get('.relative > .w-full').clear('P');
    cy.get('.relative > .w-full').type('PASS1234');
    cy.get('.rounded-full > span').click();
    cy.get('.text-3xl').should('be.visible');
    cy.get('.px-3 > .text-gray-500').click();
    cy.get(':nth-child(5) > .menu-item').click();
    cy.get(':nth-child(5) > div > .mt-2 > :nth-child(2) > .menu-dropdown-item').click();
    cy.get('.fill-current').click();
    cy.get(':nth-child(2) > :nth-child(5) > .text-blue-500 > svg').click();
    cy.get('.bg-green-600').click();
    /* ==== End Cypress Studio ==== */
  });
})