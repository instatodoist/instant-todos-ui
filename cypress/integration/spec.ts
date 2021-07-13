describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('InstaTodos');
    cy.contains('Get Started');
  });
});
