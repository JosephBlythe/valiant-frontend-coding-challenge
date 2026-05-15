const API_BASE = 'http://localhost:5001'

Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('mockLoanAPIs', () => {
  cy.intercept('GET', `${API_BASE}/loan-purposes`, { fixture: 'loan-purposes.json' }).as('loanPurposes')
  cy.intercept('GET', `${API_BASE}/requested-repayment-periods`, { fixture: 'repayment-periods.json' }).as('repaymentPeriods')
  cy.intercept('GET', `${API_BASE}/requested-term-months`, { fixture: 'loan-terms.json' }).as('loanTerms')
})

Cypress.Commands.add('waitForAPIs', () => {
  cy.wait(['@loanPurposes', '@repaymentPeriods', '@loanTerms'])
})
