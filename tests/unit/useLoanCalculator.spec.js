import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, computed, effectScope } from 'vue'
import { useLoansAPI } from '@/composables/useLoansAPI'
import { useLoanCalculator } from '@/composables/useLoanCalculator'

vi.mock('@/composables/useLoansAPI', () => ({
  useLoansAPI: vi.fn(),
}))

const MOCK_PURPOSES = [
  { value: 'general', label: 'General', annualRate: 0.1 },
  { value: 'vehicle', label: 'Vehicle', annualRate: 0.12 },
]
const MOCK_PERIODS = [
  { value: 12, label: 'Monthly' },
  { value: 26, label: 'Fortnightly' },
]
const MOCK_TERMS = [
  { value: 12, label: '1 Year' },
  { value: 24, label: '2 Years' },
]

function makeApiMock ({
  purposes = MOCK_PURPOSES,
  periods = MOCK_PERIODS,
  terms = MOCK_TERMS,
  loadingOverrides = {},
  errorsOverrides = {},
} = {}) {
  const loading = ref({ purposes: false, periods: false, terms: false, ...loadingOverrides })
  const errors = ref({ purposes: null, periods: null, terms: null, ...errorsOverrides })
  return {
    loanPurposes: ref(purposes),
    repaymentPeriods: ref(periods),
    loanTerms: ref(terms),
    loading,
    errors,
    isLoading: computed(() => loading.value.purposes || loading.value.periods || loading.value.terms),
  }
}

