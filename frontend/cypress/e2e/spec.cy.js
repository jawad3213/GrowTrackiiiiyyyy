describe('template spec', () => {
  it('passes', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:5173/');
    cy.get('.space-x-4 > .py-2').click();
    cy.get('.max-w-md > :nth-child(1) > .w-full').clear('y');
    cy.get('.max-w-md > :nth-child(1) > .w-full').type('youssef.fassi@example.com');
    cy.get('.relative > .w-full').clear('P');
    cy.get('.relative > .w-full').type('PASS1234');
    cy.get('.bg-gray-200').click();
    cy.get('.rounded-full > span').click();
    /* ==== End Cypress Studio ==== */
  })
})