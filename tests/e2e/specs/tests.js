const API_BASE = 'http://localhost:5001'

describe('Loan Calculator Widget', () => {
  // ─── Loading states ──────────────────────────────────────────────────────────

  describe('Loading states', () => {
    it('shows skeletons while API requests are in flight', () => {
      const delayed = (fixture) => (req) => req.reply({ delay: 500, fixture })

      cy.intercept('GET', `${API_BASE}/loan-purposes`, delayed('loan-purposes.json')).as('loanPurposes')
      cy.intercept('GET', `${API_BASE}/requested-repayment-periods`, delayed('repayment-periods.json')).as('repaymentPeriods')
      cy.intercept('GET', `${API_BASE}/requested-term-months`, delayed('loan-terms.json')).as('loanTerms')

      cy.visit('/')

      cy.getByTestId('loan-purpose-skeleton').should('be.visible')
      cy.getByTestId('repayment-period-skeleton').should('be.visible')
      cy.getByTestId('loan-term-skeleton').should('be.visible')
    })

    it('replaces skeletons with select fields after APIs resolve', () => {
      cy.mockLoanAPIs()
      cy.visit('/')
      cy.waitForAPIs()

      cy.getByTestId('loan-purpose-skeleton').should('not.exist')
      cy.getByTestId('repayment-period-skeleton').should('not.exist')
      cy.getByTestId('loan-term-skeleton').should('not.exist')

      cy.getByTestId('loan-purpose-select').find('select').should('be.visible')
      cy.getByTestId('repayment-period-select').find('select').should('be.visible')
      cy.getByTestId('loan-term-select').find('select').should('be.visible')
    })
  })

  // ─── Widget structure ─────────────────────────────────────────────────────────

  describe('Widget structure', () => {
    beforeEach(() => {
      cy.mockLoanAPIs()
      cy.visit('/')
      cy.waitForAPIs()
    })

    it('renders the widget', () => {
      cy.getByTestId('loan-calculator-widget').should('be.visible')
    })

    it('shows the heading', () => {
      cy.contains('Tell us about your ideal loan').should('be.visible')
    })

    it('shows the loan amount input with a dollar prefix', () => {
      cy.getByTestId('loan-amount-input').should('be.visible').and('contain.text', '$')
    })

    it('shows the calculation results area', () => {
      cy.getByTestId('calculation-results').should('be.visible')
    })

    it('shows no validation errors on initial load', () => {
      cy.getByTestId('validation-errors').should('not.exist')
    })
  })

  // ─── Loan amount input ────────────────────────────────────────────────────────

  describe('Loan amount input', () => {
    beforeEach(() => {
      cy.mockLoanAPIs()
      cy.visit('/')
      cy.waitForAPIs()
    })

    it('formats a valid amount with thousand separators on blur', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('50000')
      cy.getByTestId('loan-amount-field').blur()
      cy.getByTestId('loan-amount-field').should('have.value', '50,000')
    })

    it('clamps an amount below $1,000 to $1,000 on blur', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('500')
      cy.getByTestId('loan-amount-field').blur()
      cy.getByTestId('loan-amount-field').should('have.value', '1,000')
    })

    it('clamps an amount above $20,000,000 to $20,000,000 on blur', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('99999999')
      cy.getByTestId('loan-amount-field').blur()
      cy.getByTestId('loan-amount-field').should('have.value', '20,000,000')
    })

    it('shows no validation errors after clamping a below-minimum amount', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('500')
      cy.getByTestId('loan-amount-field').blur()
      cy.getByTestId('validation-errors').should('not.exist')
    })
  })

  // ─── Select fields ────────────────────────────────────────────────────────────

  describe('Select fields', () => {
    beforeEach(() => {
      cy.mockLoanAPIs()
      cy.visit('/')
      cy.waitForAPIs()
    })

    it('auto-selects the first option for each dropdown after APIs load', () => {
      cy.getByTestId('loan-purpose-select').find('select').should('have.value', 'business')
      cy.getByTestId('repayment-period-select').find('select').should('have.value', '12')
      cy.getByTestId('loan-term-select').find('select').should('have.value', '12')
    })

    it('populates loan purpose options from the API', () => {
      cy.getByTestId('loan-purpose-select').find('select option:not([disabled])')
        .should('have.length', 3)
    })

    it('can select a different loan purpose', () => {
      cy.getByTestId('loan-purpose-select').find('select').select('Vehicle')
      cy.getByTestId('loan-purpose-select').find('select').should('have.value', 'vehicle')
    })

    it('can select a different repayment period', () => {
      cy.getByTestId('repayment-period-select').find('select').select('Fortnightly')
      cy.getByTestId('repayment-period-select').find('select').should('have.value', '26')
    })

    it('can select a different loan term', () => {
      cy.getByTestId('loan-term-select').find('select').select('3 years')
      cy.getByTestId('loan-term-select').find('select').should('have.value', '36')
    })
  })

  // ─── API failure handling ─────────────────────────────────────────────────────

  describe('API failure handling', () => {
    it('shows a friendly error message with a retry button when APIs fail', () => {
      cy.intercept('GET', `${API_BASE}/loan-purposes`, { forceNetworkError: true })
      cy.intercept('GET', `${API_BASE}/requested-repayment-periods`, { forceNetworkError: true })
      cy.intercept('GET', `${API_BASE}/requested-term-months`, { forceNetworkError: true })

      cy.visit('/')

      cy.getByTestId('loan-calculator-widget').should('be.visible')
      cy.getByTestId('api-error').should('be.visible')
      cy.getByTestId('api-error').should('contain.text', 'Something went wrong')
      cy.getByTestId('api-error-retry').should('be.visible')

      cy.getByTestId('loan-purpose-select').should('not.exist')
      cy.getByTestId('repayment-period-select').should('not.exist')
      cy.getByTestId('loan-term-select').should('not.exist')
      cy.getByTestId('calculation-results').should('not.exist')
    })
  })

  // ─── Calculation results ──────────────────────────────────────────────────────

  describe('Calculation results', () => {
    beforeEach(() => {
      cy.mockLoanAPIs()
      cy.visit('/')
      cy.waitForAPIs()
    })

    it('displays formatted payment amounts after entering a valid loan amount', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('10000')
      cy.getByTestId('loan-amount-field').blur()

      cy.getByTestId('payment-per-period')
        .invoke('text').invoke('trim')
        .should('match', /^\$[\d,]+$/)

      cy.getByTestId('total-payment')
        .should('contain.text', '$')
        .should('contain.text', 'Total Repayments')
    })

    it('shows the period label matching the selected repayment period', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('10000')
      cy.getByTestId('loan-amount-field').blur()

      cy.getByTestId('period-label')
        .should('contain.text', 'Monthly')
        .should('contain.text', 'Repayments')
    })

    it('updates the period label when the repayment period changes', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('10000')
      cy.getByTestId('loan-amount-field').blur()

      cy.getByTestId('repayment-period-select').find('select').select('Fortnightly')

      cy.getByTestId('period-label').should('contain.text', 'Fortnightly')
    })

    it('updates the period label when switching to weekly', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('10000')
      cy.getByTestId('loan-amount-field').blur()

      cy.getByTestId('repayment-period-select').find('select').select('Weekly')

      cy.getByTestId('period-label').should('contain.text', 'Weekly')
    })

    it('recalculates payment when the loan term changes', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('10000')
      cy.getByTestId('loan-amount-field').blur()

      cy.getByTestId('payment-per-period')
        .invoke('text')
        .then((initialPayment) => {
          // 5-year term means more periods → lower per-period payment
          cy.getByTestId('loan-term-select').find('select').select('5 years')
          cy.getByTestId('payment-per-period').invoke('text').should('not.eq', initialPayment)
        })
    })

    it('recalculates payment when the loan purpose changes (different interest rate)', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('10000')
      cy.getByTestId('loan-amount-field').blur()

      cy.getByTestId('payment-per-period')
        .invoke('text')
        .then((initialPayment) => {
          // Vehicle (8%) vs Business (12%) → lower payment
          cy.getByTestId('loan-purpose-select').find('select').select('Vehicle')
          cy.getByTestId('payment-per-period').invoke('text').should('not.eq', initialPayment)
        })
    })

    it('recalculates total payment when the loan amount changes', () => {
      cy.getByTestId('loan-amount-field').clear()
      cy.getByTestId('loan-amount-field').type('10000')
      cy.getByTestId('loan-amount-field').blur()

      cy.getByTestId('total-payment')
        .invoke('text')
        .then((initialTotal) => {
          cy.getByTestId('loan-amount-field').clear()
          cy.getByTestId('loan-amount-field').type('20000')
          cy.getByTestId('loan-amount-field').blur()
          cy.getByTestId('total-payment').invoke('text').should('not.eq', initialTotal)
        })
    })
  })
})