describe('useLoanCalculator', () => {
  let scope, calc

  /**
   * Creates (or re-creates) the effect scope and calculator instance.
   * Stops any existing scope first, so tests can call this mid-test to
   * switch to a different API mock without leaking scopes.
   */
  function reinit (apiMockOpts) {
    scope?.stop()
    useLoansAPI.mockReturnValue(makeApiMock(apiMockOpts))
    scope = effectScope()
    scope.run(() => { calc = useLoanCalculator() })
  }

  beforeEach(() => { reinit() })
  afterEach(() => { scope.stop(); vi.clearAllMocks() })

  // ─── Interface ────────────────────────────────────────────────────────────

  describe('return interface', () => {
    it('exposes formData', () => {
      expect(calc).toHaveProperty('formData')
    })

    it('exposes results', () => {
      expect(calc).toHaveProperty('results')
    })

    it('exposes apiData', () => {
      expect(calc).toHaveProperty('apiData')
    })

    it('exposes loading and errors from API', () => {
      expect(calc).toHaveProperty('loading')
      expect(calc).toHaveProperty('errors')
    })

    it('exposes validationErrors, isLoading, isFormComplete, hasValidationErrors', () => {
      expect(calc).toHaveProperty('validationErrors')
      expect(calc).toHaveProperty('isLoading')
      expect(calc).toHaveProperty('isFormComplete')
      expect(calc).toHaveProperty('hasValidationErrors')
    })

    it('exposes updateField, submitForm, clearErrors actions', () => {
      expect(typeof calc.updateField).toBe('function')
      expect(typeof calc.submitForm).toBe('function')
      expect(typeof calc.clearErrors).toBe('function')
    })
  })

  // ─── formData initial state ───────────────────────────────────────────────

  describe('formData initial state', () => {
    it('initializes loanAmount to 1000', () => {
      expect(calc.formData.value.loanAmount).toBe(1000)
    })

    it('initializes loanPurpose to null (before API data applied)', () => {
      reinit({ purposes: [] })
      expect(calc.formData.value.loanPurpose).toBeNull()
    })

    it('each instance has independent state', () => {
      let calc1, calc2
      const s = effectScope()
      s.run(() => {
        calc1 = useLoanCalculator()
        calc2 = useLoanCalculator()
      })
      calc1.updateField('loanAmount', 50000)
      expect(calc1.formData.value.loanAmount).toBe(50000)
      expect(calc2.formData.value.loanAmount).toBe(1000)
      s.stop()
    })
  })

  // ─── API orchestration ────────────────────────────────────────────────────

  describe('API orchestration', () => {
    it('calls useLoansAPI with the provided baseUrl', () => {
      const s = effectScope()
      s.run(() => { useLoanCalculator('http://test-host:9000') })
      expect(useLoansAPI).toHaveBeenCalledWith('http://test-host:9000')
      s.stop()
    })

    it('exposes loanPurposes, repaymentPeriods, loanTerms via apiData', () => {
      expect(calc.apiData.value.loanPurposes).toEqual(MOCK_PURPOSES)
      expect(calc.apiData.value.repaymentPeriods).toEqual(MOCK_PERIODS)
      expect(calc.apiData.value.loanTerms).toEqual(MOCK_TERMS)
    })

    it('passes loading state through from useLoansAPI', () => {
      reinit({ loadingOverrides: { purposes: true } })
      expect(calc.loading.value.purposes).toBe(true)
    })

    it('passes error state through from useLoansAPI', () => {
      reinit({ errorsOverrides: { purposes: 'Network error' } })
      expect(calc.errors.value.purposes).toBe('Network error')
    })

    it('isLoading reflects underlying API loading state', () => {
      reinit({ loadingOverrides: { periods: true } })
      expect(calc.isLoading.value).toBe(true)
    })

    it('apiData falls back to empty arrays when API returns nothing', () => {
      reinit({ purposes: [], periods: [], terms: [] })
      expect(calc.apiData.value.loanPurposes).toEqual([])
    })
  })

  // ─── Default selections ───────────────────────────────────────────────────

  describe('default selections from API data', () => {
    it('formData.loanPurpose defaults to the first API option before user selection', () => {
      expect(calc.formData.value.loanPurpose).toBe(MOCK_PURPOSES[0].value)
    })

    it('formData.repaymentPeriod defaults to the first API option before user selection', () => {
      expect(calc.formData.value.repaymentPeriod).toBe(MOCK_PERIODS[0].value)
    })

    it('formData.loanTerm defaults to the first API option before user selection', () => {
      expect(calc.formData.value.loanTerm).toBe(MOCK_TERMS[0].value)
    })

    it('formData.loanPurpose is null when API returns no options', () => {
      reinit({ purposes: [] })
      expect(calc.formData.value.loanPurpose).toBeNull()
    })
  })

  // ─── User selection overrides defaults ───────────────────────────────────

  describe('user selection overrides defaults', () => {
    it('formData.loanPurpose reflects user selection after updateField', () => {
      calc.updateField('loanPurpose', 'vehicle')
      expect(calc.formData.value.loanPurpose).toBe('vehicle')
    })

    it('formData.repaymentPeriod reflects user selection after updateField', () => {
      calc.updateField('repaymentPeriod', 26)
      expect(calc.formData.value.repaymentPeriod).toBe(26)
    })

    it('formData.loanAmount reflects user-supplied value after updateField', () => {
      calc.updateField('loanAmount', 50000)
      expect(calc.formData.value.loanAmount).toBe(50000)
    })

    it('updateField ignores unknown field names', () => {
      expect(() => calc.updateField('unknownField', 'value')).not.toThrow()
    })
  })

  // ─── isFormComplete ───────────────────────────────────────────────────────

  describe('isFormComplete', () => {
    it('is true when all fields have values (using API defaults)', () => {
      expect(calc.isFormComplete.value).toBe(true)
    })

    it('is false when loanAmount is null', () => {
      calc.updateField('loanAmount', null)
      expect(calc.isFormComplete.value).toBe(false)
    })

    it('is false when API returns no options (no defaults available)', () => {
      reinit({ purposes: [], periods: [], terms: [] })
      expect(calc.isFormComplete.value).toBe(false)
    })
  })

  // ─── results calculation ──────────────────────────────────────────────────

  describe('results', () => {
    it('calculates results when the form is complete and valid', () => {
      // loanAmount=1000, purpose=general(10%), period=monthly(12), term=12mo
      expect(calc.results.value.paymentPerPeriod).not.toBeNull()
      expect(calc.results.value.totalPayment).not.toBeNull()
      expect(calc.results.value.paymentPerPeriod).toBeGreaterThan(0)
    })

    it('returns null values when the form is incomplete', () => {
      reinit({ purposes: [], periods: [], terms: [] })
      expect(calc.results.value.paymentPerPeriod).toBeNull()
      expect(calc.results.value.totalPayment).toBeNull()
    })

    it('returns null values when there are validation errors', () => {
      calc.updateField('loanAmount', 500) // below minimum
      expect(calc.results.value.paymentPerPeriod).toBeNull()
    })

    it('recalculates when loanAmount changes to a valid value', () => {
      calc.updateField('loanAmount', 20000)
      expect(calc.results.value.paymentPerPeriod).toBeGreaterThan(0)
    })

    it('recalculates when loanPurpose changes (different annualRate)', () => {
      const resultGeneral = calc.results.value.paymentPerPeriod
      calc.updateField('loanPurpose', 'vehicle') // 12% vs 10%
      expect(calc.results.value.paymentPerPeriod).toBeGreaterThan(resultGeneral)
    })

    it('total payment equals paymentPerPeriod × number of periods', () => {
      const { paymentPerPeriod, totalPayment } = calc.results.value
      const term = calc.formData.value.loanTerm
      const period = calc.formData.value.repaymentPeriod
      expect(totalPayment).toBeCloseTo(paymentPerPeriod * (term / 12) * period, 5)
    })
  })

  // ─── validation ───────────────────────────────────────────────────────────

  describe('form validation', () => {
    it('hasValidationErrors is false initially', () => {
      expect(calc.hasValidationErrors.value).toBe(false)
    })

    it('hasValidationErrors becomes true after an invalid updateField', () => {
      calc.updateField('loanAmount', 999) // below minimum
      expect(calc.hasValidationErrors.value).toBe(true)
    })

    it('validationErrors.loanAmount is populated after invalid amount', () => {
      calc.updateField('loanAmount', 0)
      expect(calc.validationErrors.value.loanAmount).toBeTruthy()
    })

    it('clearErrors resets all validation errors', () => {
      calc.updateField('loanAmount', 0)
      calc.clearErrors()
      expect(calc.validationErrors.value.loanAmount).toBeNull()
      expect(calc.hasValidationErrors.value).toBe(false)
    })

    it('submitForm returns valid:true for a complete valid form', () => {
      expect(calc.submitForm().valid).toBe(true)
    })

    it('submitForm returns valid:false for a form with null loanAmount', () => {
      calc.updateField('loanAmount', null)
      expect(calc.submitForm().valid).toBe(false)
    })
  })
})
